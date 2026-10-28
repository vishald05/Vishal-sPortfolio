import { useEffect, useState } from "react";
import {
  SiCss,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiOpenjdk,
  SiPandas,
  SiPython,
  SiReact,
} from "react-icons/si";
import LogoLoop from "./components/LogoLoop";
import CaseStudyPage from "./components/CaseStudyPage";
import {
  LEETCODE_PROFILE_URL,
  LEETCODE_USERNAME,
  fetchLeetCodeData,
  formatDateTime,
  formatNumber,
  getCachedLeetCodeData,
} from "./data/leetcode";
import { projects } from "./data/projects";

const email = "visher0528@gmail.com";
const github = "https://github.com/vishald05";

const technologyLogos = [
  ["Java", SiOpenjdk, "#5382a1"],
  ["Python", SiPython, "#3776ab"],
  ["JavaScript", SiJavascript, "#b08d00"],
  ["React", SiReact, "#149eca"],
  ["Node.js", SiNodedotjs, "#5fa04e"],
  ["Express", SiExpress, "#49365e"],
  ["HTML5", SiHtml5, "#e34f26"],
  ["CSS3", SiCss, "#1572b6"],
  ["MySQL", SiMysql, "#4479a1"],
  ["MongoDB", SiMongodb, "#47a248"],
  ["Git", SiGit, "#f05032"],
  ["GitHub", SiGithub, "#49365e"],
  ["Docker", SiDocker, "#2496ed"],
  ["Pandas", SiPandas, "#130754"],
].map(([title, Icon, color]) => ({
  title,
  node: <Icon aria-hidden="true" style={{ color }} />,
}));

function ExternalLink({ href, children, secondary = false }) {
  return <a className={`project-action ${secondary ? "project-action-secondary" : ""}`} href={href} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

function Header({ menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false);
  const homePrefix = window.location.pathname === "/" ? "" : "/";
  return <header className="site-header">
    <a className="brand" href={`${homePrefix}#top`} aria-label="Vishal D home"><span className="brand-mark">V</span><span>Vishal D.</span></a>
    <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(!menuOpen)}>
      <span className="sr-only">Toggle navigation</span><span /><span />
    </button>
    <nav id="site-nav" className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
      <a href={`${homePrefix}#work`} onClick={closeMenu}>Projects</a>
      <a href={`${homePrefix}#about`} onClick={closeMenu}>About</a>
      <a href={`${homePrefix}#skills`} onClick={closeMenu}>Toolkit</a>
      <a className="nav-contact" href={`mailto:${email}`}>Email me <span>↗</span></a>
    </nav>
  </header>;
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
  return <article className={`project-card ${project.wide ? "project-wide" : ""}`}>
    <a className="project-card-main" href={`/projects/${project.slug}`}>
      <div className={`project-visual ${project.className}`}><span className="visual-label">{project.cardCategory}</span>
        {project.visual === "wordtrap" && <div className="wordtrap-screen"><span>WHO'S</span><strong>LYING?</strong><small>waiting for players...</small></div>}
        {project.visual === "budget" && <><div className="budget-chart"><span /><span /><span /><span /><span /></div><b>₹ 24,850</b><small>this month's overview</small></>}
        {project.visual === "match" && <div className="emoji-grid"><i>✦</i><i>☾</i><i>✿</i><i>☾</i><i>✦</i><i>✿</i></div>}
        {project.visual === "tree" && <><div className="data-lines"><span /><span /><span /><span /></div><div className="data-pie" /></>}
      </div>
      <div className="project-info">
        <div className="project-title-row"><h3>{project.title}</h3><span className="project-type">case study ↗</span></div>
        <p>{project.description}</p>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </a>
    <div className="project-actions">
      {project.demo && <ExternalLink href={project.demo}>Live Demo</ExternalLink>}
    </div>
  </article>;
}

function usePortfolioRoute() {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  return route;
}

function MetricCard({ label, value, highlight = false, muted = false, note = null }) {
  return <div className={`stats-metric ${highlight ? "stats-metric-highlight" : ""} ${muted ? "stats-metric-muted" : ""}`}>
    <span className="stats-label">{label}</span>
    <strong>{value}</strong>
    {note && <small>{note}</small>}
  </div>;
}

function DeveloperStatsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const loadStats = async () => {
      const cachedStats = getCachedLeetCodeData();
      if (cachedStats && !ignore) {
        setStats(cachedStats);
        setUsingCachedData(true);
        setLoading(false);
      }

      try {
        const liveStats = await fetchLeetCodeData(controller.signal);
        if (!ignore) {
          setStats(liveStats);
          setError("");
          setUsingCachedData(false);
          setLoading(false);
        }
      } catch (requestError) {
        if (ignore) {
          return;
        }

        if (cachedStats) {
          setStats(cachedStats);
          setError("Live LeetCode data is temporarily unavailable. Showing the latest cached snapshot.");
          setUsingCachedData(true);
          setLoading(false);
          return;
        }

        setStats(null);
        setLoading(false);
        setUsingCachedData(false);
        setError("LeetCode statistics could not be loaded right now. Please try again or visit the profile directly.");
      }
    };

    loadStats();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [retryKey]);

  const heatmapDays = stats?.submissionCalendar?.days ?? [];
  const heatmapMax = stats?.submissionCalendar?.maxCount ?? 0;
  const weeks = [];

  for (let index = 0; index < heatmapDays.length; index += 7) {
    weeks.push(heatmapDays.slice(index, index + 7));
  }

  const monthLabels = [];
  weeks.forEach((week, weekIndex) => {
    const firstDay = week.find((day) => day?.date);
    if (!firstDay) {
      return;
    }

    const monthName = new Date(`${firstDay.date}T00:00:00`).toLocaleString("en-US", { month: "short" });
    if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].month !== monthName) {
      monthLabels.push({ month: monthName, weekIndex });
    }
  });

  const renderHeatmap = () => {
    if (!heatmapDays.length) {
      return <div className="stats-empty-state"><p>No submission activity is available for the selected time range.</p><a href={LEETCODE_PROFILE_URL} target="_blank" rel="noreferrer">Open profile ↗</a></div>;
    }

    return <div className="heatmap-panel">
      <div className="heatmap-legend" aria-label="Activity intensity legend">
        <span>Less</span>
        <div className="heatmap-legend-scale">
          <i className="heatmap-cell level-0" aria-hidden="true" />
          <i className="heatmap-cell level-1" aria-hidden="true" />
          <i className="heatmap-cell level-2" aria-hidden="true" />
          <i className="heatmap-cell level-3" aria-hidden="true" />
          <i className="heatmap-cell level-4" aria-hidden="true" />
        </div>
        <span>More</span>
      </div>

      <div className="heatmap-shell" aria-label="LeetCode submission activity heatmap">
        <div className="heatmap-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(12px, 1fr))` }}>
          {monthLabels.map(({ month, weekIndex }) => <span key={`${month}-${weekIndex}`} style={{ gridColumn: `${weekIndex + 1}` }}>{month}</span>)}
        </div>
        <div className="heatmap-content">
          <div className="heatmap-weekdays" aria-hidden="true">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(12px, 1fr))` }}>
            {weeks.flatMap((week, weekIndex) => week.map((day, dayIndex) => {
              const intensity = day?.count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((day.count / (heatmapMax || 1)) * 4)));
              const heatClass = day?.isMissing ? "heatmap-cell heatmap-missing" : `heatmap-cell level-${intensity}`;
              const cellTitle = day?.isMissing ? `${day.date} — no submissions recorded` : `${day.date} — ${day.count} submissions`;
              return <button
                key={`${day.date}-${weekIndex}-${dayIndex}`}
                type="button"
                className={heatClass}
                title={cellTitle}
                aria-label={cellTitle}
              />;
            }))}
          </div>
        </div>
      </div>
    </div>;
  };

  const showErrorState = !loading && !stats && error;

  return <section id="developer-stats" className="developer-stats section-shell" aria-labelledby="developer-stats-title">
    <div className="stats-header">
      <div>
        <p className="eyebrow">LeetCode profile</p>
        <h2 id="developer-stats-title">Developer Stats</h2>
        <p className="stats-subtitle">Live, not fake. A snapshot of my problem-solving journey on LeetCode.</p>
      </div>
      <div className="stats-header-actions">
        <span className="stats-identity">@{LEETCODE_USERNAME}</span>
        <a href={LEETCODE_PROFILE_URL} target="_blank" rel="noreferrer">View LeetCode Profile <span>↗</span></a>
      </div>
    </div>

    {loading && !stats && <div className="stats-loading" aria-live="polite">
      <div className="stats-skeleton main" />
      <div className="stats-grid stats-grid-loading">
        {[1, 2, 3, 4, 5, 6].map((key) => <div key={key} className="stats-skeleton card" />)}
      </div>
      <div className="stats-skeleton heatmap" />
    </div>}

    {showErrorState && <div className="stats-error-state" role="alert">
      <p>{error}</p>
      <div className="stats-error-actions">
        <button type="button" className="button button-primary" onClick={() => setRetryKey((current) => current + 1)}>Retry</button>
        <a className="button button-outline" href={LEETCODE_PROFILE_URL} target="_blank" rel="noreferrer">Open profile <span>↗</span></a>
      </div>
    </div>}

    {stats && <>
      <div className="stats-meta-row">
        <span>Updated {formatDateTime(stats.lastUpdated)}</span>
        {usingCachedData && <span className="stats-cache-indicator">Cached snapshot</span>}
      </div>

      <div className="stats-grid">
        <MetricCard label="Total Problems Solved" value={stats.totalSolved !== null ? formatNumber(stats.totalSolved) : "—"} highlight note="All difficulty" />
        <MetricCard label="Easy" value={stats.easySolved !== null ? formatNumber(stats.easySolved) : "—"} />
        <MetricCard label="Medium" value={stats.mediumSolved !== null ? formatNumber(stats.mediumSolved) : "—"} />
        <MetricCard label="Hard" value={stats.hardSolved !== null ? formatNumber(stats.hardSolved) : "—"} />
        {stats.contestRating !== null && <MetricCard label="Contest Rating" value={Number(stats.contestRating).toLocaleString(undefined, { maximumFractionDigits: 2 })} />}
        {stats.globalRanking !== null && <MetricCard label="Global Contest Ranking" value={stats.globalRanking ? `#${formatNumber(stats.globalRanking)}` : "—"} muted />}
      </div>

      {stats.submissionCalendar?.days?.length ? <div className="stats-heatmap-wrap">
        <div className="stats-heatmap-header">
          <div>
            <p className="stats-tagline">Submission heatmap</p>
            <h3>Last 365 days</h3>
          </div>
          <span>{heatmapDays.filter((day) => day.count > 0).length} active days</span>
        </div>
        {renderHeatmap()}
      </div> : <div className="stats-empty-state"><p>Submission activity is unavailable for this profile right now.</p><a href={LEETCODE_PROFILE_URL} target="_blank" rel="noreferrer">Open profile ↗</a></div>}
    </>}
  </section>;
}

function PortfolioPage() {
  return <main id="top">
    <section className="hero section-shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Personal portfolio · 2026</p>
        <h1 id="hero-title">Hi, I'm <em>Vishal D.</em></h1>
        <p className="hero-role">Computer Science Student <span>·</span> Software Developer</p>
        <p className="hero-intro">I build web applications, solve problems, experiment with technology, and occasionally turn a small idea into a much bigger project than planned.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">Explore my projects <span>↓</span></a>
          <a className="button button-outline" href={github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
          <span className="resume-note">Resume not available yet</span>
        </div>
        <div className="hero-meta"><span>Chennai, India</span><span className="meta-rule" /><span>CS undergrad · 2023—27</span></div>
      </div>
      <HeroArt />
    </section>

    <section id="work" className="work section-band" aria-labelledby="work-title">
      <div className="section-shell">
        <div className="section-heading"><p className="eyebrow">What I've built <span className="heading-line" /></p><h2 id="work-title">Projects with a point<br /><em>and a little personality.</em></h2><p className="section-note">Different stacks, same goal: make something that earns its place.</p></div>
        <div className="project-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </div>
    </section>

    <section id="about" className="journey section-shell" aria-labelledby="about-title">
      <div className="journey-copy"><p className="eyebrow">A little about me <span className="heading-line" /></p><h2 id="about-title">More than just<br /><em>shipping features.</em></h2><p>I care about the why behind the build — the person using it, the teammate beside me, and the weird little detail that makes a product feel considered. I like learning in public, picking up unfamiliar tools, and seeing how far a small idea can go.</p><a className="text-link" href={github} target="_blank" rel="noreferrer">Visit my GitHub <span>↗</span></a></div>
      <div className="milestones" aria-label="Achievements">
        <div className="milestone"><strong>Top 4%</strong><span>LeetCode globally<br />1915 contest rating · 1000+ problems</span></div>
        <div className="milestone"><strong>Top 5</strong><span>NASSCOM Hackathon<br />Pre-Placement Offer for Reparo</span></div>
        <div className="milestone"><strong>8.67</strong><span>Current CGPA<br />Chennai Institute of Technology</span></div>
      </div>
    </section>

    <DeveloperStatsSection />

    <section id="skills" className="toolkit section-band" aria-labelledby="skills-title"><div className="section-shell toolkit-inner"><div className="section-heading"><p className="eyebrow">The toolkit <span className="heading-line" /></p><h2 id="skills-title">Curious by default,<br /><em>specific when it matters.</em></h2></div><div className="skill-list">
      <div><span>01</span><b>Languages</b><p>Java · Python · JavaScript · SQL · HTML · CSS</p></div><div><span>02</span><b>Build with</b><p>React · Node.js · Express · Socket.IO · REST APIs</p></div><div><span>03</span><b>Data & AI</b><p>NumPy · Pandas · Matplotlib · Power BI · LLMs</p></div><div><span>04</span><b>Foundations</b><p>DSA · OOP · OS · Networks · DBMS · Cloud</p></div>
    </div><div className="skills-loop"><LogoLoop logos={technologyLogos} speed={52} direction="left" gap={28} pauseOnHover fadeOut={false} scaleOnHover ariaLabel="Technologies I use" /></div></div></section>

    <section className="contact"><div className="section-shell contact-inner"><p className="eyebrow">Have a good problem?</p><h2>Let's make it<br /><em>less hypothetical.</em></h2><a className="button button-light" href={`mailto:${email}`}>Email me at <strong>{email}</strong> <span>↗</span></a></div></section>
  </main>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const route = usePortfolioRoute();
  const projectPath = route.startsWith("/projects/")
    ? route.slice("/projects/".length)
    : route.slice(1);
  const slug = projectPath.replace(/\/$/, "");
  const project = projects.find((item) => item.slug === slug);
  const isProjectRoute = route.startsWith("/projects/") || Boolean(project);
  const navigateHome = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
  };
  return <>
    <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    {isProjectRoute
      ? project
        ? <CaseStudyPage project={project} onBack={navigateHome} />
        : <main className="not-found"><div className="section-shell"><p className="eyebrow">404 / missing project</p><h1>This case study hasn't been written yet.</h1><a className="button button-primary" href="/" onClick={navigateHome}>Back to projects</a></div></main>
      : <PortfolioPage />}
    <footer className="site-footer section-shell"><span>© {new Date().getFullYear()} Vishal D.</span><span>Designed & built with questionable commits.</span><div><a href={`mailto:${email}`}>{email}</a><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/vishal-d-7ba16b292" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></footer>
  </>;
}

export default App;
