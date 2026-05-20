import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

const metrics = [
  {
    value: "80%",
    label: "analysis time reduction on road-load workflows",
  },
  {
    value: "R&D",
    label: "Energy Efficiency & Data Analytics at Hyundai Motor Brasil",
  },
  {
    value: "C1",
    label: "English proficiency, plus native Portuguese and B1 Spanish",
  },
];

const projects = [
  {
    type: "Python tooling",
    category: "automation",
    title: "Coastdown & road-load analysis tool",
    description:
      "Automated calculation workflows for road-load coefficients, reducing repetitive analysis effort and supporting cleaner technical and executive reporting.",
    tags: ["Python", "Pandas", "NumPy", "Matplotlib"],
  },
  {
    type: "Vehicle analytics",
    category: "analytics",
    title: "Dynamometer and road-test data analysis",
    description:
      "Processing large datasets from chassis dynamometer and road tests to evaluate energy, consumption, and efficiency behavior across vehicle conditions.",
    tags: ["Pandas", "Plotly", "Reports"],
  },
  {
    type: "Automotive systems",
    category: "automotive",
    title: "CAN bus diagnostics and calibration workflows",
    description:
      "Experience with CANalyzer, CANoe, INCA Bosch ETAS, ECU calibration, and CAN bus analysis for embedded and vehicle development contexts.",
    tags: ["CAN bus", "INCA", "CANoe"],
  },
  {
    type: "BAJA SAE",
    category: "automotive",
    title: "Telemetry, data logger, and powertrain development",
    description:
      "Former Poli-USP BAJA SAE Powertrain Director, working on telemetry, data logging, vehicle setup, 4x4 gearbox development, and CVT calibration.",
    tags: ["Telemetry", "Data logger", "Powertrain"],
  },
  {
    type: "Data apps",
    category: "analytics",
    title: "Streamlit and visualization portfolio",
    description:
      "Portfolio track for clean dashboards and internal apps that turn technical datasets into interactive analysis flows.",
    tags: ["Streamlit", "Plotly", "Power BI"],
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
    title: "Data & Analytics",
    items: ["Python", "Pandas", "NumPy", "Matplotlib", "Plotly", "Scikit-learn"],
  },
  {
    title: "Apps & Visualization",
    items: ["Streamlit", "Plotly Dash", "Power BI"],
  },
  {
    title: "Automotive & Embedded",
    items: [
      "CANalyzer",
      "CANoe",
      "INCA Bosch ETAS",
      "ECU calibration",
      "CAN bus",
      "MATLAB/Simulink",
      "C++",
    ],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Technical reporting", "Internal documentation"],
  },
];

const focusItems = [
  "Deepening SQL, Power BI, machine learning, and AI-assisted analytics.",
  "Turning automotive analysis workflows into reusable Python and Streamlit tools.",
  "Growing a portfolio centered on practical analytics, automation, and vehicle data.",
];

function VehicleDataCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const traces = [
      { color: "rgba(125, 211, 199, 0.82)", amplitude: 42, speed: 0.012, offset: 0 },
      { color: "rgba(94, 146, 217, 0.72)", amplitude: 30, speed: 0.017, offset: 80 },
      { color: "rgba(246, 185, 108, 0.62)", amplitude: 24, speed: 0.021, offset: 160 },
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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
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
      const baseline = height * 0.56 + trace.offset * 0.38;
      ctx.beginPath();

      for (let x = -20; x <= width + 20; x += 8) {
        const waveA = Math.sin(x * 0.012 + time * trace.speed);
        const waveB = Math.cos(x * 0.024 + time * trace.speed * 0.64);
        const y = baseline + waveA * trace.amplitude + waveB * trace.amplitude * 0.32;

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

    function drawDataPoints(time) {
      for (let index = 0; index < 22; index += 1) {
        const progress = index / 22;
        const x = width * (0.42 + progress * 0.55);
        const y = height * 0.28 + Math.sin(time * 0.018 + index * 0.9) * 22 + (index % 5) * 36;
        const radius = 2 + (index % 3);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = index % 4 === 0 ? "rgba(246, 185, 108, 0.9)" : "rgba(125, 211, 199, 0.75)";
        ctx.fill();
      }
    }

    function drawVehicleSilhouette() {
      const carWidth = Math.min(width * 0.34, 430);
      const carHeight = carWidth * 0.28;
      const x = width - carWidth - width * 0.08;
      const y = height * 0.67;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + carWidth * 0.18, y - carHeight * 0.58);
      ctx.lineTo(x + carWidth * 0.42, y - carHeight * 0.82);
      ctx.lineTo(x + carWidth * 0.64, y - carHeight * 0.58);
      ctx.lineTo(x + carWidth * 0.86, y - carHeight * 0.42);
      ctx.lineTo(x + carWidth, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + carWidth * 0.24, y, carHeight * 0.24, 0, Math.PI * 2);
      ctx.arc(x + carWidth * 0.78, y, carHeight * 0.24, 0, Math.PI * 2);
      ctx.stroke();
    }

    function animate(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#101820";
      ctx.fillRect(0, 0, width, height);
      drawGrid();
      traces.forEach((trace) => drawTrace(trace, time));
      drawDataPoints(time);
      drawVehicleSilhouette();
      animationFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate(0);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="vehicle-data-canvas" aria-hidden="true" />;
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Felipe Arthur Eckert home">
        FAE
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

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <VehicleDataCanvas />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">Sao Paulo, Brazil</p>
        <h1 id="hero-title">Felipe Arthur Eckert</h1>
        <p className="hero-headline">
          Data Analyst & Automation Engineer turning complex vehicle data into Python-powered tools.
        </p>
        <p className="hero-copy">
          Electrical Engineering background from Poli-USP, automotive specialization, and hands-on R&D
          experience building data workflows for road-load, dynamometer, CAN bus, and vehicle efficiency
          analysis.
        </p>
        <div className="hero-actions" aria-label="Contact and profile links">
          <a className="button button-primary" href="#contact">
            Contact
          </a>
          <a className="button button-secondary" href="#work">
            Featured Work
          </a>
        </div>
      </div>
      <aside className="hero-panel" aria-label="Portfolio signal summary">
        <div className="panel-header">
          <span>vehicle-data.workflow</span>
          <span>active</span>
        </div>
        <div className="signal-grid">
          <span>road-load</span>
          <strong>Automated</strong>
          <span>dynamometer</span>
          <strong>Large datasets</strong>
          <span>reporting</span>
          <strong>Executive-ready</strong>
        </div>
      </aside>
    </section>
  );
}

function About() {
  return (
    <section className="section intro-grid" id="about" aria-labelledby="about-title">
      <div>
        <p className="section-kicker">About</p>
        <h2 id="about-title">Automotive domain knowledge meets practical data automation.</h2>
      </div>
      <div className="section-copy">
        <p>
          I work at the intersection of automotive engineering, analytics, and internal tooling. As a Junior
          R&D Analyst in Energy Efficiency & Data Analytics at Hyundai Motor Brasil, I build workflows that help
          translate raw vehicle measurements into faster engineering decisions.
        </p>
        <p>
          My path started in electrical engineering and vehicle systems, then naturally expanded into Python
          automation as I saw how much engineering time could be saved by making analysis pipelines clearer,
          faster, and repeatable.
        </p>
        <p>
          My edge is understanding both sides of the workflow: the technical context behind vehicle tests and
          the data layer needed to turn raw measurements into decisions, dashboards, and executive-ready reports.
        </p>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="section metrics" aria-label="Professional highlights">
      {metrics.map((metric) => (
        <article className="metric-card" key={metric.value}>
          <span className="metric-value">{metric.value}</span>
          <span className="metric-label">{metric.label}</span>
        </article>
      ))}
    </section>
  );
}

function Work() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="section-heading work-heading">
        <div>
          <p className="section-kicker">Featured Work</p>
          <h2 id="work-title">Selected data and automation themes</h2>
        </div>
        <div className="filter-controls" aria-label="Filter featured work">
          {filters.map((filter) => (
            <button
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
            <p className="project-type">{project.type}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tag-list" aria-label={`${project.title} technologies`}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Focus() {
  return (
    <section className="section focus-band" aria-labelledby="focus-title">
      <div>
        <p className="section-kicker">Current Focus</p>
        <h2 id="focus-title">Building toward remote data and automation roles.</h2>
      </div>
      <ul className="focus-list">
        {focusItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function Stack() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="section-heading">
        <p className="section-kicker">Tech Stack</p>
        <h2 id="stack-title">Tools grouped by how I use them</h2>
      </div>
      <div className="stack-grid">
        {stackGroups.map((group) => (
          <article className="stack-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
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
        <h2 id="contact-title">Open to data analytics and automation conversations.</h2>
        <p>
          I am interested in remote and hybrid roles where automotive domain knowledge, Python tooling, and
          analytics can make technical teams faster and more effective.
        </p>
      </div>
      <div className="contact-panel">
        <p className="contact-label">Best fit</p>
        <p>Data Analytics, Automation Engineering, Python tooling, AI/Data Analytics.</p>
        <p className="contact-note">
          Best conversations start with practical problems: messy test data, repetitive reports, internal tools,
          dashboards, and workflows that should be easier to trust.
        </p>
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
        <About />
        <Metrics />
        <Work />
        <Focus />
        <Stack />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>Felipe Arthur Eckert</span>
        <span>Data Analyst & Automation Engineer</span>
      </footer>
    </>
  );
}
