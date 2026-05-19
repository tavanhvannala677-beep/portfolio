import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; scroll-behavior: smooth; }

  :root {
    --orange: #F4622A;
    --orange-light: #FF8A5B;
    --cream: #FFF8F4;
    --dark: #1A0A00;
    --muted: #8A7060;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--dark); overflow-x: hidden; }

  .grain {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1000;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.4rem 3.5rem;
    background: rgba(255,248,244,0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(244,98,42,0.12);
    transition: box-shadow 0.3s;
  }

  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 2px; color: var(--dark); }
  .logo span { color: var(--orange); }

  nav ul { list-style: none; display: flex; gap: 2.5rem; }
  nav ul li {
    font-size: 0.82rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted); cursor: pointer;
    transition: color 0.2s; position: relative;
  }
  nav ul li::after {
    content: ''; position: absolute; bottom: -3px; left: 0;
    width: 0; height: 2px; background: var(--orange); transition: width 0.3s;
  }
  nav ul li:hover { color: var(--dark); }
  nav ul li:hover::after { width: 100%; }

  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }
  .reveal-delay-5 { transition-delay: 0.5s; }

  .hero {
    min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; padding: 0 3.5rem; gap: 2rem;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; top: -100px; right: -100px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(244,98,42,0.1) 0%, transparent 65%);
    pointer-events: none; animation: pulse-glow 4s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.7; }
  }

  .hero-left { z-index: 2; }

  .hero-tag {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1.5px solid rgba(244,98,42,0.35); border-radius: 50px;
    padding: 0.35rem 1rem; font-size: 0.75rem; color: var(--orange);
    letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500;
    margin-bottom: 1.8rem; background: rgba(244,98,42,0.05);
    animation: fadeInDown 0.8s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }

  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  .hero h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(5rem, 10vw, 8rem); line-height: 0.92;
    letter-spacing: -1px; color: var(--dark); margin-bottom: 1.5rem;
    animation: fadeInUp 0.9s 0.15s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .hero h1 .stroke { -webkit-text-stroke: 2px var(--orange); color: transparent; }

  .hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.75; max-width: 420px; margin-bottom: 2.5rem; animation: fadeInUp 0.9s 0.3s cubic-bezier(.22,1,.36,1) both; }
  .hero-btns { display: flex; gap: 1rem; animation: fadeInUp 0.9s 0.45s cubic-bezier(.22,1,.36,1) both; }

  .btn-fill { padding: 0.9rem 2.2rem; background: var(--orange); color: white; border: none; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.9rem; cursor: pointer; transition: all 0.25s; }
  .btn-fill:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(244,98,42,0.3); }

  .btn-ghost { padding: 0.9rem 2.2rem; background: transparent; color: var(--dark); border: 1.5px solid rgba(26,10,0,0.2); border-radius: 100px; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 0.9rem; cursor: pointer; transition: all 0.25s; }
  .btn-ghost:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

  .hero-right { display: flex; justify-content: center; align-items: center; z-index: 2; animation: fadeInRight 1s 0.2s cubic-bezier(.22,1,.36,1) both; }
  @keyframes fadeInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

  .avatar-frame { position: relative; width: 340px; height: 420px; }
  .avatar-box {
    width: 100%; height: 100%; border-radius: 24px;
    background: linear-gradient(145deg, #ffe8dc, #ffd2bc);
    border: 2px solid rgba(244,98,42,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif; font-size: 7rem;
    color: var(--orange); letter-spacing: 4px;
    position: relative; overflow: hidden;
    transition: transform 0.4s cubic-bezier(.22,1,.36,1);
  }
  .avatar-box:hover { transform: scale(1.02) rotate(1deg); }

  .float-card { position: absolute; background: white; border-radius: 14px; padding: 0.8rem 1.2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(244,98,42,0.1); animation: float 3s ease-in-out infinite; }
  .float-card.c1 { bottom: 30px; left: -50px; animation-delay: 0s; }
  .float-card.c2 { top: 40px; right: -50px; animation-delay: 1.5s; }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .float-card .fc-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 2px; }
  .float-card .fc-val { font-size: 1rem; font-weight: 600; color: var(--dark); }
  .float-card .fc-val span { color: var(--orange); }

  .scroll-hint { position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.4rem; color: var(--muted); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; animation: fadeInUp 1s 1s cubic-bezier(.22,1,.36,1) both; }
  .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--orange), transparent); animation: scroll-pulse 1.8s ease-in-out infinite; }
  @keyframes scroll-pulse { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }

  .about-section, .skills-section, .projects-section, .contact-section { padding: 7rem 3.5rem; }
  .section-container { max-width: 1100px; margin: auto; }
  .section-tag { color: var(--orange); text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.8rem; margin-bottom: 1rem; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 4rem; line-height: 1; margin-bottom: 1.5rem; color: var(--dark); }
  .section-text { max-width: 700px; line-height: 1.8; color: var(--muted); font-size: 1rem; }

  .skills-section { background: linear-gradient(135deg, rgba(244,98,42,0.04) 0%, transparent 60%); border-top: 1px solid rgba(244,98,42,0.08); border-bottom: 1px solid rgba(244,98,42,0.08); }
  .skills-groups { display: flex; flex-direction: column; gap: 2.5rem; margin-top: 3rem; }
  .skill-group-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 1rem; font-weight: 500; }
  .skills-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .skill-badge { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.5rem 1.1rem; border-radius: 100px; font-size: 0.82rem; font-weight: 500; border: 1.5px solid rgba(244,98,42,0.18); background: white; color: var(--dark); cursor: default; transition: all 0.25s cubic-bezier(.22,1,.36,1); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .skill-badge:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-3px) scale(1.04); box-shadow: 0 8px 24px rgba(244,98,42,0.18); background: rgba(244,98,42,0.04); }
  .skill-badge .skill-icon { font-size: 1rem; line-height: 1; }

  .skill-bar-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; max-width: 540px; }
  .skill-bar-header { display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 500; color: var(--dark); }
  .skill-bar-header span { color: var(--muted); font-weight: 400; }
  .skill-bar-track { height: 5px; background: rgba(244,98,42,0.1); border-radius: 100px; overflow: hidden; }
  .skill-bar-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--orange-light)); border-radius: 100px; width: 0; transition: width 1.2s cubic-bezier(.22,1,.36,1); }
  .skill-bar-fill.animated { width: var(--target-width); }

  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }

  .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
  .project-card { background: white; border: 1px solid rgba(244,98,42,0.1); border-radius: 24px; padding: 2rem; transition: transform 0.35s cubic-bezier(.22,1,.36,1), border-color 0.3s, box-shadow 0.35s; box-shadow: 0 10px 30px rgba(0,0,0,0.05); cursor: default; position: relative; overflow: hidden; }
  .project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(244,98,42,0.04), transparent); opacity: 0; transition: opacity 0.3s; }
  .project-card:hover { transform: translateY(-8px); border-color: rgba(244,98,42,0.3); box-shadow: 0 24px 48px rgba(244,98,42,0.1); }
  .project-card:hover::before { opacity: 1; }
  .project-number { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; color: rgba(244,98,42,0.12); line-height: 1; margin-bottom: 0.5rem; transition: color 0.3s; }
  .project-card:hover .project-number { color: rgba(244,98,42,0.22); }
  .project-card h3 { margin-bottom: 0.6rem; color: var(--dark); font-weight: 600; }
  .project-card p { color: var(--muted); line-height: 1.7; font-size: 0.9rem; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1.2rem; }
  .project-tag { font-size: 0.7rem; padding: 0.2rem 0.65rem; border-radius: 100px; background: rgba(244,98,42,0.08); color: var(--orange); font-weight: 500; letter-spacing: 0.05em; }

  .contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .contact-links { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
  .contact-link { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.4rem; background: white; border: 1.5px solid rgba(244,98,42,0.12); border-radius: 16px; text-decoration: none; color: var(--dark); font-size: 0.9rem; font-weight: 500; transition: all 0.25s cubic-bezier(.22,1,.36,1); box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
  .contact-link:hover { border-color: var(--orange); color: var(--orange); transform: translateX(6px); box-shadow: 0 8px 24px rgba(244,98,42,0.12); }
  .contact-link-icon { font-size: 1.2rem; width: 28px; text-align: center; }
  .contact-cta { margin-top: 3rem; }
  .contact-cta p { color: var(--muted); line-height: 1.8; margin-bottom: 2rem; }

  .section-divider { width: 48px; height: 3px; background: var(--orange); border-radius: 2px; margin: 1.2rem 0 2rem; }

  footer { text-align: center; padding: 2rem; color: var(--muted); font-size: 0.8rem; border-top: 1px solid rgba(244,98,42,0.08); }
  footer span { color: var(--orange); }

  @media (max-width: 768px) {
    nav { padding: 1rem 1.5rem; }
    nav ul { gap: 1rem; }
    .hero { grid-template-columns: 1fr; padding: 7rem 1.5rem 4rem; text-align: center; }
    .hero-tag { margin: 0 auto 1.5rem; }
    .hero-sub { margin: 0 auto 2rem; }
    .hero-btns { justify-content: center; }
    .hero-right { display: none; }
    .about-section, .skills-section, .projects-section, .contact-section { padding: 5rem 1.5rem; }
    .section-title { font-size: 3rem; }
    .about-grid, .contact-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  }
`;

const skillGroups = [
  {
    label: "Backend",
    skills: [
      { icon: "🐘", name: "PHP" },
      { icon: "🔴", name: "Laravel" },
      { icon: "🟢", name: "Node.js" },
      { icon: "🗄️", name: "MySQL" },
      { icon: "🍃", name: "MongoDB" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { icon: "⚛️", name: "React" },
      { icon: "🌐", name: "HTML / CSS" },
      { icon: "🟡", name: "JavaScript" },
      { icon: "🔷", name: "TypeScript" },
      { icon: "💨", name: "Tailwind CSS" },
    ],
  },
  {
    label: "Tools & Others",
    skills: [
      { icon: "🔧", name: "Git" },
      { icon: "🐙", name: "GitHub" },
      { icon: "🤖", name: "AI Tools" },
      { icon: "🔌", name: "REST API" },
      { icon: "📦", name: "Postman" },
    ],
  },
];

const proficiencies = [
  { name: "Laravel", level: 85 },
  { name: "React", level: 75 },
  { name: "Node.js", level: 68 },
  { name: "MySQL / MongoDB", level: 80 },
];

const projects = [
  {
    title: "CRUD Laravel",
    desc: "ລະບົບ CRUD ດ້ວຍ Laravel ພ້ອມ authentication, REST API ແລະ resource controllers.",
    tags: ["Laravel", "PHP", "MySQL"],
  },
  {
    title: "E-Commerce Web",
    desc: "ເວັບໄຊ E-Commerce ດ້ວຍ React Native ສຳລັບການຊ໋ອບປີງອອນໄລ cart ແລະ checkout.",
    tags: ["React", "React Native", "JavaScript"],
  },
  {
    title: "E-Commerce App",
    desc: "แอปพลิเคชัน E-Commerce บน Flutter รองรับทั้ง iOS ແລະ Android.",
    tags: ["Flutter", "Dart"],
  },
  {
    title: "Wallet App",
    desc: "ແອັບກະເປົາເງິນດິຈິຕອນສຳລັບຕິດຕາມລາຍໄດ້ ແລະ ລາຍຈ່າຍ ແລະ ການໂອນເງິນລະຫວ່າງຜູ້ໃຊ້.",
    tags: ["React", "MySQL"],
  },
  {
    title: "Expense Tracker",
    desc: "ແຜງຄວບຄຸມເວັບສຳລັບການຈັດການຄ່າໃຊ້ຈ່າຍສ່ວນຕົວ, ພ້ອມທີ່ຈະໃຊ້ງານ. analytics ແລະ category charts.",
    tags: ["React", "MySQL"],
  },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function SkillBar({ name, level }) {
  const fillRef = useRef(null);
  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.setProperty("--target-width", `${level}%`); el.classList.add("animated"); obs.unobserve(el); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [level]);
  return (
    <div className="skill-bar-item">
      <div className="skill-bar-header">{name} <span>{level}%</span></div>
      <div className="skill-bar-track"><div ref={fillRef} className="skill-bar-fill" /></div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const aboutRef    = useReveal();
  const skillsRef   = useReveal();
  const projectsRef = useReveal();
  const contactRef  = useReveal();
  const skillGroupRefs = [useReveal(), useReveal(), useReveal()];
  const projectRefs    = [useReveal(), useReveal(), useReveal(), useReveal(), useReveal()];

  return (
    <>
      <style>{styles}</style>
      <div className="grain" />

      <nav style={{ boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none" }}>
        <div className="logo">TAV<span>.</span></div>
        <ul>
          {["home", "about", "skills", "projects", "contact"].map((s) => (
            <li key={s} onClick={() => scrollToSection(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</li>
          ))}
        </ul>
      </nav>

      <section className="hero" id="home">
        <div className="hero-left">
          <div className="hero-tag"><span className="dot" />Backend Developer Intern</div>
          <h1>Mr. TAVANH<br /><span className="stroke">VANNALA</span></h1>
          <p className="hero-sub">Backend developer passionate about building clean APIs, robust systems, and full-stack web applications with Laravel, React, and AI tools.</p>
          <div className="hero-btns">
            <button className="btn-fill" onClick={() => scrollToSection("projects")}>View Projects</button>
            <button className="btn-ghost" onClick={() => scrollToSection("contact")}>Contact Me</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="avatar-frame">
            <div className="avatar-box">TV</div>
            <div className="float-card c1"><div className="fc-label">Experience</div><div className="fc-val"><span>3rd</span> Year Dev</div></div>
            <div className="float-card c2"><div className="fc-label">Stack</div><div className="fc-val">Laravel <span>+</span> React</div></div>
          </div>
        </div>
        <div className="scroll-hint"><span>scroll</span><div className="scroll-line" /></div>
      </section>

      <section className="about-section" id="about">
        <div className="section-container">
          <div ref={aboutRef} className="reveal">
            <p className="section-tag">About Me</p>
            <h2 className="section-title">Passionate Backend Developer</h2>
            <div className="section-divider" />
          </div>
          <div className="about-grid">
            <div ref={useReveal()} className="reveal reveal-delay-1">
              <p className="section-text">I'm a Software Engineering student passionate about backend systems, APIs, modern web applications, and AI tools. I enjoy building clean and scalable projects using Laravel, React, Node.js, and MongoDB.</p>
              <p className="section-text" style={{ marginTop: "1rem" }}>Currently in my 3rd year, I'm actively looking for internship opportunities to grow my skills in real-world production environments.</p>
            </div>
            <div ref={useReveal()} className="reveal reveal-delay-2">
              <p className="skill-group-label">Core Proficiencies</p>
              <div className="skill-bar-list">
                {proficiencies.map((p) => <SkillBar key={p.name} name={p.name} level={p.level} />)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "3rem" }}>
            <p className="skill-group-label">Languages</p>
            <div className="skills-row">
              <div className="skill-badge"><span className="skill-icon">🇬🇧</span>English — Intermediate</div>
              <div className="skill-badge"><span className="skill-icon">🇹🇭</span>Thai — Intermediate</div>
              <div className="skill-badge"><span className="skill-icon">🇱🇦</span>Lao — Native</div>
              <div className="skill-badge"><span className="skill-icon">🇨🇳</span>Chinese — Beginner</div>
            </div>
          </div>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <div className="section-container">
          <div ref={skillsRef} className="reveal">
            <p className="section-tag">Tech Stack</p>
            <h2 className="section-title">Skills & Tools</h2>
            <div className="section-divider" />
          </div>
          <div className="skills-groups">
            {skillGroups.map((group, i) => (
              <div key={group.label} ref={skillGroupRefs[i]} className={`reveal reveal-delay-${i + 1}`}>
                <p className="skill-group-label">{group.label}</p>
                <div className="skills-row">
                  {group.skills.map((skill) => (
                    <div key={skill.name} className="skill-badge">
                      <span className="skill-icon">{skill.icon}</span>{skill.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-container">
          <div ref={projectsRef} className="reveal">
            <p className="section-tag">Projects</p>
            <h2 className="section-title">Featured Projects</h2>
            <div className="section-divider" />
          </div>
          <div className="project-grid">
            {projects.map((proj, i) => (
              <div key={proj.title} ref={projectRefs[i]} className={`project-card reveal reveal-delay-${i + 1}`}>
                <div className="project-number">0{i + 1}</div>
                <h3>{proj.title}</h3>
                <p>{proj.desc}</p>
                <div className="project-tags">
                  {proj.tags.map((t) => <span key={t} className="project-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-container">
          <div ref={contactRef} className="reveal">
            <p className="section-tag">Contact</p>
            <h2 className="section-title">Let's Work Together</h2>
            <div className="section-divider" />
          </div>
          <div className="contact-inner">
            <div ref={useReveal()} className="reveal reveal-delay-1 contact-cta">
              <p>I'm currently open to internship roles and freelance projects. Feel free to reach out if you'd like to collaborate or just say hi!</p>
              <button className="btn-fill" onClick={() => window.open("mailto:tavanhvannala677@gmail.com")}>Send an Email</button>
            </div>
            <div ref={useReveal()} className="reveal reveal-delay-2">
              <div className="contact-links">
                {[
                  { icon: "📧", label: "tavanhvannala677@gmail.com", href: "mailto:tavanhvannala677@gmail.com" },
                  { icon: "📞", label: "+856 20 9336371", href: "#" },
                  { icon: "🐙", label: "github.com/tavanhvannala677-beep", href: "https://github.com/tavanhvannala677-beep" },
                ].map((link) => (
                  <a key={link.label} href={link.href} className="contact-link">
                    <span className="contact-link-icon">{link.icon}</span>{link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 <span>Tavanh Vannala</span>. Built with React.</p>
      </footer>
    </>
  );
}