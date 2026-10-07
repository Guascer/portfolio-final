// character-viewer.jsx
// Renders assets/character.glb in a Three.js canvas.
// Depends on window.THREE (ESM build) + window.GLTFLoader being set
// before this component mounts.

function CharacterViewer({ height = 520, bgColor = null }) {
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const el = mountRef.current;
    if (!el || !window.THREE || !window.GLTFLoader) return;

    const THREE = window.THREE;
    const w = el.clientWidth;
    const h = el.clientHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100);
    camera.position.set(0, 1.2, 3.8);

    // ── Lights ────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xfff5e8, 1.2);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff0d8, 2.2);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.8);
    fill.position.set(-3, 2, 1);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffd6a5, 0.6);
    rim.position.set(0, 3, -3);
    scene.add(rim);

    // ── Ground shadow disc ────────────────────────────────────
    const shadowGeo = new THREE.CircleGeometry(0.9, 40);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: 0.12,
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -0.01;
    scene.add(shadowDisc);

    // ── Load GLB ──────────────────────────────────────────────
    let mixer = null;
    let model = null;
    const eyeMeshes = []; // { mesh, origPos }
    let isHovered = false;

    const loader = new window.GLTFLoader();
    loader.load(
      'assets/character.glb',
      (gltf) => {
        model = gltf.scene;

        // Auto-centre & scale to fit view
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(centre.multiplyScalar(scale));

        // Sit on ground
        const box2 = new THREE.Box3().setFromObject(model);
        model.position.y -= box2.min.y;

        // Flat-shading + find eye meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.flatShading = true;
              child.material.needsUpdate = true;
            }
            // Collect eye/pupil meshes by name
            const n = child.name.toLowerCase();
            if (
              n.includes('eye') || n.includes('pupil') ||
              n.includes('iris') || n.includes('sclera') ||
              n.includes('öga') || n.includes('vit') ||
              n === 'right-eye' || n === 'left-eye'
            ) {
              eyeMeshes.push({
                mesh: child,
                origX: child.position.x,
                origY: child.position.y,
                origZ: child.position.z,
              });
            }
          }
        });

        // Debug: log all mesh names so user can confirm
        if (eyeMeshes.length === 0) {
          console.log('[CharacterViewer] No eye meshes found by name. All meshes:');
          model.traverse((c) => { if (c.isMesh) console.log(' •', c.name); });
        } else {
          console.log('[CharacterViewer] Eye meshes found:', eyeMeshes.map(e => e.mesh.name));
        }

        scene.add(model);

        // Animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      (err) => console.warn('GLB load error:', err)
    );

    // ── Mouse tracking ──────────────────────────────────────
    let mouseNX = 0, mouseNY = 0; // normalised -1..1
    let targetRY = 0, targetRX = 0;
    let currentRY = 0, currentRX = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top)  / rect.height - 0.5;
      targetRY  = nx *  0.6;   // horizontal body rotation
      targetRX  = ny *  0.25;  // vertical body tilt — subtle
      mouseNX   = nx * 2;
      mouseNY   = -ny * 2;
    };
    const onEnter = () => { isHovered = true; };
    const onLeave = () => {
      isHovered = false;
      mouseNX = 0; mouseNY = 0;
      targetRY = 0; targetRX = 0;
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    // ── Render loop ───────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();
    const MAX_EYE_OFFSET = 0.09; // max local-space units pupils can travel
    let eyeNX = 0, eyeNY = 0;   // smoothed eye target

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);

      // Smooth body rotation (horizontal + vertical tilt)
      currentRY += (targetRY - currentRY) * 0.06;
      currentRX += (targetRX - currentRX) * 0.06;
      if (model) {
        model.rotation.y = currentRY;
        model.rotation.x = currentRX;
      }

      // Gentle idle float
      if (model) {
        model.position.y += Math.sin(clock.elapsedTime * 1.2) * 0.0008;
      }

      // Eye tracking — smooth pupils toward mouse
      eyeNX += (mouseNX - eyeNX) * 0.08;
      eyeNY += (mouseNY - eyeNY) * 0.08;
      eyeMeshes.forEach(({ mesh, origX, origY, origZ }) => {
        mesh.position.x = origX + eyeNX * MAX_EYE_OFFSET;
        mesh.position.y = origY + eyeNY * MAX_EYE_OFFSET;
        mesh.position.z = origZ;
      });

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      try { el.removeChild(renderer.domElement); } catch (e) {}
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: 18,
        overflow: 'hidden',
        background: bgColor || 'transparent',
        cursor: 'grab',
      }}
    />
  );
}

window.CharacterViewer = CharacterViewer;
