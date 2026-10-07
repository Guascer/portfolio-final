// Variation C — "Editorial Studio"
// Cream + ink, magazine layout, big numbers, restrained 3D in hero,
// playful colorful accents on hover.

function VariationC({ tweaks }) {
  const P = window.PORTFOLIO;
  const motion = tweaks?.motion ?? "lively";
  const palette = tweaks?.paletteC ?? "cream";
  const display = tweaks?.displayFont ?? "Fraunces";
  const body = tweaks?.bodyFont ?? "Inter";

  const palettes = {
    cream:  { bg:"#f7f3ec", ink:"#1a1814", c1:"#ff5c39", c2:"#2e5cff", c3:"#f0c000", c4:"#1a8a5f", accent:"#ff5c39" },
    paper:  { bg:"#ece8df", ink:"#0e0e0e", c1:"#ec1f55", c2:"#2547d3", c3:"#ffc83a", c4:"#0a8a55", accent:"#ec1f55" },
    bone:   { bg:"#efece4", ink:"#161312", c1:"#d4451c", c2:"#1c4dd4", c3:"#e8a814", c4:"#377e54", accent:"#d4451c" },
  };
  const c = palettes[palette] || palettes.cream;

  const heroRef = React.useRef(null);

  React.useEffect(() => {
    if (!heroRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const el = heroRef.current;
    const w = () => el.clientWidth;
    const h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w()/h(), 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w(), h());
    el.appendChild(renderer.domElement);
    renderer.domElement.style.position="absolute";
    renderer.domElement.style.inset="0";
    renderer.domElement.style.pointerEvents="none";

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(2,4,3);
    scene.add(dir);

    // Single elegant torus
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.42, 24, 80),
      new THREE.MeshStandardMaterial({ color: c.c1, roughness: 0.35, metalness: 0.1 })
    );
    torus.rotation.x = Math.PI/2.5;
    scene.add(torus);

    // Small accent sphere
    const sph = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshStandardMaterial({ color: c.c2, roughness: 0.25 })
    );
    sph.position.set(1.6, 0.7, 0.6);
    scene.add(sph);

    let mx=0, my=0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left)/r.width - 0.5) * 2;
      my = ((e.clientY - r.top)/r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const speed = motion==="calm"?0.25:motion==="wild"?1.2:0.6;
    let raf, t0=performance.now();
    const tick = () => {
      const t = (performance.now()-t0)*0.001*speed;
      torus.rotation.z = t*0.4;
      sph.position.x = 1.6 + Math.sin(t)*0.3;
      sph.position.y = 0.7 + Math.cos(t*1.3)*0.2;
      camera.position.x += (mx*0.5 - camera.position.x)*0.05;
      camera.position.y += (-my*0.3 - camera.position.y)*0.05;
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
  }, [c.c1, c.c2, motion]);

  const fontFamilyDisplay = `'${display}', Georgia, serif`;
  const fontFamilyBody = `'${body}', system-ui, sans-serif`;

  return (
    <div style={{background:c.bg,color:c.ink,fontFamily:fontFamilyBody,minHeight:"100%",overflowX:"hidden"}}>
      <style>{`
        .vc-display{font-family:${fontFamilyDisplay};font-weight:400;letter-spacing:-0.03em;line-height:.9}
        .vc-mono{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
        .vc-rule{border-top:1px solid ${c.ink}22}
        .vc-link{position:relative;display:inline-block;text-decoration:none;color:inherit;padding-bottom:2px}
        .vc-link::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:currentColor;opacity:.3;transition:opacity .25s}
        .vc-link:hover::after{opacity:1}
        .vc-proj{position:relative;cursor:pointer;transition:padding .35s cubic-bezier(.2,.7,.3,1)}
        .vc-proj:hover{padding-left:32px}
        .vc-proj::before{content:"";position:absolute;left:0;top:50%;width:0;height:1.5px;background:${c.accent};transition:width .35s}
        .vc-proj:hover::before{width:24px}
        .vc-proj:hover .vc-projtitle{color:${c.accent}}
        .vc-proj:hover .vc-projimg{transform:scale(1.04) rotate(-1deg)}
        .vc-projtitle{transition:color .3s}
        .vc-projimg{transition:transform .5s cubic-bezier(.2,.7,.3,1)}
        .vc-num{font-family:${fontFamilyDisplay};font-style:italic;color:${c.accent};line-height:1}
        .vc-pill{display:inline-block;padding:4px 10px;border:1px solid ${c.ink}33;border-radius:999px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase}
        .vc-marquee{display:flex;gap:60px;white-space:nowrap;animation:vcmq ${motion==="calm"?"60s":motion==="wild"?"20s":"36s"} linear infinite}
        @keyframes vcmq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .vc-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:${c.accent};vertical-align:middle;margin:0 16px}
        .vc-tool{display:inline-block;padding:8px 14px;border:1px solid ${c.ink}22;border-radius:999px;font-size:13px;background:${c.bg};margin:0 6px 8px 0;transition:all .25s}
        .vc-tool:hover{background:${c.ink};color:${c.bg};transform:translateY(-2px)}
        .vc-pull{font-family:${fontFamilyDisplay};font-style:italic;font-size:42px;line-height:1.15;color:${c.ink}}
        .vc-tlrow{display:grid;grid-template-columns:140px 1fr 220px;gap:32px;padding:32px 0;border-top:1px solid ${c.ink}22;align-items:baseline;cursor:pointer;transition:background .25s}
        .vc-tlrow:hover{background:${c.ink}05}
        .vc-tlrow:hover .vc-tldot{background:${c.accent};transform:scale(1.4)}
        .vc-tldot{width:8px;height:8px;border-radius:50%;background:${c.ink};display:inline-block;margin-right:14px;transition:all .3s;vertical-align:middle}
      `}</style>

      {/* NAV */}
      <nav style={{
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"24px 48px",position:"sticky",top:0,zIndex:30,
        background:`${c.bg}ee`, backdropFilter:"blur(8px)",
        borderBottom:`1px solid ${c.ink}11`,
      }}>
        <div className="vc-display" style={{fontSize:22,fontStyle:"italic"}}>
          Oscar Frederiksen
        </div>
        <div className="vc-mono" style={{display:"flex",gap:32}}>
          <a href="#work" className="vc-link">Work</a>
          <a href="#about" className="vc-link">About</a>
          <a href="#process" className="vc-link">Process</a>
          <a href="#contact" className="vc-link">Contact</a>
        </div>
        <div className="vc-mono" style={{opacity:.6}}>Issue 02 · MMXXVI</div>
      </nav>

      {/* HERO — magazine cover */}
      <section style={{padding:"32px 48px 60px",borderBottom:`1px solid ${c.ink}22`,position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div className="vc-mono">A portfolio · A studio of one</div>
          <div className="vc-mono">Växjö, SE · 56°52′N</div>
        </div>

        <div style={{position:"relative",minHeight:"72vh",display:"grid",gridTemplateColumns:"1fr",alignItems:"center"}}>
          <div ref={heroRef} style={{
            position:"absolute",right:0,top:"6%",width:"45%",height:"90%",
            pointerEvents:"none",
          }}/>

          <div style={{position:"relative",zIndex:2,maxWidth:"66%"}}>
            <div className="vc-mono" style={{marginBottom:24,color:c.accent}}>
              ✦ Interactive Media · Web Technologies · 2026
            </div>
            <h1 className="vc-display" style={{fontSize:"clamp(80px,14vw,240px)",margin:0}}>
              Designs<br/>that<br/>
              <span style={{fontStyle:"italic",color:c.accent}}>think.</span>
            </h1>
          </div>

          <div style={{
            position:"absolute",bottom:0,right:0,maxWidth:340,
            borderLeft:`2px solid ${c.ink}`,paddingLeft:18,
          }}>
            <div className="vc-mono" style={{marginBottom:8}}>Inside this issue</div>
            <div style={{fontSize:14,lineHeight:1.6}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Selected Work</span><span className="vc-mono">p.02</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>About the maker</span><span className="vc-mono">p.03</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Timeline</span><span className="vc-mono">p.04</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Working method</span><span className="vc-mono">p.05</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Get in touch</span><span className="vc-mono">p.06</span></div>
            </div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:30,paddingTop:18,borderTop:`1px solid ${c.ink}22`}}>
          <div className="vc-pull" style={{maxWidth:680}}>
            "{P.tagline}"
          </div>
          <div style={{textAlign:"right"}}>
            <div className="vc-mono" style={{opacity:.6}}>Editor & Author</div>
            <div className="vc-display" style={{fontSize:24,fontStyle:"italic"}}>O. Frederiksen</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section style={{
        background:c.ink,color:c.bg,padding:"14px 0",overflow:"hidden",
      }}>
        <div className="vc-marquee" style={{fontSize:14,letterSpacing:".06em"}}>
          {Array.from({length:2}).map((_,k) => (
            <div key={k} style={{display:"flex",alignItems:"center",gap:0}}>
              <span>Open for internships · summer 2026</span><span className="vc-dot"/>
              <span>Currently studying at Linnaeus University</span><span className="vc-dot"/>
              <span>Now reading: design systems & motion</span><span className="vc-dot"/>
              <span>HTML · CSS · JS · Three.js · Figma</span><span className="vc-dot"/>
              <span>Based in Växjö, Sweden</span><span className="vc-dot"/>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{padding:"100px 48px"}}>
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:48,marginBottom:60}}>
          <div className="vc-num" style={{fontSize:140}}>02</div>
          <div>
            <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Selected Work</div>
            <h2 className="vc-display" style={{fontSize:96}}>
              Things I've made<br/>
              <span style={{fontStyle:"italic"}}>recently.</span>
            </h2>
          </div>
        </div>

        <div className="vc-rule"/>
        {P.projects.map((p, i) => (
          <a key={p.id} href={`#${p.id}`} className="vc-proj" style={{
            display:"grid",gridTemplateColumns:"60px 200px 1fr 240px 30px",
            gap:32,padding:"40px 0",borderBottom:`1px solid ${c.ink}22`,
            alignItems:"center",textDecoration:"none",color:"inherit",
          }}>
            <div className="vc-num" style={{fontSize:54}}>{p.no}</div>
            <div style={{
              aspectRatio:"4/3",borderRadius:6,overflow:"hidden",
              background:`linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
              position:"relative",
            }}>
              <div className="vc-projimg" style={{
                position:"absolute",inset:0,
                background:`repeating-linear-gradient(45deg, transparent 0 6px, ${c.ink}10 6px 7px)`,
              }}/>
              <div style={{position:"absolute",bottom:6,left:8,fontFamily:"ui-monospace,monospace",fontSize:9,color:"#fff",opacity:.7}}>
                {p.id}.png
              </div>
            </div>
            <div>
              <div className="vc-mono" style={{opacity:.6,marginBottom:8}}>{p.tag} · {p.year}</div>
              <div className="vc-display vc-projtitle" style={{fontSize:48,marginBottom:8}}>{p.title}</div>
              <p style={{fontSize:15,lineHeight:1.6,opacity:.8,maxWidth:560}}>{p.long}</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-start"}}>
              <div className="vc-mono" style={{opacity:.6,marginBottom:4}}>Built with</div>
              {p.stack.map(s => <span key={s} className="vc-pill">{s}</span>)}
            </div>
            <div style={{fontSize:24,opacity:.5}}>↗</div>
          </a>
        ))}
      </section>

      {/* ABOUT */}
      <section id="about" style={{padding:"100px 48px",borderTop:`1px solid ${c.ink}22`,background:`${c.c3}11`}}>
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:48,marginBottom:48}}>
          <div className="vc-num" style={{fontSize:140}}>03</div>
          <div>
            <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>About the maker</div>
            <h2 className="vc-display" style={{fontSize:88}}>
              The person<br/>
              <span style={{fontStyle:"italic",color:c.accent}}>behind the work.</span>
            </h2>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:60}}>
          <div>
            <div style={{
              aspectRatio:"4/5",borderRadius:6,overflow:"hidden",position:"relative",
              background:`linear-gradient(135deg, ${c.c1}55, ${c.c2}55)`,
              boxShadow:`0 30px 60px -20px ${c.ink}33`,
            }}>
              <div style={{
                position:"absolute",inset:0,
                background:`repeating-linear-gradient(45deg, transparent 0 10px, ${c.ink}08 10px 11px)`,
              }}/>
              <div style={{
                position:"absolute",inset:0,display:"grid",placeItems:"center",
                fontFamily:"ui-monospace,monospace",fontSize:12,color:`${c.ink}88`,
              }}>portrait · drop image here</div>
              <div className="vc-mono" style={{position:"absolute",bottom:14,left:14,opacity:.7}}>FIG. 01 — O.F.</div>
            </div>
            <div className="vc-mono" style={{marginTop:14,opacity:.6,textAlign:"center"}}>
              Photographed in Växjö · 2025
            </div>
          </div>

          <div style={{columns:"1",columnGap:36}}>
            <p className="vc-pull" style={{marginTop:0,marginBottom:32}}>
              "I believe the best work happens at the seam between design and code — where ideas become things you can touch."
            </p>
            <p style={{fontSize:17,lineHeight:1.7,marginBottom:18}}>
              {P.about}
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginTop:36}}>
              <div>
                <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Focus</div>
                <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:8,fontSize:16}}>
                  {P.focus.map(f => <li key={f} style={{borderBottom:`1px solid ${c.ink}15`,paddingBottom:6}}>{f}</li>)}
                </ul>
              </div>
              <div>
                <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Tools of trade</div>
                <div>
                  {P.tools.map(t => <span key={t} className="vc-tool">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{padding:"100px 48px",borderTop:`1px solid ${c.ink}22`}}>
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:48,marginBottom:40}}>
          <div className="vc-num" style={{fontSize:140}}>04</div>
          <div>
            <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Timeline</div>
            <h2 className="vc-display" style={{fontSize:88}}>
              The path,<br/>
              <span style={{fontStyle:"italic"}}>in order.</span>
            </h2>
          </div>
        </div>
        <div>
          {P.timeline.map((t, i) => (
            <div key={i} className="vc-tlrow">
              <div className="vc-mono">{t.year}</div>
              <div>
                <span className="vc-tldot"/>
                <span className="vc-display" style={{fontSize:30}}>{t.title}</span>
                <div style={{fontSize:14,opacity:.65,marginTop:4,marginLeft:22}}>{t.place}</div>
              </div>
              <div className="vc-pill" style={{justifySelf:"end"}}>{t.kind}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{padding:"100px 48px",borderTop:`1px solid ${c.ink}22`,background:`${c.c2}0c`}}>
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:48,marginBottom:48}}>
          <div className="vc-num" style={{fontSize:140}}>05</div>
          <div>
            <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Working method</div>
            <h2 className="vc-display" style={{fontSize:88}}>
              From listening<br/>
              <span style={{fontStyle:"italic",color:c.accent}}>to shipping.</span>
            </h2>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,borderTop:`1px solid ${c.ink}22`,borderBottom:`1px solid ${c.ink}22`}}>
          {P.process.map((s, i) => (
            <div key={s.step} style={{
              padding:"36px 24px",
              borderRight: i<P.process.length-1 ? `1px solid ${c.ink}22` : "none",
            }}>
              <div className="vc-num" style={{fontSize:64,marginBottom:18}}>{s.step}</div>
              <div className="vc-display" style={{fontSize:32,marginBottom:10}}>{s.name}</div>
              <p style={{fontSize:14,lineHeight:1.6,opacity:.8}}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{padding:"120px 48px",borderTop:`1px solid ${c.ink}22`}}>
        <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:48,marginBottom:60}}>
          <div className="vc-num" style={{fontSize:140}}>06</div>
          <div>
            <div className="vc-mono" style={{marginBottom:14,opacity:.6}}>Get in touch</div>
            <h2 className="vc-display" style={{fontSize:"clamp(72px,11vw,180px)",lineHeight:.9}}>
              Let's make<br/>
              <span style={{fontStyle:"italic",color:c.accent}}>something.</span>
            </h2>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,maxWidth:1300}}>
          <div>
            <div className="vc-mono" style={{opacity:.6,marginBottom:10}}>Email</div>
            <a href={`mailto:${P.email}`} className="vc-display vc-link" style={{fontSize:34}}>
              {P.email}
            </a>
            <div className="vc-mono" style={{opacity:.6,margin:"36px 0 10px"}}>Phone</div>
            <a href={`tel:${P.phone.replace(/\s/g,"")}`} className="vc-display vc-link" style={{fontSize:30}}>
              {P.phone}
            </a>
          </div>
          <div>
            <div className="vc-mono" style={{opacity:.6,marginBottom:14}}>Elsewhere</div>
            <div style={{display:"flex",flexDirection:"column",gap:14,fontSize:18}}>
              {P.socials.map(s => (
                <a key={s.label} href={s.href} className="vc-link">→ {s.label}</a>
              ))}
            </div>
            <a href="#" style={{
              display:"inline-flex",alignItems:"center",gap:10,marginTop:36,
              padding:"14px 24px",background:c.ink,color:c.bg,borderRadius:999,fontSize:14,
            }}>
              Download CV (PDF) ↓
            </a>
          </div>
        </div>
        <div className="vc-rule" style={{marginTop:80,paddingTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between"}} className="vc-mono">
            <span>© {new Date().getFullYear()} Oscar Frederiksen · All work and words.</span>
            <span>End of issue · ✦</span>
          </div>
        </div>
      </section>
    </div>
  );
}

window.VariationC = VariationC;
