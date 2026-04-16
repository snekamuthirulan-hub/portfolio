import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
  html { scroll-behavior: smooth; }
  body { color: #ededed; background: #081b29; }

  /* ── HEADER ── */
  .header {
    position: fixed; top: 0; left: 0; width: 100%; padding: 10px 10%;
    background: #051129; display: flex; justify-content: space-between;
    align-items: center; z-index: 100; box-shadow: 0 2px 20px rgba(0,238,255,0.1);
  }
  .logo { font-size: 36px; color: #0ef; text-decoration: none; font-weight: 700; letter-spacing: 2px; opacity: 0; animation: slideRight 1s ease forwards; }
  .navbar { display: flex; align-items: center; }
  .navbar a {
    display: inline-block; font-size: 16px; color: white; text-decoration: none;
    font-weight: 500; margin-left: 35px; opacity: 0; animation: slideTop .5s ease forwards;
    animation-delay: calc(.1s * var(--i)); transition: color 0.3s;
  }
  .navbar a:hover { color: yellow; }

  /* ── HAMBURGER ── */
  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 6px; z-index: 200;
  }
  .hamburger span {
    display: block; width: 26px; height: 2px; background: #0ef;
    border-radius: 2px; transition: all 0.35s ease;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile nav drawer */
  .mobile-nav {
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    background: rgba(5,17,41,0.97); flex-direction: column; justify-content: center;
    align-items: center; gap: 28px; z-index: 150;
  }
  .mobile-nav.open { display: flex; }
  .mobile-nav a {
    font-size: 22px; color: #fff; text-decoration: none; font-weight: 500;
    letter-spacing: 1px; transition: color 0.3s;
  }
  .mobile-nav a:hover { color: #0ef; }

  /* ── THREE.JS CANVAS ── */
  #three-canvas {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
  }

  /* ── HOME ── */
  .home {
    position: relative; width: 100%; min-height: 100vh; display: flex;
    justify-content: space-between; align-items: center; padding: 70px 10% 0;
    background: radial-gradient(ellipse at 70% 50%, #0a2540 0%, #081b29 60%);
    overflow: hidden;
  }
  .home::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 80% 50%, rgba(0,238,255,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .home-content { max-width: 600px; position: relative; z-index: 1; }
  .home-content h3 { font-size: 26px; font-weight: 400; color: #ccc; opacity: 0; animation: slideRight 1s ease forwards; animation-delay: 0.3s; }
  .home-content h3.typed-line { margin-top: 8px; }
  .home-content h3 span { color: #0ef; }
  .home-content h1 { font-size: 56px; font-weight: 700; margin: 8px 0; line-height: 1.1; opacity: 0; animation: slideRight 1s ease forwards; animation-delay: 0.1s; }
  .home-content p { font-size: 18px; color: #aaa; margin-top: 15px; line-height: 1.7; opacity: 0; animation: slideLeft 1s ease forwards; animation-delay: 1s; }
  .home-sci { position: relative; z-index: 1; }
  .home-sci a {
    display: inline-flex; justify-content: center; align-items: center; width: 44px; height: 44px;
    background: transparent; border: 2px solid #0ef; border-radius: 50%; font-size: 20px;
    color: #0ef; text-decoration: none; margin: 30px 15px 30px 0; transition: .4s ease;
    opacity: 0; animation: slideLeft 1s ease forwards; animation-delay: calc(.2s * var(--i));
  }
  .home-sci a:hover { background: #0ef; color: #000; transform: translateY(-4px); box-shadow: 0 0 15px #0ef; }
  .home-img { position: relative; z-index: 1; }
  .home-img img {
    width: 320px; height: 320px; border-radius: 50%; border: 3px solid #0ef;
    box-shadow: 0 0 20px #0ef, 0 0 60px rgba(0,238,255,0.3); object-fit: cover;
    opacity: 0; animation: slideLeft 1s ease forwards; animation-delay: 0.5s;
  }

  /* ── SHARED ── */
  .btn-box {
    display: inline-block; padding: 13px 32px; background: #0ef; border-radius: 50px;
    font-size: 15px; color: #000; letter-spacing: 1px; font-weight: 600; text-decoration: none;
    opacity: 0; animation: slideTop 1s ease forwards; animation-delay: 2s;
    box-shadow: 0 0 5px #0ef, 0 0 25px #0ef; transition: box-shadow 0.3s, transform 0.3s;
    margin-top:15px;
  }
  .btn-box:hover { box-shadow: 0 0 5px cyan, 0 0 25px cyan, 0 0 60px cyan; transform: translateY(-3px); }
  .sub-title { text-align: center; font-size: 52px; font-weight: 700; padding: 80px 0 40px; }
  .sub-title span { color: #0ef; }

  /* ── ABOUT ── */
  .about {
    display: grid; grid-template-columns: repeat(2, 1fr); align-items: center;
    gap: 2em; padding: 80px 10%; background: #051129;
  }
  .about-img { display: flex; justify-content: center; }
  .about-img img { height: 280px; width: 280px; border: 3px solid #0ef; border-radius: 50%; object-fit: cover; box-shadow: 0 0 20px #0ef, 0 0 60px rgba(0,238,255,0.2); }
  .about-text h2 { font-size: 52px; font-weight: 700; }
  .about-text h2 span { color: #0ef; padding-left: 10px; }
  .about-text h4 { font-size: 22px; font-weight: 600; color: #0ef; margin: 15px 0 20px; }
  .about-text p { color: #ccc; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }

  /* ── SERVICES ── */
  .services-section { padding: 0 10% 80px; background: #081b29; }
  .services-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; margin-top: 20px; }
  .services-list div { background: transparent; padding: 40px 30px; border-radius: 20px; transition: transform 0.4s, box-shadow 0.4s; box-shadow: 1px 1px 20px #012290f7, 1px 1px 40px #0053b8f7; text-align: center; }
  .services-list div:hover { transform: translateY(-10px); box-shadow: 0 0 30px rgba(0,238,255,0.3); }
  .services-list div i { font-size: 50px; margin-bottom: 20px; color: #0ef; }
  .services-list div h2 { font-size: 24px; font-weight: 600; margin-bottom: 15px; }
  .services-list div p { font-size: 14px; color: #aaa; line-height: 1.7; margin-bottom: 20px; }
  .services-list div a { display: inline-block; padding: 10px 24px; background: #0ef; border-radius: 40px; font-size: 14px; color: #081b29; font-weight: 600; text-decoration: none; transition: box-shadow 0.3s; }
  .services-list div a:hover { box-shadow: 0 0 15px #0ef; }

  /* ── SKILLS ── */
  .skills-section { padding: 0 10% 80px; background: #051129; }
  .skills-wrapper { display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; }
  .container1 { flex: 1; min-width: 300px; max-width: 550px; padding: 40px; background: rgba(255,255,255,0.02); border-radius: 20px; box-shadow: 0 0 20px rgba(0,238,255,0.05); }
  .heading1 { text-align: center; font-size: 22px; font-weight: 600; margin-bottom: 40px; color: #0ef; }
  .bar { margin-bottom: 25px; }
  .bar .info { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .bar .info i { font-size: 22px; }
  .bar .info span { font-size: 15px; font-weight: 500; }
  .progress-line { position: relative; border-radius: 10px; width: 100%; height: 8px; background: rgba(255,255,255,0.1); }
  .progress-line span { height: 100%; background: linear-gradient(90deg, #0ef, #0099aa); position: absolute; border-radius: 10px; transition: width 1.5s ease; }
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #aaa; margin-top: 5px; }
  .radial-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
  .radial-item { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .radial-item .label { font-size: 14px; font-weight: 600; color: #fff; }

  /* ── CONTACT ── */
  .contact-section { padding: 0 10% 100px; background: #081b29; }
  .contact-wrapper { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; margin-top: 20px; }
  .contact-info h3 { font-size: 28px; color: #0ef; margin-bottom: 20px; }
  .contact-info p { color: #aaa; font-size: 16px; line-height: 1.8; margin-bottom: 30px; }
  .contact-details div { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; font-size: 15px; color: #ccc; }
  .contact-details div i { font-size: 22px; color: #0ef; width: 30px; }
  .contact-form { display: flex; flex-direction: column; gap: 15px; }
  .contact-form input, .contact-form textarea {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(0,238,255,0.3); border-radius: 10px;
    padding: 14px 18px; color: #fff; font-size: 15px; font-family: 'Poppins', sans-serif;
    transition: border-color 0.3s; outline: none;
  }
  .contact-form input:focus, .contact-form textarea:focus { border-color: #0ef; box-shadow: 0 0 10px rgba(0,238,255,0.15); }
  .contact-form textarea { min-height: 140px; resize: vertical; }
  .contact-form button {
    padding: 13px; background: #0ef; color: #000; font-weight: 700; font-size: 15px;
    border: none; border-radius: 50px; cursor: pointer; transition: box-shadow 0.3s, transform 0.3s;
  }
  .contact-form button:hover { box-shadow: 0 0 20px #0ef; transform: translateY(-2px); }
  .contact-form button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .form-status { text-align: center; font-size: 14px; padding: 10px; border-radius: 8px; }
  .form-status.success { background: rgba(0,238,255,0.1); color: #0ef; border: 1px solid rgba(0,238,255,0.3); }
  .form-status.error { background: rgba(255,80,80,0.1); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.3); }

  /* ── FOOTER ── */
  footer { text-align: center; padding: 25px; background: #051129; color: #555; font-size: 14px; border-top: 1px solid rgba(0,238,255,0.1); }
  footer span { color: #0ef; }

  /* ── ANIMATIONS ── */
  @keyframes slideRight { 0% { transform: translateX(-100px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
  @keyframes slideLeft  { 0% { transform: translateX(100px);  opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
  @keyframes slideTop   { 0% { transform: translateY(100px);  opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

  /* ══════════════════════════════════════════
     MEDIA QUERIES — ENHANCED
  ══════════════════════════════════════════ */

  /* ── Tablet landscape / small desktop ── */
  @media (max-width: 1024px) {
    .header { padding: 10px 6%; }
    .home { padding: 70px 6% 0; }
    .about { padding: 80px 6%; }
    .services-section { padding: 0 6% 80px; }
    .skills-section { padding: 0 6% 80px; }
    .contact-section { padding: 0 6% 100px; }
    .home-content h1 { font-size: 46px; }
    .home-img img { width: 280px; height: 280px; }
  }

  /* ── Tablet portrait ── */
  @media (max-width: 768px) {
    /* Show hamburger, hide desktop nav */
    .hamburger { display: flex; }
    .navbar { display: none; }

    .header { padding: 14px 5%; }
    .logo { font-size: 28px; }

    .home {
      flex-direction: column; text-align: center;
      padding-top: 110px; padding-bottom: 60px; padding-left: 5%; padding-right: 5%;
    }
    .home-img { margin-top: 40px; order: -1; }
    .home-img img { width: 220px; height: 220px; }
    .home-content h1 { font-size: 36px; }
    .home-content h3 { font-size: 20px; }
    .home-content p { font-size: 16px; }
    .home-sci { justify-content: center; display: flex; }

    .about { grid-template-columns: 1fr; text-align: center; padding: 60px 5%; gap: 30px; }
    .about-text h2 { font-size: 38px; }
    .about-text h4 { font-size: 18px; }

    .services-section { padding: 0 5% 60px; }
    .services-list { grid-template-columns: 1fr; }

    .skills-section { padding: 0 5% 60px; }
    .container1 { min-width: unset; padding: 30px 20px; }
    .radial-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }

    .contact-section { padding: 0 5% 80px; }

    .sub-title { font-size: 36px; padding: 60px 0 30px; }
  }

  /* ── Mobile large ── */
  @media (max-width: 600px) {
    .home-content h1 { font-size: 30px; }
    .home-content h3 { font-size: 17px; }
    .home-img img { width: 180px; height: 180px; }
    .about-img img { width: 200px; height: 200px; }
    .about-text h2 { font-size: 30px; }
    .sub-title { font-size: 28px; }
    .radial-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .contact-details div { font-size: 13px; flex-wrap: wrap; }
    .services-list div { padding: 28px 20px; }
  }

  /* ── Mobile small ── */
  @media (max-width: 480px) {
    .header { padding: 12px 4%; }
    .logo { font-size: 22px; }
    .home, .about, .services-section, .skills-section, .contact-section { padding-left: 4%; padding-right: 4%; }
    .home-content h1 { font-size: 26px; }
    .sub-title { font-size: 24px; padding: 50px 0 24px; }
    .btn-box { padding: 11px 24px; font-size: 14px; }
    .container1 { padding: 24px 14px; }
    .heading1 { font-size: 18px; margin-bottom: 28px; }
    .bar .info span { font-size: 13px; }
  }

  /* ── Very small phones ── */
  @media (max-width: 360px) {
    .home-content h1 { font-size: 22px; }
    .home-img img { width: 150px; height: 150px; }
    .about-img img { width: 160px; height: 160px; }
    .logo { font-size: 20px; }
    .radial-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .contact-wrapper { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

const RadialSkill = ({ percent, label, offset }) => (
  <div className="radial-item">
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg viewBox="0 0 200 200" style={{ width: 130, height: 130, transform: "rotate(-90deg)" }}>
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="100" cy="100" r="80" fill="none" stroke="#0ef" strokeWidth="12"
          strokeLinecap="round" strokeDasharray="502" strokeDashoffset={offset}
        />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0ef" }}>{percent}%</div>
      </div>
    </div>
    <div className="label">{label}</div>
  </div>
);

const SkillBar = ({ icon, iconColor, label, widthPct }) => {
  const [width, setWidth] = useState("0%");
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(widthPct); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [widthPct]);

  return (
    <div className="bar" ref={ref}>
      <div className="info">
        <i className={icon} style={{ color: iconColor }}></i>
        <span>{label}</span>
      </div>
      <div className="progress-line">
        <span style={{ width }}></span>
      </div>
      <div className="progress-label"><span></span><span>{widthPct}</span></div>
    </div>
  );
};

/* ─────────────────────────────────────────
   THREE.JS PARTICLE BACKGROUND
───────────────────────────────────────── */
const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE = window.THREE;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
      camera.position.z = 5;

      // Particle geometry
      const count = 800;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color: 0x00eeff, size: 0.06, transparent: true, opacity: 0.7 });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Lines connecting nearby particles
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.08 });
      const lineGeo = new THREE.BufferGeometry();
      const linePositions = [];
      const posArr = geo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = posArr[i*3] - posArr[j*3];
          const dy = posArr[i*3+1] - posArr[j*3+1];
          const dz = posArr[i*3+2] - posArr[j*3+2];
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 1.8) {
            linePositions.push(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
            linePositions.push(posArr[j*3], posArr[j*3+1], posArr[j*3+2]);
          }
        }
      }
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      scene.add(new THREE.LineSegments(lineGeo, lineMat));

      let animId;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        points.rotation.y += 0.0015;
        points.rotation.x += 0.0005;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!canvas) return;
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };
    document.head.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, []);

  return <canvas ref={canvasRef} id="three-canvas" />;
};

/* ─────────────────────────────────────────
   SECTION COMPONENTS
───────────────────────────────────────── */

/** Header with hamburger menu */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = ["home", "about", "services", "skills", "contact"];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header">
        <a href="#" className="logo">Portfolio</a>

        {/* Desktop nav */}
        <nav className="navbar">
          {navLinks.map((s, i) => (
            <a href={`#${s}`} key={s} style={{ "--i": i + 1 }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </nav>

        {/* Hamburger button */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile fullscreen nav */}
      <nav className={`mobile-nav${menuOpen ? " open" : ""}`}>
        {navLinks.map(s => (
          <a href={`#${s}`} key={s} onClick={closeMenu}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </nav>
    </>
  );
};

/** Hero / Home section with Three.js + typewriter */
const Home = () => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const words = ["Frontend Developer", "MERN Stack Developer", "UI/UX Designer"];
    let wordIdx = 0, charIdx = 0, deleting = false;

    const type = () => {
      const current = words[wordIdx];
      if (!deleting) {
        setTypedText(current.slice(0, ++charIdx));
        if (charIdx === current.length) { deleting = true; setTimeout(type, 1500); return; }
      } else {
        setTypedText(current.slice(0, --charIdx));
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
      }
      setTimeout(type, deleting ? 60 : 100);
    };

    const t = setTimeout(type, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="home" id="home">
      <ThreeBackground />
      <div className="home-content">
        <h3>Hello, It's me</h3>
        <h1>SNEKA MUTHIRULAN</h1>
        <h3 className="typed-line">
          And I'm a{" "}
          <span>
            {typedText}
            <span style={{ borderRight: "2px solid #0ef" }}></span>
          </span>
        </h3>
        <p>
          I am a passionate Frontend Developer who loves creating beautiful and interactive
          web experiences. Let's build something amazing together!
        </p>
        <div className="home-sci">
          <a href="#" style={{ "--i": 1 }}><i className="bx bxl-linkedin"></i></a>
          <a href="#" style={{ "--i": 2 }}><i className="bx bxl-github"></i></a>
          <a href="#" style={{ "--i": 3 }}><i className="bx bxl-twitter"></i></a>
        </div>
        <a href="#about" className="btn-box">More About Me</a>
      </div>
      <div className="home-img">
        <img src="/sneka.png" alt="Sneka Muthirulan" />
      </div>
    </section>
  );
};

/** About section */
const About = () => (
  <section className="about" id="about">
    <div className="about-text">
      <h2>About <span>Me</span></h2>
      <h4>MERN STACK Developer</h4>
      <p>
        I am a dedicated Frontend Developer with a strong passion for building responsive and
        user-friendly web applications. I specialize in HTML, CSS, JavaScript, and React, and I
        enjoy turning creative ideas into clean, functional interfaces. I'm always eager to learn
        new technologies and improve my skills.
      </p>
      <a href="#contact" className="btn-box">Contact Me</a>
    </div>
  </section>
);

/** Services section */
const Services = () => {
  const serviceList = [
    {
      icon: "bx bx-edit-alt",
      title: "E-Publishing",
      desc: "Creating and managing digital content for online publishing platforms. Crafting engaging content that reaches and resonates with audiences.",
    },
    {
      icon: "bx bx-code-alt",
      title: "Frontend Developer",
      desc: "Building modern, responsive, and interactive web applications using React, JavaScript, HTML5, and CSS3 with a focus on performance and UX.",
    },
    {
      icon: "bx bx-palette",
      title: "UI/UX Design",
      desc: "Designing intuitive and visually appealing user interfaces that enhance user experience and align with the brand identity and goals.",
    },
  ];

  return (
    <>
      <h1 className="sub-title" id="services">My <span>Services</span></h1>
      <section className="services-section">
        <div className="services-list">
          {serviceList.map(({ icon, title, desc }) => (
            <div key={title}>
              <i className={icon}></i>
              <h2>{title}</h2>
              <p>{desc}</p>
              <a href="#">Read More</a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

/** Skills section */
const Skills = () => (
  <>
    <h1 className="sub-title" id="skills">My <span>Skills</span></h1>
    <section className="skills-section">
      <div className="skills-wrapper">
        <div className="container1">
          <h1 className="heading1">Technical Skills</h1>
          <SkillBar icon="bx bxl-html5" iconColor="#c95d2e" label="HTML" widthPct="90%" />
          <SkillBar icon="bx bxs-file-css" iconColor="#147bbc" label="CSS" widthPct="80%" />
          <SkillBar icon="bx bxl-javascript" iconColor="#b0bc1e" label="JavaScript" widthPct="75%" />
          <SkillBar icon="bx bxl-react" iconColor="#69bcbc" label="React" widthPct="85%" />
          <SkillBar icon="bx bxl-python" iconColor="#c32ec9" label="Python" widthPct="80%" />
        </div>
        <div className="container1">
          <h1 className="heading1">Professional Skills</h1>
          <div className="radial-grid">
            <RadialSkill percent={90} label="Leadership" offset={50} />
            <RadialSkill percent={90} label="Creativity" offset={50} />
            <RadialSkill percent={90} label="Communication" offset={50} />
            <RadialSkill percent={75} label="Problem Solving" offset={125} />
          </div>
        </div>
      </div>
    </section>
  </>
);

/** Contact section */
const Contact = () => {
  const EMAILJS_SERVICE_ID = 'service_x8bqki7';
  const EMAILJS_TEMPLATE_ID = 'template_eayoira';
  const EMAILJS_PUBLIC_KEY = 'jE32NhCz7Ifpp49sD';

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error-fields");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        }),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const statusMessage = {
    sending: "⏳ Sending your message…",
    success: "✅ Message sent! I'll get back to you soon.",
    error: "❌ Something went wrong. Please try again.",
    "error-fields": "⚠️ Please fill in Name, Email and Message.",
  };

  return (
    <>
      <h1 className="sub-title" id="contact">Contact <span>Me</span></h1>
      <section className="contact-section">
        <div className="contact-wrapper">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p>
              I'm currently open to new opportunities. Whether you have a project in mind
              or just want to say hi, feel free to reach out!
            </p>
            <div className="contact-details">
              <div><i className="fa-solid fa-envelope"></i> snekamuthirulan27@email.com</div>
              <div><i className="fa-solid fa-location-dot"></i> Tamil Nadu, Madurai, India.</div>
              <div>
                <i className="fa-brands fa-linkedin"></i>
                <a
                  href="https://www.linkedin.com/in/sneka-m-305444290/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/sneka-m-305444290
                </a>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} />
            <textarea name="message" placeholder="Your Message" required value={formData.message} onChange={handleChange} />
            <button onClick={handleSubmit} disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
            {status && status !== "sending" && (
              <div className={`form-status ${status.startsWith("error") ? "error" : "success"}`}>
                {statusMessage[status]}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

/** Footer */
const Footer = () => (
  <footer>
    <p>Designed &amp; Built by <span>Sneka Muthirulan</span> &copy; 2026</p>
  </footer>
);

/* ─────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────── */
export default function Portfolio() {
  return (
    <>
      <style>{styles}</style>
      <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />

      <Header />
      <Home />
      <About />
      <Services />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}