import type { Metadata } from "next";
import Script from "next/script";
import "../styles/portfolios.css";

export const metadata: Metadata = {
  title: "Black Polar — Portfolio",
  description:
    "Black Polar portfolio — infrastructure projects, security engagements, and consulting mandates.",
  authors: [{ name: "BLACK POLAR GROUP" }],
  icons: { icon: "/assets/portfolios/image/favicon.ico" },
};

export default function PortfoliosPage() {
  return (
    <>
{/* ══ MOBILE NAV ══════════════════════════════════════════ */}
<div id="mob-nav" aria-hidden="true">
  <button id="mob-close" aria-label="Close menu">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  </button>
  <a href="#projects">Projects</a>
  <a href="#team">Team</a>
  <a href="#clients">Clients</a>
  <a href="#showcase">Showcase</a>
  <a href="/" className="mob-home">← Home</a>
</div>


{/* ══ HEADER ══════════════════════════════════════════════ */}
<header id="hdr">
  <div className="hdr-inner">

    <a href="/" className="hdr-logo" aria-label="Black Polar Home">
      <div className="hdr-logo-sq"><span></span></div>
      <span className="hdr-logo-name">BLACK POLAR</span>
    </a>

    <div className="hdr-center">
      <div className="dot-live"></div>
      <span className="mono-label">portfolio.v2026</span>
    </div>

    <nav className="hdr-nav" aria-label="Portfolio navigation">
      <a href="#projects" className="mono-label nav-link">Projects</a>
      <a href="#team"     className="mono-label nav-link">Team</a>
      <a href="#clients"  className="mono-label nav-link">Clients</a>
      <a href="#showcase" className="mono-label nav-link">Showcase</a>
      <a href="/" className="mono-label nav-link nav-home">← Home</a>
    </nav>

    <button id="mob-toggle" className="hdr-burger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span style={{ width: '13px' }}></span>
    </button>

  </div>
</header>


{/* ══ HERO ════════════════════════════════════════════════ */}
<section className="hero-section" aria-label="Portfolio hero">

  <div className="hero-grid-bg" aria-hidden="true"></div>
  <div className="grid-cross" style={{ top: '120px', left: '80px' }}  aria-hidden="true"></div>
  <div className="grid-cross" style={{ top: '120px', right: '80px' }} aria-hidden="true"></div>
  <div className="grid-cross" style={{ bottom: '80px', left: '80px' }}  aria-hidden="true"></div>
  <div className="grid-cross" style={{ bottom: '80px', right: '80px' }} aria-hidden="true"></div>

  <div className="hero-content">

    <div className="hero-eyebrow hero-el" style={{ animationDelay: '.15s' }}>
      <div className="dot-live"></div>
      <span className="mono-label">BP-PORTFOLIO / CASE_STUDIES / ALL</span>
    </div>

    <h1 className="hero-title hero-el" style={{ animationDelay: '.3s' }}>
      WORK<br/>
      <span className="hero-title-outline">ARCHIVE</span>
    </h1>

    <div className="hero-sub-row hero-el" style={{ animationDelay: '.55s' }}>
      <p className="hero-sub-text">
        A complete record of infrastructure projects, security engagements, system deployments, and consulting mandates delivered since 2025.
      </p>
      <div className="hero-counters">
        <div className="hero-counter-item">
          <div className="count-up" data-count="3" data-suffix="">0</div>
          <div className="mono-label">Total Projects</div>
        </div>
        <div className="hero-counter-div" aria-hidden="true"></div>
        <div className="hero-counter-item">
          <div className="count-up" data-count="6" data-suffix="">0</div>
          <div className="mono-label">Years Active</div>
        </div>
      </div>
    </div>

    <div className="hero-terminal hero-el" style={{ animationDelay: '.75s' }}>
      <div className="terminal">
        <div className="term-line"><span className="term-prompt">$</span><span className="term-cmd"> bp --list-projects --filter=all --sort=date</span></div>
        <div className="term-line"><span className="term-out">Loading <span className="term-hl">3 projects</span> across <span className="term-hl">3 domains</span>...</span></div>
        <div className="term-line"><span className="term-out">Status: <span className="term-ok">● OPERATIONAL</span></span></div>
        <div className="term-line"><span className="term-out">Last updated: <span className="term-hl">2026-03-21</span></span></div>
      </div>
    </div>

  </div>

  <div className="hero-scroll hero-el" style={{ animationDelay: '1.1s' }} aria-hidden="true">
    <span className="mono-label">scroll</span>
    <div className="hero-scroll-line"></div>
  </div>

</section>

<div className="sec-rule"></div>


{/* ══ STATS ROW ════════════════════════════════════════════ */}
<section className="stats-row" aria-label="Domain statistics">
  <div className="stats-row-inner">

    <div className="stat-box rv">
      <div className="mono-label stat-box-label">Cybersecurity</div>
     
    </div>

    <div className="stat-box rv d1">
      <div className="mono-label stat-box-label">Infrastructure</div>
      
    </div>

    <div className="stat-box rv d2">
      <div className="mono-label stat-box-label">Sysadmin</div>
     
    </div>

    <div className="stat-box rv d3">
      <div className="mono-label stat-box-label">Consulting</div>

    </div>

  </div>
</section>

<div className="sec-rule"></div>


{/* ══ PROJECTS ═════════════════════════════════════════════ */}
<section id="projects" className="section-pad">
  <div className="container">

    <div className="section-head">
      <div>
        <div className="mono-label rv">001 — Project Registry</div>
        <h2 className="section-title rv d1">All Projects</h2>
      </div>
      <div className="filter-tabs rv d2" role="group" aria-label="Filter projects">
        <button className="filter-tab active" data-filter="all">All</button>
        <button className="filter-tab" data-filter="infrastructure">Infra</button>
        <button className="filter-tab" data-filter="consulting">Consulting</button>
      </div>
    </div>

    {/* Column headers */}
    <div className="proj-col-header rv d2">
      <div></div>
      <div className="mono-label">Project / Client</div>
      <div className="mono-label">Status</div>
    </div>

    {/* Project rows — 3 real projects */}
    <div id="proj-list">

      <div className="proj-row rv" data-cat="infrastructure">
        <span className="proj-num">01</span>
        <div className="proj-inner">
          <span className="proj-title">Solvijaya — Infrastructure</span>
          <div className="proj-meta">
            <span className="proj-tag">Infrastructure</span>
            <span className="proj-year">2025</span>
          </div>
        </div>
        <div className="proj-right">
          <span className="proj-status status-delivered">Delivered</span>
          <svg className="proj-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>

      <div className="proj-row rv d1" data-cat="infrastructure consulting">
        <span className="proj-num">02</span>
        <div className="proj-inner">
          <span className="proj-title">Seminsa — Infrastructure · Consulting</span>
          <div className="proj-meta">
            <span className="proj-tag">Infrastructure</span>
            <span className="proj-tag">Consulting</span>
            <span className="proj-year">2025</span>
          </div>
        </div>
        <div className="proj-right">
          <span className="proj-status status-delivered">Delivered</span>
          <svg className="proj-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>

      <div className="proj-row rv d2" data-cat="consulting">
        <span className="proj-num">03</span>
        <div className="proj-inner">
          <span className="proj-title">Shark Optimization — Consulting · Cloud Migration</span>
          <div className="proj-meta">
            <span className="proj-tag">Consulting</span>
            <span className="proj-tag">Cloud Migration</span>
            <span className="proj-year">2026</span>
          </div>
        </div>
        <div className="proj-right">
          <span className="proj-status status-ongoing">Ongoing</span>
          <svg className="proj-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>

    </div>

    <div className="proj-footer rv">
      <span className="mono-label">Showing 3 of 3</span>
    </div>

  </div>
</section>

<div className="sec-rule"></div>


{/* ══ TEAM ═════════════════════════════════════════════════ */}
<section id="team" className="section-pad section-dark" aria-label="Team">
  <div className="container">

    <div className="section-head">
      <div>
        <div className="mono-label rv">002 — Team Registry</div>
        <h2 className="section-title rv d1">The Operators</h2>
      </div>
      <p className="section-sub rv d2">
        A lean, specialized team with deep field experience across every domain we operate in.
      </p>
    </div>

    {/* 3 members, 2-column layout centered */}
    <div className="team-grid" id="team-grid">
      {/* Rendered by index.js */}
    </div>

  </div>
</section>

<div className="sec-rule"></div>


{/* ══ CLIENTS ══════════════════════════════════════════════ */}
<section id="clients" className="section-pad" aria-label="Clients">
  <div className="container">

    <div className="section-head">
      <div>
        <div className="mono-label rv">003 — Client Roster</div>
        <h2 className="section-title rv d1">Trusted By</h2>
      </div>
    </div>

    {/* Empty — to be populated later */}
    <div className="clients-placeholder rv">
      <div className="dot-live" aria-hidden="true"></div>
      <span className="mono-label">Client information coming soon.</span>
    </div>

  </div>
</section>

<div className="sec-rule"></div>


{/* ══ SHOWCASE ═════════════════════════════════════════════ */}
<section id="showcase" className="section-pad section-dark" aria-label="Showcase">
  <div className="container">

    <div className="section-head">
      <div>
        <div className="mono-label rv">004 — Deep Dives</div>
        <h2 className="section-title rv d1">Showcase</h2>
      </div>
      <p className="section-sub rv d2">
        Selected case studies with full technical scope, tooling, and outcome metrics.
      </p>
    </div>

    {/* Empty — to be populated later */}
    <div className="showcase-placeholder rv">
      <div className="dot-live" aria-hidden="true"></div>
      <span className="mono-label">Case studies coming soon.</span>
    </div>

  </div>
</section>

<div className="sec-rule"></div>


{/* ══ TECH STACK ════════════════════════════════════════════ */}
<section className="section-pad-sm" aria-label="Technology stack">
  <div className="container">

    <div className="mono-label rv" style={{ marginBottom: '28px' }}>005 — Technology Stack</div>

    <div className="stack-grid rv">
      <div className="stack-col">
        <div className="mono-label stack-col-title" style={{ color: 'var(--green)' }}>Cloud Platforms</div>
        <div className="badge-group">
          <span className="tech-badge">AWS</span>
          <span className="tech-badge">Azure</span>
          <span className="tech-badge">GCP</span>
          <span className="tech-badge">Oracle Cloud</span>
          <span className="tech-badge">Cloudflare</span>
        </div>
      </div>
      <div className="stack-col">
        <div className="mono-label stack-col-title">Security Tools</div>
        <div className="badge-group">
          <span className="tech-badge">CrowdStrike</span>
          <span className="tech-badge">Splunk</span>
          <span className="tech-badge">Palo Alto</span>
          <span className="tech-badge">Nessus</span>
          <span className="tech-badge">Burp Suite</span>
        </div>
      </div>
      <div className="stack-col">
        <div className="mono-label stack-col-title">Infrastructure</div>
        <div className="badge-group">
          <span className="tech-badge">Kubernetes</span>
          <span className="tech-badge">Terraform</span>
          <span className="tech-badge">Ansible</span>
          <span className="tech-badge">Docker</span>
          <span className="tech-badge">HAProxy</span>
        </div>
      </div>
      <div className="stack-col">
        <div className="mono-label stack-col-title">Monitoring</div>
        <div className="badge-group">
          <span className="tech-badge">Prometheus</span>
          <span className="tech-badge">Grafana</span>
          <span className="tech-badge">Datadog</span>
          <span className="tech-badge">Zabbix</span>
          <span className="tech-badge">PagerDuty</span>
        </div>
      </div>
    </div>

  </div>
</section>


{/* ══ FOOTER ════════════════════════════════════════════════ */}
<footer className="site-footer" role="contentinfo">
  <div className="footer-inner">

    <div className="footer-logo">
      <div className="hdr-logo-sq"><span></span></div>
      <span className="hdr-logo-name">BLACK POLAR</span>
    </div>

    <nav className="footer-nav" aria-label="Footer navigation">
      <a href="#projects" className="mono-label nav-link">Projects</a>
      <a href="#team"     className="mono-label nav-link">Team</a>
      <a href="#clients"  className="mono-label nav-link">Clients</a>
      <a href="#showcase" className="mono-label nav-link">Showcase</a>
      <a href="/"         className="mono-label nav-link">← Main Site</a>
    </nav>

    <p className="mono-label footer-copy">© <span id="yr"></span> Black Polar</p>

  </div>
</footer>
      <Script src="/js/portfolios/index.js" strategy="afterInteractive" />
    </>
  );
}
