import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Gauge,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Wrench,
} from "lucide-react";

const profile = {
  name: "Felipe Arthur Eckert",
  location: "Sao Paulo, Brazil",
  email: "felipeeckert10@hotmail.com",
  linkedin: "https://br.linkedin.com/in/felipe-arthur-eckert-b745461a9",
  github: "",
  resume: "",
};

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

const heroStats = [
  { value: "80%", label: "faster road-load analysis" },
  { value: "R&D", label: "energy efficiency and data analytics" },
  { value: "C1", label: "English, plus PT native and ES B1" },
];

const proofPoints = [
  {
    icon: Gauge,
    label: "Road-load automation",
    detail: "Python tooling for coastdown coefficient calculations.",
  },
  {
    icon: Database,
    label: "Vehicle data pipelines",
    detail: "Chassis dynamometer and road-test datasets with Pandas and NumPy.",
  },
  {
    icon: Cpu,
    label: "Automotive systems",
    detail: "CAN bus, CANalyzer/CANoe, INCA Bosch ETAS and ECU calibration context.",
  },
];

const projects = [
  {
    title: "Coastdown / road-load analysis tool",
    category: "automation",
    type: "Python tooling",
    description:
      "Automates road-load coefficient calculations and report preparation for coastdown analysis workflows.",
    impact: "Reduced analysis time by about 80%.",
    stack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    status: "Case Study",
    link: "",
  },
  {
    title: "Vehicle data dashboards",
    category: "analytics",
    type: "Data visualization",
    description:
      "Dashboard concepts for exploring dynamometer and road-test signals across energy, consumption and efficiency views.",
    impact: "Built for faster technical review and clearer reporting.",
    stack: ["Pandas", "Plotly", "Streamlit"],
    status: "Coming Soon",
    link: "",
  },
  {
    title: "CAN bus diagnostic workflows",
    category: "automotive",
    type: "Automotive data",
    description:
      "Diagnostic and reverse-engineering workflow experience around CAN signals, ECU calibration context and vehicle development tools.",
    impact: "Connects embedded context with analysis-ready datasets.",
    stack: ["CAN bus", "CANoe", "CANalyzer", "INCA"],
    status: "Case Study",
    link: "",
  },
  {
    title: "Telemetry and data logger systems",
    category: "automotive",
    type: "BAJA SAE",
    description:
      "Powertrain development work covering telemetry, data logger usage, vehicle setup, 4x4 gearbox and CVT calibration.",
    impact: "Hands-on system ownership in a competitive engineering team.",
    stack: ["Telemetry", "Data logger", "Powertrain"],
    status: "Case Study",
    link: "",
  },
  {
    title: "Streamlit and Plotly analysis apps",
    category: "analytics",
    type: "Portfolio track",
    description:
      "Interactive data app track for turning technical analysis scripts into recruiter-friendly, reusable interfaces.",
    impact: "Focused on clean UX for engineering data decisions.",
    stack: ["Streamlit", "Plotly", "Power BI"],
    status: "Building",
    link: "",
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Analytics", value: "analytics" },
  { label: "Automation", value: "automation" },
  { label: "Automotive", value: "automotive" },
];

const stackGroups = [
  {
    icon: Database,
    title: "Data & Analytics",
    items: ["Python", "Pandas", "NumPy", "Matplotlib", "Plotly", "Scikit-learn"],
  },
  {
    icon: Activity,
    title: "Apps & Visualization",
    items: ["Streamlit", "Plotly Dash", "Power BI"],
  },
  {
    icon: Cpu,
    title: "Automotive & Embedded",
    items: ["CANalyzer", "CANoe", "INCA", "ECU calibration", "CAN bus", "MATLAB/Simulink", "C++"],
  },
  {
    icon: Wrench,
    title: "Tools",
    items: ["Git", "GitHub", "Automation workflows", "Technical reporting"],
  },
];

const timelineItems = [
  {
    icon: Briefcase,
    label: "Current",
    title: "Junior R&D Analyst",
    place: "Hyundai Motor Brasil",
    detail:
      "Energy Efficiency & Data Analytics work focused on vehicle test data, automation workflows and executive-ready technical reporting.",
  },
  {
    icon: GraduationCap,
    label: "Engineering foundation",
    title: "Electrical Engineering",
    place: "Poli-USP",
    detail:
      "Automation and Control emphasis with automotive engineering specialization, connecting control systems, data and vehicle development.",
  },
  {
    icon: Layers,
    label: "Hands-on systems",
    title: "Powertrain Director",
    place: "Poli-USP BAJA SAE",
    detail:
      "Telemetry, data logger, vehicle setup, 4x4 gearbox development and CVT calibration in a practical motorsport engineering environment.",
  },
];

const focusItems = ["SQL", "Power BI", "Machine Learning", "AI-assisted analytics", "Remote-first data roles"];

const contactLinks = [
  {
    label: "Email",
    detail: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    label: "LinkedIn",
    detail: "Felipe Arthur Eckert",
    href: profile.linkedin,
    icon: Briefcase,
  },
  {
    label: "GitHub",
    detail: "Profile link pending",
    href: profile.github,
    icon: Code2,
  },
];

function VehicleDataCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const traces = [
      { color: "rgba(58, 214, 176, 0.82)", amplitude: 34, speed: 0.012, offset: 0 },
      { color: "rgba(245, 178, 91, 0.68)", amplitude: 25, speed: 0.017, offset: 84 },
      { color: "rgba(196, 92, 104, 0.55)", amplitude: 20, speed: 0.021, offset: 156 },
    ];

    function resizeCanvas() {
      const bounds = canvas.getBoundingClientRect();
      const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.floor(width * deviceScale);
      canvas.height = Math.floor(height * deviceScale);
      ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.055)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 72) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 72) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function drawTrace(trace, time) {
      const baseline = height * 0.45 + trace.offset * 0.42;
      ctx.beginPath();

      for (let x = -20; x <= width + 20; x += 8) {
        const waveA = Math.sin(x * 0.011 + time * trace.speed);
        const waveB = Math.cos(x * 0.025 + time * trace.speed * 0.7);
        const y = baseline + waveA * trace.amplitude + waveB * trace.amplitude * 0.3;

        if (x === -20) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = trace.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawScan(time) {
      const x = ((time * 0.04) % (width + 160)) - 80;
      const gradient = ctx.createLinearGradient(x - 80, 0, x + 80, 0);
      gradient.addColorStop(0, "rgba(58, 214, 176, 0)");
      gradient.addColorStop(0.5, "rgba(58, 214, 176, 0.18)");
      gradient.addColorStop(1, "rgba(58, 214, 176, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 80, 0, 160, height);
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#090b10";
      ctx.fillRect(0, 0, width, height);
      drawGrid();
      traces.forEach((trace) => drawTrace(trace, time));
      drawScan(time);

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    resizeCanvas();
    draw(0);

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="vehicle-data-canvas" aria-hidden="true" />;
}

function SectionHeading({ kicker, title, copy }) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Felipe Arthur Eckert home">
        <span>FAE</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function HeroVisual() {
  return (
    <aside className="hero-visual" aria-label="Vehicle analytics dashboard mockup">
      <div className="visual-topbar">
        <span>coastdown_analysis.py</span>
        <span>running</span>
      </div>
      <div className="code-block" aria-hidden="true">
        <span>df = load_vehicle_test_data()</span>
        <span>coefficients = fit_road_load(df)</span>
        <span>report.export("executive_summary")</span>
      </div>
      <div className="chart-window" aria-hidden="true">
        <div className="chart-line chart-line-a" />
        <div className="chart-line chart-line-b" />
        <div className="chart-line chart-line-c" />
      </div>
      <div className="visual-metrics">
        {heroStats.map((stat) => (
          <div className="visual-metric" key={stat.value}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <VehicleDataCanvas />
      <div className="hero-overlay" />
      <div className="hero-layout">
        <div className="hero-content">
          <p className="eyebrow">
            <MapPin size={15} aria-hidden="true" />
            {profile.location}
          </p>
          <h1 id="hero-title">Turning complex vehicle data into Python-powered tools.</h1>
          <p className="hero-headline">
            Data Analyst & Automation Engineer bridging automotive R&D, data analytics and automation.
          </p>
          <p className="hero-copy">
            I combine automotive engineering context, real vehicle test data and practical Python tooling to
            make technical analysis faster, clearer and easier to repeat.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#projects">
              View Projects
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#contact">
              Contact Me
              <Mail size={18} aria-hidden="true" />
            </a>
            {profile.resume ? (
              <a className="button button-ghost" href={profile.resume}>
                Download Resume
                <Download size={18} aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Professional highlights">
      {proofPoints.map((point) => {
        const Icon = point.icon;
        return (
          <article className="proof-item" key={point.label}>
            <Icon size={22} aria-hidden="true" />
            <div>
              <h3>{point.label}</h3>
              <p>{point.detail}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="section-heading">
        <p className="section-kicker">About</p>
        <h2 id="about-title">Automotive engineering became the place where data work felt obvious.</h2>
      </div>
      <div className="about-copy">
        <p>
          My background is Electrical Engineering at Poli-USP, with an emphasis on Automation and Control and
          specialization in Automotive Engineering. That foundation made me comfortable with systems,
          instrumentation and the details behind vehicle behavior.
        </p>
        <p>
          In R&D, I saw the same pattern repeatedly: valuable measurements were available, but the path from raw
          test data to decisions was still too manual. That is where Python, Pandas and visualization became a
          natural extension of the engineering work.
        </p>
        <p>
          The advantage I bring is domain translation. I understand the vehicle development context and can also
          build the data layer that turns technical measurements into reusable analysis tools, dashboards and
          reports.
        </p>
      </div>
    </section>
  );
}

function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="section-row">
        <SectionHeading
          kicker="Featured Projects"
          title="Case studies and portfolio tracks"
          copy="A focused set of work themes around automotive data, automation and practical analytics interfaces."
        />
        <div className="filter-controls" aria-label="Filter featured projects">
          {filters.map((filter) => (
            <button
              aria-pressed={filter.value === activeFilter}
              className={filter.value === activeFilter ? "filter-button is-active" : "filter-button"}
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-card-top">
              <p className="project-type">{project.type}</p>
              <span className="status-pill">{project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="impact-row">
              <Gauge size={18} aria-hidden="true" />
              <span>{project.impact}</span>
            </div>
            <div className="tag-list" aria-label={`${project.title} stack`}>
              {project.stack.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {project.link ? (
              <a className="project-link" href={project.link}>
                Open project
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <SectionHeading
        kicker="Skills"
        title="Tools grouped by the problems they solve"
        copy="A compact stack built around data cleaning, engineering analysis, dashboards and automotive systems."
      />
      <div className="stack-grid">
        {stackGroups.map((group) => {
          const Icon = group.icon;
          return (
            <article className="stack-group" key={group.title}>
              <div className="stack-heading">
                <Icon size={20} aria-hidden="true" />
                <h3>{group.title}</h3>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section experience-section" id="experience" aria-labelledby="experience-title">
      <SectionHeading
        kicker="Experience"
        title="R&D, data workflows and hands-on automotive systems"
        copy="A timeline of the technical context behind the portfolio, kept intentionally honest and focused."
      />
      <div className="timeline">
        {timelineItems.map((item) => {
          const Icon = item.icon;
          return (
            <article className="timeline-item" key={`${item.title}-${item.place}`}>
              <div className="timeline-marker">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div className="timeline-content">
                <p className="timeline-label">{item.label}</p>
                <h3>{item.title}</h3>
                <p className="timeline-place">{item.place}</p>
                <p>{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Focus() {
  return (
    <section className="focus-band" aria-labelledby="focus-title">
      <div>
        <p className="section-kicker">Current Focus</p>
        <h2 id="focus-title">Deepening the analytics layer around technical data.</h2>
      </div>
      <div className="focus-list" aria-label="Current focus areas">
        {focusItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div>
        <p className="section-kicker">Contact</p>
        <h2 id="contact-title">Let's build something useful from complex data.</h2>
        <p>
          I am interested in remote and hybrid opportunities across Data Analytics, Automation Engineering and
          Python tooling, especially where engineering domain knowledge matters.
        </p>
      </div>
      <div className="contact-links">
        {contactLinks.map((link) => {
          const Icon = link.icon;
          const content = (
            <>
              <span className="contact-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>
                <strong>{link.label}</strong>
                <small>{link.detail}</small>
              </span>
              {link.href ? <ExternalLink size={16} aria-hidden="true" /> : null}
            </>
          );

          return link.href ? (
            <a className="contact-link" href={link.href} key={link.label}>
              {content}
            </a>
          ) : (
            <span className="contact-link is-disabled" key={link.label} aria-disabled="true">
              {content}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <ProofStrip />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Focus />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>{profile.name}</span>
        <span>Data Analyst & Automation Engineer</span>
      </footer>
    </>
  );
}
