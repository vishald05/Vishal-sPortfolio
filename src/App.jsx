import { useState } from "react";

const email = "visher0528@gmail.com";

const projects = [
  {
    title: "WordTrap",
    category: "01 / multiplayer",
    className: "visual-wordtrap",
    description:
      "A real-time social deduction game where the room is lively, the votes are tense, and somebody is definitely lying.",
    tags: ["Node.js", "Socket.IO", "Express"],
    href: "https://whoislyingfrontend.onrender.com/",
    featured: true,
    visual: <div className="wordtrap-screen"><span>WHO'S</span><strong>LYING?</strong><small>waiting for players...</small></div>,
  },
  {
    title: "Budget Tracker",
    category: "02 / finance",
    className: "visual-budget",
    description:
      "A friendly finance companion for tracking spending, visualizing habits, and asking an AI chatbot the questions your spreadsheet can't.",
    tags: ["JavaScript", "MongoDB", "AI"],
    href: "https://budgettracker-pubj.onrender.com",
    visual: <><div className="budget-chart"><span /><span /><span /><span /><span /></div><b>₹ 24,850</b><small>this month's overview</small></>,
  },
  {
    title: "MatchMoji",
    category: "03 / playful",
    className: "visual-match",
    description:
      "A memory game built around tiny moments of delight, clean component logic, and one custom hook doing the heavy lifting.",
    tags: ["React 19", "Vite", "CSS"],
    href: "https://matchmoji.onrender.com",
    visual: <div className="emoji-grid"><i>✦</i><i>☾</i><i>✿</i><i>☾</i><i>✦</i><i>✿</i></div>,
  },
  {
    title: "Customer Shopping Analytics",
    category: "04 / insight",
    className: "visual-data",
    description:
      "Turning raw retail transactions into clear customer segments, loyalty patterns, and decisions people can actually act on.",
    tags: ["Python", "Pandas", "MySQL", "Power BI"],
    wide: true,
    visual: <><div className="data-lines"><span /><span /><span /><span /></div><div className="data-pie" /></>,
  },
];

function Header({ menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Vishal D home"><span className="brand-mark">V</span><span>Vishal D.</span></a>
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="sr-only">Toggle navigation</span><span /><span />
      </button>
      <nav id="site-nav" className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
        <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
        <a href="#skills" onClick={() => setMenuOpen(false)}>Toolkit</a>
        <a href="#journey" onClick={() => setMenuOpen(false)}>Journey</a>
        <a className="nav-contact" href={`mailto:${email}`}>Email me <span>↗</span></a>
      </nav>
    </header>
  );
}

function HeroArt() {
  return <div className="hero-art" aria-label="A pale lavender night sky illustration" role="img">
    <div className="moon" /><span className="star star-one">✦</span><span className="star star-two">✦</span>
    <span className="star star-three">·</span><span className="star star-four">✦</span>
    <div className="cloud cloud-back" /><div className="cloud cloud-front" />
    <div className="hill hill-back" /><div className="hill hill-front" />
    <div className="wisteria wisteria-left"><i /><i /><i /><i /></div>
    <div className="wisteria wisteria-right"><i /><i /><i /></div>
    <p className="art-caption">a quiet corner<br />of the internet</p>
  </div>;
}

function ProjectCard({ project }) {
  return <article className={`project-card ${project.featured ? "project-featured" : ""} ${project.wide ? "project-wide" : ""}`}>
    <div className={`project-visual ${project.className}`}><span className="visual-label">{project.category}</span>{project.visual}</div>
    <div className="project-info">
      <div className="project-title-row"><h3>{project.title}</h3>{project.href ? <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}>↗</a> : <span className="project-number">data, but make it useful</span>}</div>
      <p>{project.description}</p>
      <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </div>
  </article>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main id="top">
      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> Available for interesting problems</p>
          <h1 id="hero-title">Building useful things,<br /><em>one commit at a time.</em></h1>
          <p className="hero-intro">I'm Vishal — a computer science student and developer who likes turning messy ideas into calm, functional experiences. Sometimes the scope grows. Usually at 2 AM.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <span>↓</span></a><a className="text-link" href={`mailto:${email}`}>Say hello <span>↗</span></a></div>
          <div className="hero-meta"><span>Chennai, India</span><span className="meta-rule" /><span>CS undergrad · 2023—27</span></div>
        </div>
        <HeroArt />
      </section>

      <section id="work" className="work section-shell" aria-labelledby="work-title"><div className="section-heading"><p className="eyebrow">Selected work <span className="heading-line" /></p><h2 id="work-title">A few things I've<br /><em>made & learned from.</em></h2><p className="section-note">Different stacks, same goal: make something that earns its place.</p></div><div className="project-grid">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div></section>

      <section id="skills" className="toolkit section-band" aria-labelledby="skills-title"><div className="section-shell toolkit-inner"><div className="section-heading"><p className="eyebrow">The toolkit <span className="heading-line" /></p><h2 id="skills-title">Curious by default,<br /><em>specific when it matters.</em></h2></div><div className="skill-list">
        <div><span>01</span><b>Languages</b><p>Java · Python · JavaScript · SQL · HTML · CSS</p></div><div><span>02</span><b>Build with</b><p>React · Node.js · Express · Socket.IO · REST APIs</p></div><div><span>03</span><b>Data & AI</b><p>NumPy · Pandas · Matplotlib · Power BI · LLMs</p></div><div><span>04</span><b>Foundations</b><p>DSA · OOP · OS · Networks · DBMS · Cloud</p></div>
      </div></div></section>

      <section id="journey" className="journey section-shell" aria-labelledby="journey-title"><div className="journey-copy"><p className="eyebrow">The bigger picture <span className="heading-line" /></p><h2 id="journey-title">More than just<br /><em>shipping features.</em></h2><p>I care about the why behind the build — the person using it, the teammate beside me, and the weird little detail that makes a product feel considered.</p><a className="text-link" href="https://www.linkedin.com/in/vishal-d-7ba16b292" target="_blank" rel="noreferrer">More on LinkedIn <span>↗</span></a></div><div className="milestones"><div className="milestone"><strong>Top 4%</strong><span>LeetCode globally<br />1915 contest rating · 1000+ problems</span></div><div className="milestone"><strong>Top 5</strong><span>NASSCOM Hackathon<br />Pre-Placement Offer for Reparo</span></div><div className="milestone"><strong>8.67</strong><span>Current CGPA<br />Chennai Institute of Technology</span></div></div></section>

      <section className="contact section-band"><div className="section-shell contact-inner"><p className="eyebrow">Have a good problem?</p><h2>Let's make it<br /><em>less hypothetical.</em></h2><a className="button button-light" href={`mailto:${email}`}>Email me at <strong>{email}</strong> <span>↗</span></a></div></section>
    </main>
    <footer className="site-footer section-shell"><span>© {new Date().getFullYear()} Vishal D.</span><span>Designed & built with questionable commits.</span><div><a href={`mailto:${email}`}>{email}</a><a href="https://github.com/vishald05" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/vishal-d-7ba16b292" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></footer>
  </>;
}

export default App;
