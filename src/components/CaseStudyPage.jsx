import {
  SiCss,
  SiExpress,
  SiFirebase,
  SiGoogle,
  SiJavascript,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiVite,
} from "react-icons/si";

const icons = {
  React: SiReact,
  "React 18": SiReact,
  "React 19": SiReact,
  Vite: SiVite,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  Java: SiOpenjdk,
  Python: SiPython,
  "Plain CSS": SiCss,
  "Tailwind CSS v4": SiTailwindcss,
  Firebase: SiFirebase,
  "Firebase Auth": SiFirebase,
  "Firebase Realtime Database": SiFirebase,
  "Google Gemini 2.5 Flash": SiGoogle,
  JavaScript: SiJavascript,
};

function StackItem({ name }) {
  const Icon = icons[name];
  return <span className="case-stack-item">{Icon && <Icon aria-hidden="true" />}<span>{name}</span></span>;
}

function CaseStudyPage({ project, onBack }) {
  return <main className="case-study">
    <div className="section-shell">
      <a className="case-back" href="/" onClick={onBack}>← Back to projects</a>
      <header className="case-header">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p className="case-subtitle">{project.subtitle}</p>
        </div>
        <div className="case-actions">
          {project.demo && <a className="button button-primary" href={project.demo} target="_blank" rel="noreferrer">Live demo <span>↗</span></a>}
        </div>
      </header>

      <section className={`case-visual ${project.className}`} aria-label={`${project.title} visual preview`}>
        {project.visual === "wordtrap" && <div className="wordtrap-screen"><span>WHO'S</span><strong>LYING?</strong><small>waiting for players...</small></div>}
        {project.visual === "budget" && <><div className="budget-chart"><span /><span /><span /><span /><span /></div><b>₹ 24,850</b><small>this month's overview</small></>}
        {project.visual === "match" && <div className="emoji-grid"><i>✦</i><i>☾</i><i>✿</i><i>☾</i><i>✦</i><i>✿</i></div>}
        {project.visual === "tree" && <><div className="data-lines"><span /><span /><span /><span /></div><div className="data-pie" /></>}
      </section>

      <section className="case-stack" aria-labelledby="stack-title">
        <div className="case-section-label" id="stack-title">Technology stack</div>
        <div className="case-stack-groups">{project.stackGroups.map((group) => <div className="case-stack-group" key={group.label}><b>{group.label}</b><div>{group.items.map((item) => <StackItem key={item} name={item} />)}</div></div>)}</div>
      </section>

      <div className="case-content">
        {project.sections.map((section) => <section className="case-section" key={section.label}>
          <p className="eyebrow">{section.label}</p>
          <div>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </div>
        </section>)}
      </div>
      <a className="case-back case-back-bottom" href="/" onClick={onBack}>← Back to projects</a>
    </div>
  </main>;
}

export default CaseStudyPage;
