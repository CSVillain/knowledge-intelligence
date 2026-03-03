(function () {
  if (!window.React || !window.ReactDOM || !window.htm) return;

  const React = window.React;
  const { useState, useEffect, useRef } = React;
  const ReactDOM = window.ReactDOM;

  function cssToJsStyle(styleText) {
    if (!styleText || typeof styleText !== "string") return styleText;
    const out = {};
    styleText.split(";").forEach((decl) => {
      const idx = decl.indexOf(":");
      if (idx === -1) return;
      const rawKey = decl.slice(0, idx).trim();
      const rawVal = decl.slice(idx + 1).trim();
      if (!rawKey || !rawVal) return;

      if (rawKey.startsWith("--")) {
        out[rawKey] = rawVal;
        return;
      }

      const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = rawVal;
    });
    return out;
  }

  function createElement(type, props, ...children) {
    if (props && typeof props.style === "string") {
      props = { ...props, style: cssToJsStyle(props.style) };
    }
    return React.createElement(type, props, ...children);
  }

  const html = window.htm.bind(createElement);

  const comparisonRows = [
    { label: "Purpose",    legacy: "How should content be organised and found?",  ki: "What does this content collectively indicate?" },
    { label: "Reliability",legacy: "Is it accessible and compliant?",              ki: "How confident should we be in it?" },
    { label: "Action",     legacy: "Has it been reviewed?",                        ki: "When should it drive action or restraint?" },
    { label: "Quality",    legacy: "Is it complete and correctly formatted?",      ki: "Does it strengthen decision confidence?" },
    { label: "Evolution",  legacy: "Is it up to date?",                           ki: "Is the concept still valid now?" }
  ];

  const tacitCards = [
    { icon: "signals", title: "Digital signals",      text: "Use metadata trails from work systems: authorship, edits, handoffs, and query paths." },
    { icon: "radar",   title: "Inferred expertise",   text: "Continuously infer domain ownership from contribution quality and decision outcomes." },
    { icon: "brain",   title: "Targeted elicitation", text: "Run short expert prompts only when risk is high or confidence is conflicting." },
    { icon: "shield",  title: "Exit governance",      text: "Require transfer evidence during role transitions with explicit accountable owners." }
  ];

  const healthDimensions = [
    { label: "Confidence",    value: 82, color: "#67e8f9", track: "rgba(103,232,249,0.12)" },
    { label: "Currency",      value: 65, color: "#7dd3fc", track: "rgba(125,211,252,0.12)" },
    { label: "Usage",         value: 74, color: "#6ee7b7", track: "rgba(110,231,183,0.12)" },
    { label: "Concentration", value: 38, color: "#fcd34d", track: "rgba(252,211,77,0.12)"  },
    { label: "Alignment",     value: 70, color: "#a5b4fc", track: "rgba(165,180,252,0.12)" }
  ];

  /* ── SVG GLYPHS ─────────────────────────────────────── */
  function Glyph({ name, className: cls = "" }) {
    const shared = { viewBox:"0 0 24 24", className: cls, fill:"none", stroke:"currentColor", strokeWidth:"1.8", "aria-hidden":"true" };
    const p = (d) => html`<svg ...${shared}><path d=${d}/></svg>`;
    const shapes = {
      signals:  html`<svg ...${shared}><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-8"/><path d="M22 19v-4"/></svg>`,
      radar:    html`<svg ...${shared}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5"/></svg>`,
      brain:    html`<svg ...${shared}><path d="M9 4a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0 0 5V14a3 3 0 0 0 3 3"/><path d="M15 4a3 3 0 0 1 3 3v1a2.5 2.5 0 0 1 0 5V14a3 3 0 0 1-3 3"/><path d="M9 8h6"/><path d="M9 12h6"/></svg>`,
      shield:   html`<svg ...${shared}><path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
      folder:   html`<svg ...${shared}><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h4l2 2h7A2.5 2.5 0 0 1 21 10.5v7A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9z"/></svg>`,
      ingest:   html`<svg ...${shared}><path d="M12 4v11"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M4 20h16"/></svg>`,
      extract:  html`<svg ...${shared}><path d="m9 7-5 5 5 5"/><path d="m15 7 5 5-5 5"/><path d="m13 5-2 14"/></svg>`,
      merge:    html`<svg ...${shared}><circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="M7.5 8.5 11 15"/><path d="M16.5 8.5 13 15"/></svg>`,
      state:    html`<svg ...${shared}><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/><path d="M12 3v2"/></svg>`,
      document: html`<svg ...${shared}><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
      arrow:    html`<svg ...${shared}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`,
      fork:     html`<svg ...${shared}><circle cx="6" cy="5" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 5h4a4 4 0 0 1 4 4v6"/></svg>`,
      activity: html`<svg ...${shared}><path d="M3 12h4l2-4 4 8 2-4h6"/></svg>`,
      check:    html`<svg ...${shared}><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></svg>`,
      alert:    html`<svg ...${shared}><path d="M12 3 3 19h18L12 3Z"/><path d="M12 9v5"/><circle cx="12" cy="17" r="1"/></svg>`,
      lock:     html`<svg ...${shared}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
      map:      html`<svg ...${shared}><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14"/><path d="M15 6v14"/></svg>`,
    };
    return shapes[name] || null;
  }

  /* ── FULL-WIDTH PIPELINE PANEL ───────────────────────── */
  function CapabilityPipelinePanel({ isMobile, isTablet }) {
    const stages = [
      { icon: "folder", title: "Content Sources", detail: "Structured and tacit signals are assembled.", accent: "#38bdf8" },
      { icon: "ingest", title: "Ingestion", detail: "Evidence is normalized and made traceable.", accent: "#60a5fa" },
      { icon: "extract", title: "Extraction", detail: "Entities, claims, and context are extracted.", accent: "#a78bfa" },
      { icon: "merge", title: "Synthesis", detail: "Signals are weighted into one confidence posture.", accent: "#67e8f9" },
      { icon: "shield", title: "Policy Gate", detail: "Governance controls approve or withhold influence.", accent: "#22d3ee" },
      { icon: "state", title: "Decision State", detail: "Output state is published for governed use.", accent: "#6ee7b7" },
    ];
    const stageWidth = isMobile ? 176 : isTablet ? 182 : 150;
    const stageHeight = isMobile ? 170 : isTablet ? 176 : 166;
    const stageTitleSize = isMobile ? "16px" : isTablet ? "16px" : "15px";
    const stageBodySize = isMobile ? "12px" : isTablet ? "12px" : "11px";
    const stageIconSize = isMobile ? "24px" : isTablet ? "22px" : "20px";
    const arrowSize = isMobile ? "20px" : isTablet ? "20px" : "18px";
    const arrowWidth = isMobile ? "28px" : isTablet ? "28px" : "22px";
    const flowMinWidth = isTablet ? "1210px" : "0";

    return html`
      <article style=${`padding:${isMobile ? "6px 0 0" : "10px 0 0"};margin-bottom:16px;`}>
        <div style="margin-bottom:16px;">
          <p style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(103,232,249,0.78);margin:0 0 6px;">
            Governed Knowledge Pipeline
          </p>
          <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:${isMobile ? "22px" : "26px"};font-weight:700;letter-spacing:-0.02em;color:rgba(241,245,249,0.96);line-height:1.2;margin:0;">
            One clean path from signal to governed decision state
          </h2>
        </div>

        <div style=${`overflow-x:${isTablet ? "auto" : "visible"};padding-top:14px;padding-bottom:${isTablet ? "4px" : "0"};`}>
          <div style=${`display:flex;align-items:stretch;gap:0;min-width:${flowMinWidth};`}>
            ${stages.map((stage, index) => html`
              <div key=${stage.title} style=${`display:flex;align-items:center;gap:${isMobile || isTablet ? "10px" : "8px"};`}>
                <article style=${`width:${stageWidth}px;min-height:${stageHeight}px;border-radius:24px;border:1px solid ${stage.accent}99;background:linear-gradient(180deg,rgba(9,23,45,0.6) 0%,rgba(3,12,24,0.86) 100%);padding:${isMobile || isTablet ? "16px 14px" : "14px 12px"};display:flex;flex-direction:column;justify-content:flex-start;`}>
                  <div style=${`color:${stage.accent};margin-bottom:14px;`}>
                    <${Glyph} name=${stage.icon} className="h-[21px] w-[21px]" style=${`width:${stageIconSize};height:${stageIconSize};`} />
                  </div>
                  <p style=${`font-family:'Bricolage Grotesque',sans-serif;font-size:${stageTitleSize};font-weight:700;letter-spacing:-0.01em;color:rgba(241,245,249,0.97);line-height:1.14;margin:0 0 8px;`}>${stage.title}</p>
                  <p style=${`font-size:${stageBodySize};line-height:1.45;color:rgba(186,198,216,0.84);margin:0;`}>${stage.detail}</p>
                </article>
                ${index < stages.length - 1 && html`
                  <div style=${`width:${arrowWidth};height:100%;display:flex;align-items:center;justify-content:center;color:rgba(96,165,250,0.92);flex-shrink:0;`}>
                    <${Glyph} name="arrow" className="h-[20px] w-[20px]" style=${`width:${arrowSize};height:${arrowSize};`} />
                  </div>
                `}
              </div>
            `)}
          </div>
        </div>
      </article>
    `;
  }

  /* ── PILLAR CARD ────────────────────────────────────── */
  function PillarCard({ icon, title, text }) {
    return html`
      <article style="border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(4,14,30,0.55);padding:20px;transition:transform 0.25s ease,border-color 0.25s ease,background 0.25s ease;"
        onMouseEnter=${e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='rgba(103,232,249,0.35)'; e.currentTarget.style.background='rgba(6,20,44,0.8)'; }}
        onMouseLeave=${e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.background='rgba(4,14,30,0.55)'; }}
      >
        <div style="width:36px;height:36px;border-radius:10px;border:1px solid rgba(103,232,249,0.3);background:rgba(103,232,249,0.08);display:flex;align-items:center;justify-content:center;color:rgba(103,232,249,0.85);margin-bottom:14px;">
          <${Glyph} name=${icon} className="h-[16px] w-[16px]" />
        </div>
        <h4 style="font-family:'Space Grotesk',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(226,232,240,0.9);margin:0 0 8px;">${title}</h4>
        <p style="font-size:13px;line-height:1.65;color:rgba(148,163,184,0.85);margin:0;">${text}</p>
      </article>
    `;
  }

  /* ── HEALTH BAR ─────────────────────────────────────── */
  function HealthBar({ label, value, color, track }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setWidth(value); io.disconnect(); }
      }, { threshold: 0.3 });
      if (ref.current) io.observe(ref.current);
      return () => io.disconnect();
    }, [value]);

    return html`
      <div ref=${ref}>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;">
          <span style="font-size:13px;color:rgba(203,213,225,0.85);">${label}</span>
          <span style="font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;color:rgba(148,163,184,0.7);">${value}%</span>
        </div>
        <div style="height:5px;border-radius:999px;background:rgba(255,255,255,0.06);overflow:hidden;">
          <div style="height:100%;border-radius:999px;background:${color};box-shadow:0 0 10px ${color}55;width:${width}%;transition:width 1.1s cubic-bezier(0.23,1,0.32,1);"></div>
        </div>
      </div>
    `;
  }

  /* ── MAIN APP ───────────────────────────────────────── */
  function CapabilityApp() {
    const [viewportWidth, setViewportWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 1200
    );

    useEffect(() => {
      const onResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    const isTablet = viewportWidth < 1080;
    const isMobile = viewportWidth < 760;

    return html`
      <section style=${`position:relative;max-width:1100px;margin:0 auto;padding:${isMobile ? "94px 16px 56px" : isTablet ? "104px 24px 72px" : "112px 32px 80px"};`}>

        <!-- Ambient glow blobs -->
        <div style="pointer-events:none;position:absolute;left:-80px;top:40px;width:360px;height:360px;border-radius:50%;background:rgba(34,211,238,0.07);filter:blur(80px);"></div>
        <div style="pointer-events:none;position:absolute;right:-60px;top:120px;width:300px;height:300px;border-radius:50%;background:rgba(245,158,11,0.07);filter:blur(80px);"></div>

        <!-- Page header -->
        <header style=${`position:relative;margin-bottom:${isMobile ? "32px" : "48px"};`}>
          <p style="font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(103,232,249,0.75);margin-bottom:16px;">
            The Knowledge Intelligence Capability
          </p>
          <h1 style=${`font-family:'Bricolage Grotesque',sans-serif;font-size:${isMobile ? "clamp(44px,10.8vw,54px)" : "clamp(32px,4.5vw,54px)"};font-weight:800;letter-spacing:-0.03em;line-height:1.08;color:rgba(241,245,249,0.97);max-width:820px;margin:0 0 20px;`}>
            A decision-grade capability for explicit and tacit knowledge.
          </h1>
          <p style=${`font-size:${isMobile ? "16px" : "17px"};line-height:1.7;color:rgba(148,163,184,0.9);max-width:680px;margin:0;`}>
            Knowledge Intelligence operates as a governed system. Signal is extracted, confidence is weighted, and output is policy-gated before any decision pathway can consume it.
          </p>
        </header>

        <!-- ── ROW 1: Unified Pipeline ─────────────────── -->
        <${CapabilityPipelinePanel} isMobile=${isMobile} isTablet=${isTablet} />

        <!-- ── ROW 2: Comparison table ─────────────────── -->
        <section style=${`border-radius:20px;border:1px solid rgba(255,255,255,0.08);background:rgba(4,14,30,0.6);padding:${isMobile ? "16px" : "24px"};margin-bottom:16px;`}>
          <div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:20px;">
            <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:rgba(241,245,249,0.95);margin:0;">What the capability asks</h2>
            <p style="font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(100,116,139,0.8);margin:0;">Legacy stack vs Knowledge Intelligence</p>
          </div>

          <div style="overflow-x:auto;padding-bottom:2px;">
            <div style=${`min-width:${isMobile ? "760px" : "0"};`}>
              <!-- Header -->
              <div style="display:grid;grid-template-columns:130px 1fr 1fr;gap:2px;margin-bottom:2px;">
                <div style="padding:8px 12px;"></div>
                <div style="padding:8px 14px;background:rgba(255,255,255,0.03);border-radius:8px 0 0 0;border:1px solid rgba(255,255,255,0.06);">
                  <span style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(100,116,139,0.7);">Traditional KM</span>
                </div>
                <div style="padding:8px 14px;background:rgba(103,232,249,0.04);border-radius:0 8px 0 0;border:1px solid rgba(103,232,249,0.12);position:relative;overflow:hidden;">
                  <div style="position:absolute;left:0;top:4px;bottom:4px;width:2px;background:linear-gradient(to bottom,transparent,rgba(103,232,249,0.6),transparent);border-radius:2px;"></div>
                  <span style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(103,232,249,0.8);">Knowledge Intelligence</span>
                </div>
              </div>

              <div style="display:flex;flex-direction:column;gap:2px;">
                ${comparisonRows.map(({ label, legacy, ki }) => html`
                  <div key=${label} style="display:grid;grid-template-columns:130px 1fr 1fr;gap:2px;">
                    <div style="padding:13px 12px;background:rgba(8,8,8,0.5);border:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;">
                      <span style="font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:rgba(100,116,139,0.65);">${label}</span>
                    </div>
                    <div style="padding:13px 14px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.05);">
                      <p style="font-size:13px;line-height:1.55;color:rgba(148,163,184,0.7);margin:0;">${legacy}</p>
                    </div>
                    <div style="padding:13px 14px;background:rgba(103,232,249,0.03);border:1px solid rgba(103,232,249,0.1);position:relative;overflow:hidden;">
                      <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,transparent,rgba(103,232,249,0.45),transparent);"></div>
                      <p style="font-size:13px;line-height:1.55;color:rgba(220,230,242,0.92);margin:0;">${ki}</p>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          </div>
        </section>

        <!-- ── ROW 3: Tacit pillar cards ───────────────── -->
        <section style=${`display:grid;grid-template-columns:${isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)"};gap:12px;margin-bottom:16px;`}>
          ${tacitCards.map(item => html`<${PillarCard} key=${item.title} icon=${item.icon} title=${item.title} text=${item.text} />`)}
        </section>

        <!-- ── ROW 4: Health Score + Taxonomy loop ─────── -->
        <section style=${`display:grid;grid-template-columns:${isTablet ? "1fr" : "1.1fr 0.9fr"};gap:16px;`}>

          <!-- Health Score -->
          <article style=${`border-radius:20px;border:1px solid rgba(255,255,255,0.08);background:rgba(4,14,30,0.6);padding:${isMobile ? "16px" : "24px"};`}>
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
              <div style="width:40px;height:40px;border-radius:12px;border:1px solid rgba(103,232,249,0.28);background:rgba(103,232,249,0.08);display:flex;align-items:center;justify-content:center;color:rgba(103,232,249,0.85);flex-shrink:0;">
                <${Glyph} name="activity" className="h-[18px] w-[18px]" />
              </div>
              <div>
                <p style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(100,116,139,0.8);margin:0 0 3px;">Knowledge Health Score</p>
                <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:rgba(241,245,249,0.95);margin:0;">Composite governance output</h3>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px;">
              ${healthDimensions.map(dim => html`
                <${HealthBar} key=${dim.label} label=${dim.label} value=${dim.value} color=${dim.color} track=${dim.track} />
              `)}
            </div>

            <div style=${`display:grid;grid-template-columns:${isMobile ? "1fr" : "repeat(3,1fr)"};gap:10px;`}>
              <div style="border-radius:12px;border:1px solid rgba(110,231,183,0.3);background:rgba(110,231,183,0.07);padding:12px;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                  <${Glyph} name="check" className="h-[14px] w-[14px]" style="color:rgba(110,231,183,0.9);" />
                  <p style="font-size:13px;color:rgba(167,243,208,0.95);margin:0;font-weight:600;">Trust</p>
                </div>
                <p style="font-size:11px;line-height:1.5;color:rgba(167,243,208,0.7);margin:0;">Decision-safe, monitor routinely</p>
              </div>
              <div style="border-radius:12px;border:1px solid rgba(252,211,77,0.3);background:rgba(252,211,77,0.07);padding:12px;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                  <${Glyph} name="alert" className="h-[14px] w-[14px]" style="color:rgba(252,211,77,0.9);" />
                  <p style="font-size:13px;color:rgba(253,230,138,0.95);margin:0;font-weight:600;">Review</p>
                </div>
                <p style="font-size:11px;line-height:1.5;color:rgba(253,230,138,0.7);margin:0;">Validate before operational use</p>
              </div>
              <div style="border-radius:12px;border:1px solid rgba(253,164,175,0.3);background:rgba(253,164,175,0.07);padding:12px;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
                  <${Glyph} name="lock" className="h-[14px] w-[14px]" style="color:rgba(253,164,175,0.9);" />
                  <p style="font-size:13px;color:rgba(254,205,211,0.95);margin:0;font-weight:600;">Retire</p>
                </div>
                <p style="font-size:11px;line-height:1.5;color:rgba(254,205,211,0.7);margin:0;">Block until remediated</p>
              </div>
            </div>
          </article>

          <!-- Taxonomy control loop -->
          <article style=${`border-radius:20px;border:1px solid rgba(103,232,249,0.18);background:linear-gradient(155deg,rgba(103,232,249,0.06) 0%,rgba(4,14,30,0.6) 60%);padding:${isMobile ? "16px" : "24px"};`}>
            <p style="font-family:'Space Grotesk',sans-serif;font-size:9.5px;font-weight:700;letter-spacing:0.17em;text-transform:uppercase;color:rgba(103,232,249,0.7);margin:0 0 8px;">Living Taxonomy Control Loop</p>
            <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:rgba(241,245,249,0.95);line-height:1.25;margin:0 0 20px;">Static structure becomes continuous governance</h3>

            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
                { icon: "map",      title: "Pattern detection proposes taxonomy updates",  body: "Emerging concepts are surfaced before drift accumulates." },
                { icon: "shield",   title: "Approvers retain activation authority",         body: "Human governance remains the control boundary." },
                { icon: "activity", title: "Health and drift measured continuously",        body: "Weak dimensions trigger review before failure propagates." },
              ].map(({ icon, title, body }) => html`
                <div key=${title} style="border-radius:12px;border:1px solid rgba(255,255,255,0.07);background:rgba(4,14,30,0.7);padding:14px 16px;">
                  <div style="display:flex;align-items:center;gap:9px;margin-bottom:5px;color:rgba(203,213,225,0.9);">
                    <${Glyph} name=${icon} className="h-[14px] w-[14px]" style="flex-shrink:0;" />
                    <p style="font-size:13px;font-weight:500;margin:0;">${title}</p>
                  </div>
                  <p style="font-size:12px;line-height:1.55;color:rgba(100,116,139,0.9);margin:0;padding-left:23px;">${body}</p>
                </div>
              `)}
            </div>
          </article>
        </section>

      </section>
    `;
  }

  const mount = document.getElementById("capability-app");
  if (mount) {
    ReactDOM.createRoot(mount).render(html`<${CapabilityApp} />`);
  }
}());
