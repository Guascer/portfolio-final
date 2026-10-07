// Variation B — "Kinetic Y2K"
// High-saturation electric colors, chunky display, glitch hover, marquee,
// Three.js wireframe shapes.

function VariationB({ tweaks }) {
  const P = window.PORTFOLIO;
  const motion = tweaks?.motion ?? "lively";
  const palette = tweaks?.paletteB ?? "electric";
  const display = tweaks?.displayFont ?? "Fraunces";
  const body = tweaks?.bodyFont ?? "Inter";

  const palettes = {
    electric: { bg:"#0a0a0f", ink:"#f5f3ff", c1:"#ff2d95", c2:"#00f0ff", c3:"#caff00", c4:"#7b5cff", accent:"#ff2d95" },
    sunset:   { bg:"#100a14", ink:"#fff7ed", c1:"#ff5c00", c2:"#ffd60a", c3:"#ff006e", c4:"#8338ec", accent:"#ff5c00" },
    aqua:     { bg:"#001219", ink:"#e0fbfc", c1:"#00f5d4", c2:"#fee440", c3:"#f15bb5", c4:"#9b5de5", accent:"#00f5d4" },
  };
  const c = palettes[palette] || palettes.electric;

  const heroRef = React.useRef(null);

  React.useEffect(() => {
    if (!heroRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const el = heroRef.current;
    const w = () => el.clientWidth;
    const h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w()/h(), 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w(), h());
    el.appendChild(renderer.domElement);
    renderer.domElement.style.position="absolute";
    renderer.domElement.style.inset="0";
    renderer.domElement.style.pointerEvents="none";

    // Wireframe icosahedron with glow
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const mat = new THREE.MeshBasicMaterial({ color: c.c2, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Inner solid
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 0),
      new THREE.MeshBasicMaterial({ color: c.c1, transparent:true, opacity:.25 })
    );
    scene.add(inner);

    // particle ring
    const pGeo = new THREE.BufferGeometry();
    const N = 600;
    const pos = new Float32Array(N*3);
    for (let i=0;i<N;i++){
      const a = (i/N) * Math.PI*2;
      const r = 3.2 + Math.random()*0.8;
      pos[i*3]   = Math.cos(a)*r;
      pos[i*3+1] = (Math.random()-0.5)*0.4;
      pos[i*3+2] = Math.sin(a)*r;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos,3));
    const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: c.c3, size: 0.04 }));
    scene.add(points);

    let mx=0,my=0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left)/r.width - 0.5) * 2;
      my = ((e.clientY - r.top)/r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const speed = motion==="calm"?0.3:motion==="wild"?1.8:1.0;
    let raf, t0=performance.now();
    const tick = () => {
      const t = (performance.now()-t0)*0.001*speed;
      mesh.rotation.x = t*0.4; mesh.rotation.y = t*0.6;
      inner.rotation.x = -t*0.3; inner.rotation.y = -t*0.5;
      points.rotation.y = t*0.2;
      camera.position.x += (mx*1 - camera.position.x)*0.04;
      camera.position.y += (-my*0.6 - camera.position.y)*0.04;
      camera.lookAt(0,0,0);
      renderer.render(scene,camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => { camera.aspect=w()/h(); camera.updateProjectionMatrix(); renderer.setSize(w(),h()); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      try { el.removeChild(renderer.domElement);} catch(e){}
    };
  }, [c.c1, c.c2, c.c3, motion]);

  const fontFamilyDisplay = `'${display}', Georgia, serif`;
  const fontFamilyBody = `'${body}', system-ui, sans-serif`;

  return (
    <div style={{background:c.bg,color:c.ink,fontFamily:fontFamilyBody,minHeight:"100%",overflowX:"hidden"}}>
      <style>{`
        .vb-grid{background-image:
          linear-gradient(${c.ink}11 1px, transparent 1px),
          linear-gradient(90deg, ${c.ink}11 1px, transparent 1px);
          background-size:80px 80px}
        .vb-display{font-family:${fontFamilyDisplay};font-weight:400;letter-spacing:-0.02em;line-height:.9}
        .vb-mono{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
        .vb-marquee{display:flex;gap:60px;white-space:nowrap;animation:vbmq ${motion==="calm"?"50s":motion==="wild"?"14s":"28s"} linear infinite}
        @keyframes vbmq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .vb-glitch{position:relative;display:inline-block;cursor:pointer}
        .vb-glitch::before,.vb-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;opacity:0;transition:opacity .15s}
        .vb-glitch::before{color:${c.c1};transform:translate(-3px,0);clip-path:polygon(0 0,100% 0,100% 45%,0 45%)}
        .vb-glitch::after{color:${c.c2};transform:translate(3px,0);clip-path:polygon(0 55%,100% 55%,100% 100%,0 100%)}
        .vb-glitch:hover::before,.vb-glitch:hover::after{opacity:1}
        .vb-card{position:relative;border:1px solid ${c.ink}22;border-radius:6px;overflow:hidden;cursor:pointer;
          background:${c.bg};transition:all .35s cubic-bezier(.2,.7,.3,1)}
        .vb-card:hover{border-color:${c.c2};transform:translate(-3px,-3px);box-shadow:6px 6px 0 0 ${c.c2}}
        .vb-card .vb-cardbg{position:absolute;inset:0;opacity:.0;transition:opacity .3s}
        .vb-card:hover .vb-cardbg{opacity:.15}
        .vb-tag{display:inline-block;padding:4px 10px;border:1px solid ${c.ink}33;border-radius:4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
        .vb-pill{display:inline-flex;align-items:center;gap:.4em;padding:6px 14px;border:1px solid ${c.ink}44;border-radius:999px;font-size:11px;letter-spacing:.1em;text-transform:uppercase}
        .vb-link{position:relative;display:inline-block;text-decoration:none;color:inherit}
        .vb-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:${c.c2};transform-origin:right;transform:scaleX(0);transition:transform .35s ease}
        .vb-link:hover::after{transform-origin:left;transform:scaleX(1)}
        .vb-blink{animation:vbblink 1.2s steps(2) infinite}
        @keyframes vbblink{50%{opacity:0}}
        .vb-strike{position:relative}
        .vb-strike::before{content:"";position:absolute;left:-4px;right:-4px;top:50%;height:2px;background:${c.c1};transform:scaleX(0);transform-origin:left;transition:transform .4s}
        .vb-row:hover .vb-strike::before{transform:scaleX(1)}
        .vb-row{cursor:pointer;transition:padding .3s,background .3s}
        .vb-row:hover{padding-left:24px;background:${c.ink}05}
        .vb-row:hover .vb-arrow{opacity:1;transform:translateX(0)}
        .vb-arrow{opacity:0;transform:translateX(-10px);transition:all .3s}
        .vb-noise{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.04;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
      `}</style>

      <div className="vb-noise"/>

      {/* NAV */}
      <nav style={{
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"20px 32px",position:"sticky",top:0,zIndex:30,
        background:`${c.bg}cc`, backdropFilter:"blur(10px)",
        borderBottom:`1px solid ${c.ink}11`,
      }}>
        <div className="vb-mono" style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{display:"inline-block",width:8,height:8,background:c.c2,borderRadius:50}} className="vb-blink"/>
          OSCAR.FREDERIKSEN/PORTFOLIO·V2
        </div>
        <div style={{display:"flex",gap:32,fontSize:13}}>
          <a href="#work" className="vb-link">[01] Work</a>
          <a href="#about" className="vb-link">[02] About</a>
          <a href="#process" className="vb-link">[03] Process</a>
          <a href="#contact" className="vb-link">[04] Contact</a>
        </div>
        <a href="#contact" className="vb-pill" style={{borderColor:c.c2,color:c.c2}}>
          ▸ Get in touch
        </a>
      </nav>

      {/* HERO */}
      <section className="vb-grid" style={{position:"relative",padding:"80px 32px 120px",minHeight:"90vh"}}>
        <div ref={heroRef} style={{position:"absolute",inset:0,zIndex:0}}/>

        <div style={{position:"relative",zIndex:2}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:60}}>
            <div className="vb-mono" style={{opacity:.6}}>// Portfolio · 2026 · Växjö, SE</div>
            <div className="vb-mono" style={{opacity:.6}}>STATUS: <span style={{color:c.c3}}>● AVAILABLE</span></div>
          </div>

          <h1 className="vb-display vb-glitch" data-text="Oscar Frederiksen"
              style={{fontSize:"clamp(64px,13vw,220px)",margin:"0 0 30px"}}>
            Oscar<br/>
            <span style={{fontStyle:"italic",color:c.c2}}>Frederiksen</span>
          </h1>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,marginTop:80}}>
            <div>
              <div className="vb-mono" style={{color:c.c3,marginBottom:14}}>// what I do</div>
              <p style={{fontSize:22,lineHeight:1.5,maxWidth:480}}>
                I'm an interactive media student turning ideas into <span style={{color:c.c2}}>web experiences</span> — from brand systems to working code.
              </p>
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"flex-start"}}>
              <div className="vb-mono" style={{color:c.c3,marginBottom:14}}>// currently</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:14}}>
                <div>→ Studying at {P.university}</div>
                <div>→ Open to internships, summer 2026</div>
                <div>→ Drinking too much coffee</div>
              </div>
              <a href="#work" style={{
                marginTop:32,padding:"14px 22px",background:c.c2,color:c.bg,
                fontFamily:"ui-monospace,monospace",fontSize:13,letterSpacing:".08em",
                textTransform:"uppercase",borderRadius:4,
              }}>
                ▸ Enter the work
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{
        background:c.c2,color:c.bg,padding:"18px 0",overflow:"hidden",
        borderTop:`1px solid ${c.ink}`,borderBottom:`1px solid ${c.ink}`,
      }}>
        <div className="vb-marquee" style={{fontFamily:fontFamilyDisplay,fontSize:36,fontStyle:"italic"}}>
          {Array.from({length:2}).map((_,k) => (
            <div key={k} style={{display:"flex",gap:60}}>
              <span>HTML / CSS / JS</span><span>★</span>
              <span>Three.js</span><span>★</span>
              <span>Figma</span><span>★</span>
              <span>UI · UX</span><span>★</span>
              <span>Brand</span><span>★</span>
              <span>Web Tech</span><span>★</span>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{padding:"100px 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48}}>
          <div>
            <div className="vb-mono" style={{color:c.c3}}>// 02 — selected.work</div>
            <h2 className="vb-display" style={{fontSize:80,marginTop:14}}>
              Recent <span style={{fontStyle:"italic",color:c.c1}}>output</span>
            </h2>
          </div>
          <div className="vb-mono" style={{opacity:.6}}>{P.projects.length} entries</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
          {P.projects.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="vb-card" style={{padding:32,minHeight:340,textDecoration:"none",color:"inherit"}}>
              <div className="vb-cardbg" style={{background:`linear-gradient(135deg, ${c.c1}, ${c.c2})`}}/>
              <div style={{position:"relative",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <span className="vb-mono" style={{color:c.c2}}>// {p.no}</span>
                  <span style={{fontSize:24}}>↗</span>
                </div>
                <div>
                  {/* placeholder visual */}
                  <div style={{
                    height:140,marginBottom:24,borderRadius:4,
                    background:`repeating-linear-gradient(45deg, ${c.ink}06 0 8px, transparent 8px 16px), ${p.color}33`,
                    border:`1px solid ${c.ink}22`,
                    display:"grid",placeItems:"center",
                    fontFamily:"ui-monospace,monospace",fontSize:11,color:`${c.ink}66`,
                  }}>{p.id}.png</div>
                  <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                    <span className="vb-tag" style={{borderColor:c.c2,color:c.c2}}>{p.tag}</span>
                    {p.stack.map(s => <span key={s} className="vb-tag">{s}</span>)}
                  </div>
                  <div className="vb-display" style={{fontSize:36,marginBottom:8}}>{p.title}</div>
                  <p style={{fontSize:14,opacity:.75,lineHeight:1.6,maxWidth:480}}>{p.blurb}</p>
                  <div className="vb-mono" style={{marginTop:18,opacity:.5}}>// {p.year} · {p.sub}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{padding:"100px 32px",borderTop:`1px solid ${c.ink}22`}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:80}}>
          <div>
            <div className="vb-mono" style={{color:c.c3}}>// 03 — about</div>
            <div style={{
              marginTop:24,aspectRatio:"4/5",
              background:`linear-gradient(135deg, ${c.c1}33, ${c.c4}55)`,
              border:`1px solid ${c.ink}33`,borderRadius:6,position:"relative",overflow:"hidden",
            }}>
              <div style={{
                position:"absolute",inset:0,
                background:`repeating-linear-gradient(0deg, transparent 0 6px, ${c.ink}08 6px 7px)`,
              }}/>
              <div style={{position:"absolute",bottom:14,left:14,right:14,display:"flex",justifyContent:"space-between"}} className="vb-mono">
                <span>OSCAR_001.JPG</span><span style={{color:c.c3}}>● REC</span>
              </div>
              <div style={{position:"absolute",top:"40%",left:0,right:0,textAlign:"center",fontFamily:"ui-monospace,monospace",fontSize:13,color:`${c.ink}88`}}>
                portrait · drop image
              </div>
            </div>
          </div>
          <div>
            <h2 className="vb-display" style={{fontSize:64,lineHeight:.95}}>
              Designer who <span style={{fontStyle:"italic",color:c.c2}}>codes</span>,<br/>
              coder who <span style={{fontStyle:"italic",color:c.c1}}>designs</span>.
            </h2>
            <p style={{fontSize:18,lineHeight:1.7,maxWidth:540,marginTop:24,opacity:.85}}>
              {P.about}
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginTop:48}}>
              <div>
                <div className="vb-mono" style={{color:c.c3,marginBottom:14}}>// focus</div>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8,fontSize:15}}>
                  {P.focus.map(f => <li key={f}>▸ {f}</li>)}
                </ul>
              </div>
              <div>
                <div className="vb-mono" style={{color:c.c3,marginBottom:14}}>// stack</div>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8,fontSize:15}}>
                  {P.tools.map(t => <li key={t}>▸ {t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{padding:"100px 32px",borderTop:`1px solid ${c.ink}22`}}>
        <div className="vb-mono" style={{color:c.c3}}>// 04 — timeline</div>
        <h2 className="vb-display" style={{fontSize:64,margin:"14px 0 40px"}}>
          The path <span style={{fontStyle:"italic",color:c.c2}}>here</span>.
        </h2>
        <div>
          {P.timeline.map((t, i) => (
            <div key={i} className="vb-row" style={{
              display:"grid",gridTemplateColumns:"180px 1fr 240px 60px",gap:24,
              padding:"28px 0",borderTop:`1px solid ${c.ink}22`,alignItems:"center",
            }}>
              <div className="vb-mono" style={{color:c.c2}}>{t.year}</div>
              <div className="vb-display vb-strike" style={{fontSize:28}}>{t.title}</div>
              <div style={{fontSize:14,opacity:.7}}>{t.place}</div>
              <div className="vb-arrow" style={{textAlign:"right",fontSize:20,color:c.c2}}>↗</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{padding:"100px 32px",borderTop:`1px solid ${c.ink}22`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48}}>
          <div>
            <div className="vb-mono" style={{color:c.c3}}>// 05 — process</div>
            <h2 className="vb-display" style={{fontSize:64,marginTop:14}}>
              How it gets <span style={{fontStyle:"italic",color:c.c1}}>made</span>.
            </h2>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,border:`1px solid ${c.ink}22`,borderRadius:6,overflow:"hidden"}}>
          {P.process.map((s, i) => (
            <div key={s.step} style={{
              padding:32,
              borderRight: i<P.process.length-1 ? `1px solid ${c.ink}22` : "none",
              background:i%2?`${c.ink}03`:"transparent",
            }}>
              <div className="vb-mono" style={{color:c.c2,marginBottom:18}}>// {s.step}</div>
              <div className="vb-display" style={{fontSize:32,marginBottom:12}}>{s.name}</div>
              <p style={{fontSize:13,lineHeight:1.6,opacity:.75}}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:"120px 32px",borderTop:`1px solid ${c.ink}22`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.5}} className="vb-grid"/>
        <div style={{position:"relative",zIndex:2}}>
          <div className="vb-mono" style={{color:c.c3}}>// 06 — contact</div>
          <h2 className="vb-display" style={{fontSize:"clamp(64px,11vw,180px)",margin:"14px 0 40px",lineHeight:.9}}>
            Say <span style={{fontStyle:"italic",color:c.c2}}>hi</span>.
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,maxWidth:1200}}>
            <div>
              <div className="vb-mono" style={{opacity:.6,marginBottom:10}}>// email</div>
              <a href={`mailto:${P.email}`} className="vb-display vb-link" style={{fontSize:32,textDecoration:"none"}}>
                {P.email}
              </a>
              <div className="vb-mono" style={{opacity:.6,margin:"40px 0 10px"}}>// phone</div>
              <a href={`tel:${P.phone.replace(/\s/g,"")}`} className="vb-display vb-link" style={{fontSize:28,textDecoration:"none"}}>
                {P.phone}
              </a>
            </div>
            <div>
              <div className="vb-mono" style={{opacity:.6,marginBottom:14}}>// elsewhere</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {P.socials.map(s => (
                  <a key={s.label} href={s.href} className="vb-link" style={{fontSize:18}}>
                    ▸ {s.label}
                  </a>
                ))}
              </div>
              <a href="#" style={{
                display:"inline-flex",alignItems:"center",gap:10,marginTop:36,
                padding:"14px 22px",background:c.c2,color:c.bg,borderRadius:4,
                fontFamily:"ui-monospace,monospace",fontSize:13,letterSpacing:".08em",textTransform:"uppercase",
              }}>
                ▸ Download CV.pdf
              </a>
            </div>
          </div>
          <div style={{marginTop:80,paddingTop:24,borderTop:`1px solid ${c.ink}22`,display:"flex",justifyContent:"space-between"}} className="vb-mono">
            <span>© {new Date().getFullYear()} OSCAR.FREDERIKSEN</span>
            <span>BUILT IN VÄXJÖ · <span className="vb-blink">●</span></span>
          </div>
        </div>
      </section>
    </div>
  );
}

window.VariationB = VariationB;
