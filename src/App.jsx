import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { ArrowUpRight, Briefcase, Code2, Download, Mail } from "lucide-react";
import DataField from "./DataField.jsx";
import StackVisual from "./StackVisual.jsx";

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
  { value: "~80%", from: 0, to: 80, prefix: "~", suffix: "%", label: "less time per road-load analysis after automating it in Python" },
  { value: "< 5%", from: 12, to: 5, prefix: "< ", suffix: "%", label: "result variability after automated validation, against a 10% limit in the standard" },
  { value: "1st", label: "place at the Hyundai Prompt-a-thon 2026, with an AI reporting hub" },
  { value: "2026", from: 2018, to: 2026, label: "paper published at SIMEA, the Brazilian automotive engineering symposium" },
];

const workflow = [
  {
    title: "Collect",
    copy: "Raw files arrive from different test systems, each with its own format, plus noise and a few runs that went wrong on the track.",
  },
  {
    title: "Validate",
    copy: "Every run is checked against clear rules before it reaches the analysis. Outliers are flagged and removed, not argued about later.",
  },
  {
    title: "Analyze",
    copy: "The model is fitted to the clean data with Python, pandas and statistics, and every step is repeatable for the next test.",
  },
  {
    title: "Report",
    copy: "The result becomes a chart and a short conclusion people can decide on: here, run-to-run variability well below the 10% limit.",
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
        gsap.from(split.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.15 });
        gsap.from(".hero-kicker, .hero-sub, .hero-actions", {
          opacity: 0,
          y: 14,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.55,
          stagger: 0.08,
        });

        gsap.utils.toArray(".section > h2").forEach((heading) => {
          const lines = SplitText.create(heading, { type: "lines", mask: "lines" }).lines;
          gsap.from(lines, {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: heading, start: "top 85%" },
          });
        });
        ScrollTrigger.refresh();
      });

      // the hero data field drifts slower than the page, then fades as you leave it
      gsap.to(".datafield", {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // result counters
      gsap.utils.toArray(".result").forEach((el, i) => {
        const value = el.querySelector(".result-value");
        const from = Number(value.dataset.from);
        const to = Number(value.dataset.to);
        const prefix = value.dataset.prefix || "";
        const suffix = value.dataset.suffix || "";
        const counter = { v: from };
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: ".results", start: "top 88%" },
        });
        if (!Number.isNaN(from) && !Number.isNaN(to)) {
          value.textContent = `${prefix}${from}${suffix}`;
          gsap.to(counter, {
            v: to,
            duration: 1.6,
            ease: "power2.out",
            delay: 0.15 + i * 0.08,
            onUpdate: () => {
              value.textContent = `${prefix}${Math.round(counter.v)}${suffix}`;
            },
            scrollTrigger: { trigger: ".results", start: "top 88%" },
          });
        }
      });

      // work entries assemble as they scroll in
      gsap.utils.toArray(".work-item").forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 82%" } });
        tl.from(item, { "--rule": 0, duration: 1.2, ease: "expo.out" })
          .from(item.querySelector("header"), { opacity: 0, x: -24, duration: 0.9, ease: "power3.out" }, 0)
          .from(item.querySelectorAll("dl > div"), { opacity: 0, y: 18, duration: 0.7, ease: "power3.out", stagger: 0.09 }, 0.12)
          .from(item.querySelectorAll(".stack li"), { opacity: 0, scale: 0.9, duration: 0.4, ease: "back.out(2)", stagger: 0.04 }, 0.4);
      });

      // about: skills rows and timeline
      gsap.from(".skills > div", {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".skills", start: "top 85%" },
      });
      gsap.fromTo(
        ".timeline",
        { "--line": 0 },
        { "--line": 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 80%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray(".timeline li").forEach((li) => {
        gsap.from(li, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: li, start: "top 85%" } });
      });

      gsap.from(".contact ul li", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".contact ul", start: "top 92%" },
      });
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
          <p
            className="result-value"
            data-from={item.from}
            data-to={item.to}
            data-prefix={item.prefix}
            data-suffix={item.suffix}
          >
            {item.value}
          </p>
          <p className="result-label">{item.label}</p>
        </div>
      ))}
    </section>
  );
}

function Workflow() {
  const progressRef = useRef(0);
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [explode, setExplode] = useState(0);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) {
      progressRef.current = workflow.length;
      setActive(workflow.length - 1);
      setExplode(1);
      return undefined;
    }
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress * workflow.length;
        progressRef.current = p;
        setActive(Math.min(workflow.length - 1, Math.floor(p)));
        setExplode(Math.round(Math.min(1, p / 0.6) * 100) / 100);
        sectionRef.current.style.setProperty("--story", self.progress.toFixed(4));
      },
    });
    return () => trigger.kill();
  }, [reduced]);

  return (
    <section className={reduced ? "story is-static" : "story"} ref={sectionRef} aria-labelledby="workflow-title">
      <div className="story-sticky">
        <div className="story-text">
          <h2 id="workflow-title">How I work with data</h2>
          <p className="story-note">The layers behind every analysis I ship, from the raw test file to the report on someone's desk.</p>
          <ol className="story-steps">
            {workflow.map((step, index) => (
              <li key={step.title} className={index === active ? "is-active" : index < active ? "is-done" : ""}>
                <span className="step-index">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="story-progress" aria-hidden="true">
            <span />
          </div>
        </div>
        <div className="story-visual">
          <StackVisual active={active} explode={explode} />
        </div>
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
