// Variation A — "Tactile Grid"
// Playful, soft pastels, big serif display, Three.js floating shapes,
// sticky-note labels and tape-style accents.

function VariationA({ tweaks, HeroOverride }) {
  const P = window.PORTFOLIO;
  const motion = tweaks?.motion ?? "lively";
  const palette = tweaks?.paletteA ?? "pastel";
  const display = tweaks?.displayFont ?? "Fraunces";
  const body = tweaks?.bodyFont ?? "Inter";

  // Palette options
  const palettes = {
    pastel: { bg: "#f3eee5", ink: "#1a1612", c1: "#ffb4a2", c2: "#cdb4db", c3: "#a8dadc", c4: "#ffd166", accent: "#4a7cf7" },
    citrus: { bg: "#fef6e4", ink: "#172026", c1: "#f582ae", c2: "#8bd3dd", c3: "#fcd34d", c4: "#b9fbc0", accent: "#ef4444" },
    candy: { bg: "#fff0f5", ink: "#241023", c1: "#ff70a6", c2: "#70d6ff", c3: "#ffd670", c4: "#a0e7a0", accent: "#7b2cbf" }
  };
  const c = palettes[palette] || palettes.pastel;

  const heroRef = React.useRef(null);

  // Three.js floating shapes scene (skipped when video hero is active)
  React.useEffect(() => {
    if (HeroOverride) return;
    if (!heroRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const el = heroRef.current;
    const w = () => el.clientWidth;
    const h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w() / h(), 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w(), h());
    el.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    const toCol = (hex) => new THREE.Color(hex);
    const objs = [];

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.7, 0.25, 120, 16),
      new THREE.MeshStandardMaterial({ color: toCol(c.c1), roughness: 0.35, metalness: 0.05 })
    );
    torus.position.set(-2.6, 0.6, 0);
    scene.add(torus);objs.push(torus);

    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({ color: toCol(c.c2), flatShading: true, roughness: 0.5 })
    );
    sphere.position.set(2.6, 1.0, -0.5);
    scene.add(sphere);objs.push(sphere);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.1, 1.1),
      new THREE.MeshStandardMaterial({ color: toCol(c.c3), roughness: 0.6 })
    );
    box.position.set(2.0, -1.4, 0.5);
    scene.add(box);objs.push(box);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.3, 5),
      new THREE.MeshStandardMaterial({ color: toCol(c.c4), roughness: 0.5 })
    );
    cone.position.set(-2.2, -1.6, 0.2);
    scene.add(cone);objs.push(cone);

    let mx = 0,my = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const speed = motion === "calm" ? 0.3 : motion === "wild" ? 1.6 : 1.0;
    let raf,t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) * 0.001 * speed;
      objs.forEach((o, i) => {
        o.rotation.x = t * (0.3 + i * 0.1);
        o.rotation.y = t * (0.4 + i * 0.07);
        o.position.y += Math.sin(t * 1.2 + i) * 0.0025;
      });
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      try {el.removeChild(renderer.domElement);} catch (e) {}
    };
  }, [c.c1, c.c2, c.c3, c.c4, motion, HeroOverride]);

  const fontFamilyDisplay = `'${display}', Georgia, serif`;
  const fontFamilyBody = `'${body}', system-ui, sans-serif`;

  return (
    <div style={{
      background: c.bg, color: c.ink, fontFamily: fontFamilyBody,
      minHeight: "100%", overflowX: "hidden"
    }}>
      <style>{`
        .va a{color:inherit}
        .va-display{font-family:${fontFamilyDisplay};font-weight:400;letter-spacing:-0.02em;line-height:.95}
        .va-tape{position:absolute;width:80px;height:22px;background:rgba(255,255,255,.55);
          box-shadow:0 1px 2px rgba(0,0,0,.06);transform:rotate(-4deg)}
        .va-card{background:#fff;border-radius:18px;box-shadow:0 1px 0 rgba(0,0,0,.04),0 12px 30px -12px rgba(0,0,0,.18)}
        .va-pill{display:inline-flex;align-items:center;gap:.4em;padding:.35em .8em;border:1px solid ${c.ink}22;border-radius:999px;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
        .va-link{position:relative;display:inline-block}
        .va-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:${c.accent};transform:scaleX(0);transform-origin:left;transition:transform .35s ease}
        .va-link:hover::after{transform:scaleX(1)}
        .va-marquee{display:flex;gap:60px;white-space:nowrap;animation:vamq ${motion === "calm" ? "60s" : motion === "wild" ? "18s" : "32s"} linear infinite}
        @keyframes vamq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .va-proj{position:relative;border-radius:24px;overflow:hidden;cursor:pointer;transition:transform .4s cubic-bezier(.2,.7,.3,1)}
        .va-proj:hover{transform:translateY(-4px)}
        .va-proj .va-bg{position:absolute;inset:0;transition:transform .6s cubic-bezier(.2,.7,.3,1)}
        .va-proj:hover .va-bg{transform:scale(1.04)}
        .va-stickynote{background:${c.c4};color:${c.ink};padding:14px 16px;border-radius:4px;
          box-shadow:0 8px 18px -8px rgba(0,0,0,.18);transform:rotate(-2deg);font-size:14px}
        .va-step{position:relative;padding:24px;border:1.5px dashed ${c.ink}33;border-radius:18px;background:#ffffff66}
        .va-num{font-family:${fontFamilyDisplay};font-size:48px;line-height:1;color:${c.accent}}
        .va-tools li{display:inline-flex;align-items:center;gap:.5em;padding:.5em 1em;background:#fff;border-radius:999px;border:1px solid ${c.ink}11;font-size:13px;margin:0 6px 8px 0}
        .va-tools li::before{content:"";width:8px;height:8px;border-radius:50%;background:${c.accent};display:inline-block}
        .va-arrow{display:inline-block;transition:transform .3s}
        .va-proj:hover .va-arrow{transform:translate(4px,-4px)}
        .va-blob{position:absolute;border-radius:50%;filter:blur(40px);opacity:.6;pointer-events:none}
        image-slot{display:block;width:100%;height:100%}

        /* Hero mobile */
        @media (max-width: 768px) {
          .va-hero-section { height: 100svh !important; }
          .va-hero-bg { position: absolute !important; }
          .va-hero-bg img { position: absolute !important; width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: center !important; transform: none !important; }
          /* Marquee section height */
          .va-marquee-section { padding: 12px 0 !important; }
          /* Marquee text */
          .va-marquee { font-size: 16px !important; gap: 24px !important; }
          .va-marquee > div { gap: 24px !important; }
        }

        /* ───────────── MOBILE (≤768px) ───────────── */
        @media (max-width: 768px) {
          /* Section padding */
          #work, #about { padding: 60px 20px !important; }
          #process { padding: 60px 20px !important; }
          #contact { padding: 72px 20px !important; }

          /* Section headers stack */
          .va-work-header, .va-process-header { flex-direction: column !important; align-items: flex-start !important; gap: 18px !important; }
          .va-work-header > div:last-child { max-width: 100% !important; }
          .va-work-header h2.va-display, .va-process-header h2.va-display { font-size: 44px !important; }
          #about h2.va-display { font-size: 40px !important; }

          /* Marquee section height */
          .va-marquee-section { padding: 12px 0 !important; }
          /* Marquee text */
          .va-marquee { font-size: 16px !important; gap: 24px !important; }
          .va-marquee > div { gap: 24px !important; }

          /* Work grids → 1 col */
          .va-work-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .va-ph-grid { grid-template-columns: 1fr !important; gap: 14px !important; }

          /* Modal */
          #work .va-modal { border-radius: 18px !important; max-height: 92vh !important; }
          #work .va-modal-body { padding: 28px 20px 34px !important; }
          #work .va-modal-body h2.va-display { font-size: 36px !important; }
          #work .va-modal-body p { font-size: 15px !important; }
          .va-gallery-grid { grid-template-columns: 1fr 1fr !important; }

          /* About → stack */
          .va-about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .va-about-meta { gap: 20px !important; }
          #about .va-tape { left: 14px !important; font-size: 11px !important; padding: 0 12px !important; }

          /* Process → 1 col */
          .va-process-grid { grid-template-columns: 1fr !important; gap: 14px !important; }

          /* Contact → stack */
          .va-contact-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .va-contact-portrait { position: static !important; width: 130px !important; height: 130px !important; margin: 0 0 24px !important; }
          #contact h2.va-display { font-size: clamp(52px, 15vw, 88px) !important; margin: 20px 0 36px !important; }
          #contact a.va-display { font-size: 22px !important; word-break: break-word; }
          .va-footer { flex-direction: column !important; gap: 8px !important; margin-top: 56px !important; }
        }

        /* Extra-small phones (≤400px) */
        @media (max-width: 400px) {
          .va-about-meta { grid-template-columns: 1fr !important; }
          .va-work-header h2.va-display, .va-process-header h2.va-display { font-size: 38px !important; }
          .va-gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* CINEMATIC HERO — full-screen video, no overlay */}
      {HeroOverride ?
      <section className="va-hero-section" style={{
        position: "relative", height: "100vh", width: "100%", background: "#000", overflow: "hidden"
      }}>
          <div className="va-hero-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <HeroOverride />
          </div>

          {/* Text baked into hero image */}

          {/* subtle bottom scroll hint */}
          <a href="#work" className="va-scroll-hint" style={{
            position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
            zIndex: 10, color: "rgba(255,255,255,.85)", fontSize: 12, letterSpacing: ".18em",
            textTransform: "uppercase", fontFamily: fontFamilyBody, textDecoration: "none",
            display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8
          }}>
            <span>Scroll</span>
            <span style={{ fontSize: 18, animation: "vabounce 2s ease-in-out infinite" }}>↓</span>
          </a>
          <style>{`@keyframes vabounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}`}</style>
        </section> :

      <>
          {/* Original NAV (used when no HeroOverride) */}
          <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "24px 40px", position: "sticky", top: 0, zIndex: 30,
          background: `${c.bg}cc`, backdropFilter: "blur(8px)"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
              width: 36, height: 36, borderRadius: 10, background: c.accent, color: "#fff",
              display: "grid", placeItems: "center", fontFamily: fontFamilyDisplay, fontSize: 20,
              transform: "rotate(-6deg)"
            }}>O</div>
              <div style={{ fontWeight: 600, letterSpacing: ".02em" }}>Oscar Frederiksen</div>
            </div>
            <div style={{ display: "flex", gap: 28, fontSize: 14 }}>
              <a href="#work" className="va-link">Work</a>
              <a href="#about" className="va-link">About</a>
              <a href="#process" className="va-link">Process</a>
              <a href="#contact" className="va-link">Contact</a>
            </div>
            <a href="#contact" style={{
            background: c.ink, color: c.bg, padding: "10px 18px", borderRadius: 999,
            fontSize: 13, fontWeight: 500, letterSpacing: ".02em"
          }}>Let's talk →</a>
          </nav>

          {/* Original pastel hero */}
          <section style={{ position: "relative", padding: "40px 40px 80px", minHeight: "86vh" }}>
            <div className="va-blob" style={{ background: c.c1, width: 340, height: 340, top: -60, left: -60 }} />
            <div className="va-blob" style={{ background: c.c2, width: 280, height: 280, bottom: 80, right: -40 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, position: "relative" }}>
              <div className="va-pill" style={{ background: "#ffffffaa" }}>
                <span style={{ width: 8, height: 8, borderRadius: 50, background: "#22c55e", boxShadow: "0 0 0 3px #22c55e33" }} />
                Available · {new Date().getFullYear()}
              </div>
              <div style={{ textAlign: "right", fontSize: 13, opacity: .7, maxWidth: 240 }}>
                {P.location}<br />{P.university}
              </div>
            </div>
            <h1 className="va-display" style={{ fontSize: "clamp(56px, 11vw, 180px)", margin: "20px 0", position: "relative", zIndex: 2 }}>
              Hello,<br />
              I'm <span style={{ fontStyle: "italic", color: c.accent }}>Oscar.</span>
            </h1>
            <div ref={heroRef} style={{
            position: "absolute", right: "4%", top: "18%", width: "40%", height: "60%",
            pointerEvents: "none", zIndex: 1
          }} />
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, marginTop: 60, position: "relative", zIndex: 2 }}>
              <p style={{ fontSize: 24, lineHeight: 1.4, maxWidth: 560, fontFamily: fontFamilyDisplay, fontStyle: "italic", fontWeight: 400 }}>
                {P.tagline}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", justifyContent: "flex-end" }}>
                <div className="va-stickynote" style={{ maxWidth: 240 }}>
                  ✦ Currently studying Interactive Media & Web Tech at LNU.
                </div>
                <a href="#work" style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 22px",
                background: c.ink, color: c.bg, borderRadius: 999, fontSize: 14, fontWeight: 500
              }}>
                  See selected work <span>↓</span>
                </a>
              </div>
            </div>
          </section>
        </>
      }

      {/* MARQUEE */}
      <section className="va-marquee-section" style={{
        background: c.ink, color: c.bg, padding: "22px 0", overflow: "hidden",
        borderTop: `1px solid ${c.ink}`, borderBottom: `1px solid ${c.ink}`
      }}>
        <div className="va-marquee" style={{ fontFamily: fontFamilyDisplay, fontSize: 32 }}>
          {Array.from({ length: 2 }).map((_, k) =>
          <div key={k} style={{ display: "flex", gap: 60 }}>
              <span>Interactive Media</span><span style={{ color: c.accent }}>✦</span>
              <span><i>Web Technologies</i></span><span style={{ color: c.accent }}>✦</span>
              <span>3D Development</span><span style={{ color: c.accent }}>✦</span>
              <span><i>UI / UX</i></span><span style={{ color: c.accent }}>✦</span>
              <span>Brand Systems</span><span style={{ color: c.accent }}>✦</span>
            </div>
          )}
        </div>
      </section>

      {/* WORK */}
      {(() => {
        const [activeProj, setActiveProj] = React.useState(null);
        const realProjects = P.projects.filter((p) => !p.placeholder);
        const placeholders = P.projects.filter((p) => p.placeholder);
        return (
          <section id="work" style={{ padding: "100px 40px" }}>
            <style>{`
              .va-pcard{background:#fff;border-radius:20px;overflow:hidden;cursor:pointer;
                transition:transform .35s cubic-bezier(.2,.7,.3,1),box-shadow .35s;
                box-shadow:0 2px 0 rgba(0,0,0,.04),0 8px 24px -8px rgba(0,0,0,.12)}
              .va-pcard:hover{transform:translateY(-6px);box-shadow:0 4px 0 rgba(0,0,0,.04),0 20px 40px -12px rgba(0,0,0,.2)}
              .va-pcard-img{width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top;display:block}
              .va-pcard video{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
              .va-pcard-placeholder-img{width:100%;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;
                font-size:13px;font-family:ui-monospace,monospace;opacity:.5}
              .va-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;
                display:flex;align-items:center;justify-content:center;padding:24px;
                animation:vaModalIn .2s ease}
              @keyframes vaModalIn{from{opacity:0}to{opacity:1}}
              .va-modal{background:#fff;border-radius:24px;max-width:960px;width:100%;max-height:90vh;
                overflow-y:auto;position:relative;animation:vaModalSlide .25s cubic-bezier(.2,.7,.3,1)}
              @keyframes vaModalSlide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
              .va-modal-close{position:absolute;top:20px;right:20px;width:36px;height:36px;
                border-radius:999px;border:1.5px solid rgba(0,0,0,.15);background:#fff;
                cursor:pointer;font-size:18px;display:grid;place-items:center;z-index:10;
                transition:background .2s}
              .va-modal-close:hover{background:#f5f5f5}
              .va-visit-btn{display:inline-flex;align-items:center;gap:10px;margin-top:32px;
                padding:14px 24px;background:${c.ink};color:${c.bg};border-radius:999px;font-size:14px;font-weight:500;
                text-decoration:none;transition:background .25s,transform .25s,box-shadow .25s}
              .va-visit-btn:hover{background:${c.accent};transform:translateY(-2px);box-shadow:0 8px 24px ${c.accent}44}
            `}</style>

            {/* Modal */}
            {activeProj &&
            <div className="va-modal-overlay" onClick={() => setActiveProj(null)}>
                <div className="va-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="va-modal-close" onClick={() => setActiveProj(null)}>✕</button>
                  {activeProj.video ?
                <video src={activeProj.video} autoPlay muted loop playsInline
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "24px 24px 0 0" }} /> :
                activeProj.img &&
                <img src={activeProj.img} alt={activeProj.title}
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", borderRadius: "24px 24px 0 0" }} />

                }
                  <div className="va-modal-body" style={{ padding: "40px 48px 48px", color: c.ink, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", justifyContent: "center" }}>
                      <span className="va-pill" style={{ background: `${activeProj.color}18`, borderColor: `${activeProj.color}44`, color: activeProj.color }}>
                        {activeProj.tag}
                      </span>
                      <span className="va-pill">{activeProj.sub}</span>
                      {activeProj.stack.map((s) =>
                    <span key={s} className="va-pill">{s}</span>
                    )}
                    </div>
                    <h2 className="va-display" style={{ fontSize: 56, marginBottom: 24, lineHeight: 1, textAlign: "center" }}>{activeProj.title}</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                      {activeProj.desc.map((par, i) =>
                    <p key={i} style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 680, margin: 0, opacity: .85, textAlign: "center" }}>{par}</p>
                    )}
                    </div>

                    {/* Image gallery for projects with multiple renders */}
                    {activeProj.gallery && activeProj.gallery.length > 0 &&
                  <div style={{ width: "100%", marginTop: 32 }}>
                        <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", opacity: .5, marginBottom: 14, textAlign: "center" }}>
                          Gallery — {activeProj.gallery.length} renders
                        </div>
                        <div className="va-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                          {activeProj.gallery.map((src, i) =>
                      <img key={i} src={src} alt={`Render ${i + 1}`}
                      style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 10, display: "block", cursor: "zoom-in", transition: "transform .3s,box-shadow .3s" }}
                      onMouseEnter={(e) => {e.currentTarget.style.transform = "scale(1.03)";e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.18)";}}
                      onMouseLeave={(e) => {e.currentTarget.style.transform = "scale(1)";e.currentTarget.style.boxShadow = "none";}}
                      onClick={() => {
                        const ov = document.createElement("div");
                        ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out";
                        const img = document.createElement("img");
                        img.src = src;img.style.cssText = "max-width:90vw;max-height:88vh;object-fit:contain;border-radius:8px";
                        ov.appendChild(img);ov.onclick = () => document.body.removeChild(ov);
                        document.body.appendChild(ov);
                      }} />

                      )}
                        </div>
                      </div>
                  }

                    {activeProj.link && activeProj.link !== "#" &&
                  <a href={activeProj.link} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 10, marginTop: 32,
                    padding: "14px 24px", background: c.ink, color: c.bg, borderRadius: 999, fontSize: 14, fontWeight: 500
                  }} className="va-visit-btn">Visit project →</a>
                  }
                  </div>
                </div>
              </div>
            }

            {/* Header */}
            <div className="va-work-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
              <div>
                <div className="va-pill">Selected work</div>
                <h2 className="va-display" style={{ fontSize: 72, marginTop: 16 }}>
                  Things I've <span style={{ fontStyle: "italic", color: c.accent }}>made</span>.
                </h2>
              </div>
              <div style={{ maxWidth: 320, fontSize: 14, opacity: .7, lineHeight: 1.6 }}>Selected work from school and personal projects — click any card to explore the full case study.

              </div>
            </div>

            {/* Real project cards — 2 col grid */}
            <div className="va-work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 28, marginBottom: 28 }}>
              {realProjects.map((p) =>
              <div key={p.id} className="va-pcard" onClick={() => p.page ? (window.location.href = p.page) : setActiveProj(p)}>
                  {p.img ?
                <img src={p.img} alt={p.title} className="va-pcard-img" style={p.imgPosition ? { objectPosition: p.imgPosition } : undefined} /> :
                <div className="va-pcard-placeholder-img" style={{ background: `${p.color}22` }}>No image yet</div>
                }
                  <div style={{ padding: "24px 28px 28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span className="va-pill" style={{ ...{ background: `${p.color}18`, borderColor: `${p.color}44`, color: p.color }, color: "rgb(45, 106, 63)" }}>{p.tag}</span>
                        {p.stack.map((s) => <span key={s} className="va-pill">{s}</span>)}
                      </div>
                      <span style={{ fontSize: 12, opacity: .5, letterSpacing: ".06em", fontFamily: "ui-monospace,monospace" }}>{p.year}</span>
                    </div>
                    <div className="va-display" style={{ fontSize: 36, margin: "10px 0 8px", lineHeight: 1 }}>{p.title}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, opacity: .75, margin: 0 }}>{p.blurb}</p>
                    <div style={{ ...{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 500, color: p.color }, color: "#4a7cf7" }}>
                      Learn more <span style={{ color: "#4a7cf7" }}>↗</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Placeholder cards — 3 col */}
            <div className="va-ph-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {placeholders.map((p) =>
              <div key={p.id} style={{
                background: `${p.color}18`, border: `1.5px dashed ${c.ink}22`,
                borderRadius: 20, padding: "32px 28px",
                display: "flex", flexDirection: "column", gap: 12, minHeight: 160,
                justifyContent: "center"
              }}>
                  <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, opacity: .5, letterSpacing: ".1em" }}>{p.no}</div>
                  <div className="va-display" style={{ fontSize: 24, opacity: .35 }}>{p.title}</div>
                  <div style={{ fontSize: 13, opacity: .45 }}>{p.blurb}</div>
                </div>
              )}
            </div>
          </section>);

      })()}

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 40px", background: `${c.c2}33` }}>
        <div className="va-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div className="va-tape" style={{ top: -10, left: 40, width: "auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, letterSpacing: ".02em", whiteSpace: "nowrap" }}>Oscar Frederiksen ✦ 25 years old</div>
            {/* 3D character replaces portrait */}
            <div style={{ position: "relative" }}>
              <window.CharacterViewer height={520} bgColor={`linear-gradient(135deg, ${c.c1}55, ${c.c3}55)`} />
            </div>
            <div className="va-stickynote" style={{ position: "absolute", bottom: -20, right: -10, maxWidth: 200, background: c.c3 }}>växjö, sweden

            </div>
          </div>
          <div>
            <div className="va-pill">About</div>
            <h2 className="va-display" style={{ fontSize: 64, margin: "16px 0 24px" }}>
              A <span style={{ fontStyle: "italic", color: c.accent }}>curious</span> student,<br />
              building things on the web.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 540, marginBottom: 24 }}>
              {P.about}
            </p>
            <div className="va-about-meta" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .6, marginBottom: 10 }}>Focus</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
                  {P.focus.map((f) => <li key={f}>— {f}</li>)}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .6, marginBottom: 10 }}>Tools</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {[
                  { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
                  { name: "Figma", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
                  { name: "Photoshop", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg" },
                  { name: "Illustrator", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg" },
                  { name: "Blender", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg" },
                  { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
                  { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
                  { name: "HTML5", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
                  { name: "CSS3", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
                  { name: "Three.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg" },
                  { name: "Aseprite", url: "https://cdn.simpleicons.org/aseprite" },
                  { name: "Premiere", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/premierepro/premierepro-original.svg" }].
                  map(({ name, url }) => {
                    const [hovered, setHovered] = React.useState(false);
                    const [imgOk, setImgOk] = React.useState(true);
                    return (
                      <div key={name}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "12px 14px", borderRadius: 14,
                        background: "#fff",
                        border: `1.5px solid ${c.ink}11`,
                        transition: "all .25s cubic-bezier(.2,.7,.3,1)",
                        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                        minWidth: 60
                      }}>
                        {imgOk ?
                        <img src={url} alt={name}
                        style={{ width: 28, height: 28, objectFit: "contain" }}
                        onError={() => setImgOk(false)} /> :

                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: c.accent + "33", display: "grid", placeItems: "center",
                          fontSize: 11, fontWeight: 700, color: c.accent
                        }}>{name.slice(0, 2).toUpperCase()}</div>
                        }
                        <span style={{ fontSize: 10, letterSpacing: ".04em", opacity: .7, whiteSpace: "nowrap" }}>{name}</span>
                      </div>);

                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline removed */}

      {/* PROCESS */}
      <section id="process" style={{ padding: "100px 40px", background: `${c.c4}33` }}>
        <div className="va-process-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div className="va-pill">How I work</div>
            <h2 className="va-display" style={{ fontSize: 64, marginTop: 16 }}>
              From idea to <span style={{ fontStyle: "italic", color: c.accent }}>Final Product</span>.
            </h2>
          </div>
        </div>
        <div className="va-process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {P.process.map((s) =>
          <div key={s.step} className="va-step">
              <div className="va-num">{s.step}</div>
              <div className="va-display" style={{ fontSize: 28, margin: "12px 0 8px" }}>{s.name}</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, opacity: .8 }}>{s.body}</p>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "120px 40px", background: c.ink, color: c.bg, position: "relative", overflow: "hidden" }}>
        <div className="va-blob" style={{ background: c.accent, width: 500, height: 500, bottom: -200, left: -100, opacity: .3 }} />
        <div className="va-blob" style={{ background: c.c2, width: 400, height: 400, top: -100, right: -50, opacity: .25 }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          {/* Portrait bubble — top right */}
          <div className="va-contact-portrait" style={{
            position: "absolute", top: -60, right: 0, zIndex: 2,
            width: 220, height: 220, borderRadius: "50%", overflow: "hidden",
            boxShadow: `0 4px 32px rgba(0,0,0,.35), 0 0 0 3px ${c.accent}`
          }}>
            <div style={{
              width: "100%", height: "100%",
              backgroundImage: "url('assets/portrait.jpeg')",
              backgroundSize: "220%",
              backgroundPosition: "52% 18%",
              backgroundRepeat: "no-repeat"
            }} />
          </div>

          <div className="va-pill" style={{ borderColor: `${c.bg}44`, color: c.bg }}>Contact</div>
          <h2 className="va-display" style={{ fontSize: "clamp(64px,9vw,140px)", margin: "24px 0 48px", lineHeight: .95 }}>
            Let's <span style={{ fontStyle: "italic", color: c.accent }}>build</span><br />something useful.
          </h2>
          <div className="va-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 40 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5, marginBottom: 10 }}>Email</div>
              <a href={`mailto:${P.email}`} className="va-display" style={{ fontSize: 32, color: c.bg, textDecoration: "none" }}>
                {P.email}
              </a>
              <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5, margin: "40px 0 10px" }}>Phone</div>
              <a href={`tel:${P.phone.replace(/\s/g, "")}`} className="va-display" style={{ fontSize: 28, color: c.bg, textDecoration: "none" }}>
                {P.phone}
              </a>
            </div>
            <div>
              <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5, marginBottom: 14 }}>Elsewhere</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {P.socials.map((s) =>
                <a key={s.label} href={s.href} className="va-link" style={{ fontSize: 18 }} target="_blank" rel="noopener noreferrer">
                    {s.label} →
                  </a>
                )}
              </div>
              <a href="cv/index.html" target="_blank" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                marginTop: 32, padding: "16px 24px", border: `1px solid ${c.bg}33`, borderRadius: 999, fontSize: 14
              }}>
                View CV ↗
              </a>
            </div>
          </div>
          <div className="va-footer" style={{ marginTop: 80, paddingTop: 32, borderTop: `1px solid ${c.bg}22`, display: "flex", justifyContent: "space-between", fontSize: 12, opacity: .6 }}>
            <div>© {new Date().getFullYear()} Oscar Frederiksen</div>
            <div>Designed & built with care · Växjö</div>
          </div>
        </div>
      </section>
    </div>);

}

window.VariationA = VariationA;