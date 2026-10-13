import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { ArrowUpRight, Briefcase, Code2, Download, Mail } from "lucide-react";
import DataField from "./DataField.jsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const profile = {
  name: "Felipe Arthur Eckert",
  role: "Data analyst",
  location: "Indaiatuba, São Paulo, Brazil",
  email: "felipeeckert10@gmail.com",
  linkedin: "https://www.linkedin.com/in/felipe-arthur-eckert-b745461a9",
  github: "https://github.com/FelipeEckert",
  resume: `${import.meta.env.BASE_URL}Felipe_Eckert_Resume.pdf`,
};

const results = [
  { value: "~80%", label: "less time per road-load analysis after automating it in Python" },
  { value: "< 5%", label: "result variability after automated validation, against a 10% limit in the standard" },
  { value: "1st", label: "place at the Hyundai Prompt-a-thon 2026, with an AI reporting hub" },
  { value: "2026", label: "paper published at SIMEA, the Brazilian automotive engineering symposium" },
];

const workflow = [
  {
    title: "Collect and validate",
    copy: "Pull raw files from different test systems, standardize them, and check every run against clear rules before it reaches the analysis.",
  },
  {
    title: "Analyze",
    copy: "Find the trends, outliers and drivers in the data with Python, pandas and statistics, and keep the steps repeatable.",
  },
  {
    title: "Report",
    copy: "Turn the result into charts, dashboards and short written conclusions that engineers and managers can decide on.",
  },
];

const work = [
  {
    title: "Coastdown analysis and reporting tool",
    context: "Hyundai Motor Brasil, industry work (code private)",
    problem:
      "Vehicle coastdown tests produce large, messy datasets, and picking the valid runs used to take a lot of manual review.",
    did: "Built a Python and Streamlit application that imports files from different acquisition systems, syncs them with weather-station data, applies the ABNT NBR 10312 corrections, selects the most consistent run pairs, and generates standardized reports.",
    result: "About 80% less analysis time, variability well under the standard's limit, and a paper at SIMEA 2026.",
    stack: ["Python", "pandas", "NumPy", "Streamlit", "SQLite", "Automated reports"],
  },
  {
    title: "R&D Automotive Intelligence Hub",
    context: "Hyundai Prompt-a-thon 2026, first place as a team",
    problem: "R&D information lived in many places, and turning it into an executive update was slow.",
    did: "Built with R&D colleagues a Microsoft 365 Copilot solution that consolidates information from multiple sources into structured executive reports.",
    result: "Won first place among the internal teams.",
    stack: ["Microsoft 365 Copilot", "Generative AI", "Executive reporting"],
  },
  {
    title: "F1 lap time prediction",
    context: "Personal project, in progress",
    problem: "What actually drives race pace: the circuit, the tyres, or the fuel load?",
    did: "Collected 4,032 clean laps from five 2023 Grands Prix, explored them with per-race normalization, and set up a leave-one-race-out comparison of linear regression, random forest and XGBoost with SHAP.",
    result: "Showed that pooled correlations hide the race effect: lap number goes from −0.06 to −0.59 once each race is normalized.",
    stack: ["Python", "FastF1", "pandas", "scikit-learn", "XGBoost", "SHAP"],
    link: "https://github.com/FelipeEckert/f1-laptime-prediction",
  },
  {
    title: "Telemetry data logger",
    context: "Poli-USP BAJA SAE",
    problem: "Setup decisions at competitions were based on feel more than on data.",
    did: "Co-developed a custom data logger with the electronics team and expanded its sensor channels.",
    result: "Telemetry became the basis for vehicle setup decisions across competition events.",
    stack: ["Data acquisition", "Telemetry", "Sensors"],
  },
];

const skills = [
  { group: "Analysis", items: "Python, pandas, NumPy, statistics, data cleaning and validation" },
  { group: "Reporting", items: "Plotly, Matplotlib, Streamlit dashboards, automated PDF and Excel reports, executive presentations" },
  { group: "Automation and ML", items: "Python workflow automation, scikit-learn, XGBoost, SHAP, Git, Microsoft 365 Copilot" },
  { group: "Learning now", items: "SQL, Power BI, Databricks" },
  { group: "Domain", items: "Vehicle test data, chassis dynamometer, coastdown, CAN bus, GPS data acquisition" },
];

const experience = [
  {
    when: "2025 to now",
    title: "Junior R&D analyst, Energy Efficiency and Data Analytics",
    place: "Hyundai Motor Brasil",
    copy: "Process and validate vehicle test data, automate analysis workflows in Python, and report results to engineering and management.",
  },
  {
    when: "2018 to 2024",
    title: "Powertrain director, previously coordinator",
    place: "Poli-USP BAJA SAE",
    copy: "Led powertrain development, telemetry-based setup and supplier negotiations under competition deadlines.",
  },
  {
    when: "2018 to 2025",
    title: "B.S. Electrical Engineering, Automation and Control",
    place: "Escola Politécnica da USP",
    copy: "Specialization in automotive engineering.",
  },
];

function useMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const lenis = new Lenis({ duration: 1.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        const split = SplitText.create(".hero h1", { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          delay: 0.15,
        });
        gsap.from(".hero-sub, .hero-actions", {
          opacity: 0,
          y: 12,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.65,
          stagger: 0.08,
        });
      });

      gsap.fromTo(
        ".workflow-rail span",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".workflow", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        Felipe Eckert
      </a>
      <nav aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-text">
        <p className="hero-kicker">
          {profile.role} in {profile.location}
        </p>
        <h1 id="hero-title">I turn raw engineering data into reports people act on.</h1>
        <p className="hero-sub">
          At Hyundai Motor Brasil's R&D team I validate vehicle test data, automate the analysis in Python, and deliver
          the results as dashboards and reports. Open to hybrid and remote data analyst roles.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#work">
            See my work
          </a>
          <a className="btn" href={profile.resume} download>
            <Download size={16} aria-hidden="true" />
            Download resume
          </a>
        </div>
      </div>
      <DataField />
    </section>
  );
}

function Results() {
  return (
    <section className="results" aria-label="Results">
      {results.map((item) => (
        <div className="result" key={item.label}>
          <p className="result-value">{item.value}</p>
          <p className="result-label">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

function Workflow() {
  return (
    <section className="section workflow" aria-labelledby="workflow-title">
      <h2 id="workflow-title">How I work with data</h2>
      <div className="workflow-body">
        <div className="workflow-rail" aria-hidden="true">
          <span />
        </div>
        <ol>
          {workflow.map((step, index) => (
            <li key={step.title}>
              <span className="step-index">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <h2 id="work-title">Selected work</h2>
      <div className="work-list">
        {work.map((item) => (
          <article className="work-item" key={item.title}>
            <header>
              <h3>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.title}
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <p className="work-context">{item.context}</p>
            </header>
            <dl>
              <div>
                <dt>Problem</dt>
                <dd>{item.problem}</dd>
              </div>
              <div>
                <dt>What I did</dt>
                <dd>{item.did}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{item.result}</dd>
              </div>
            </dl>
            <ul className="stack" aria-label={`${item.title} tools`}>
              {item.stack.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <h2 id="about-title">About</h2>
      <div className="about-grid">
        <div className="about-copy">
          <p>
            I'm an electrical engineer from Poli-USP who ended up doing the part of engineering I like most: making
            sense of the data. In R&D I kept seeing valuable measurements stuck behind manual spreadsheets, so I started
            building the Python tools, checks and reports that get them to a decision faster.
          </p>
          <p>
            That background means I understand where the data comes from and what can go wrong with it. I'm now
            focused on analytics roles, and building my SQL and BI skills on top of a strong Python base. I work
            comfortably in English, Portuguese and Spanish.
          </p>
          <dl className="skills">
            {skills.map((skill) => (
              <div key={skill.group}>
                <dt>{skill.group}</dt>
                <dd>{skill.items}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ol className="timeline">
          {experience.map((item) => (
            <li key={item.title}>
              <p className="when">{item.when}</p>
              <h3>{item.title}</h3>
              <p className="place">{item.place}</p>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { label: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: "LinkedIn", href: profile.linkedin, icon: Briefcase },
    { label: "GitHub", href: profile.github, icon: Code2 },
    { label: "Resume (PDF)", href: profile.resume, icon: Download },
  ];
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Looking for a data analyst who understands where the data comes from?</h2>
      <p>I'm open to hybrid roles around Campinas and São Paulo, and to remote roles in Brazil or abroad.</p>
      <ul>
        {links.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <Icon size={18} aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  useMotion();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Results />
        <Workflow />
        <Work />
        <About />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>{profile.name}</span>
        <span>Built with React, GSAP and a little coastdown data</span>
      </footer>
    </>
  );
}
