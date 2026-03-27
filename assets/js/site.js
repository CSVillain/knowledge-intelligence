    /* ── LOCAL FRONT MATTER CLEANUP ─────────────────────────────── */
    (function () {
      const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
      if (!isLocalHost) return;
      if (!window.location.pathname.startsWith('/pages/')) return;

      const body = document.body;
      if (!body) return;

      const textNodes = [];
      let node = body.firstChild;
      while (node && textNodes.length < 8) {
        if (node.nodeType === Node.TEXT_NODE) textNodes.push(node);
        if (node.nodeType === Node.ELEMENT_NODE) break;
        node = node.nextSibling;
      }
      if (!textNodes.length) return;

      const joined = textNodes.map((n) => n.textContent || '').join('');
      const fmMatch = joined.match(/^\s*---[\s\S]*?permalink:[\s\S]*?---\s*/);
      if (!fmMatch) return;

      let remaining = fmMatch[0];
      textNodes.forEach((n) => {
        const txt = n.textContent || '';
        if (!remaining) return;
        if (remaining.length >= txt.length) {
          n.textContent = '';
          remaining = remaining.slice(txt.length);
        } else {
          n.textContent = txt.slice(remaining.length);
          remaining = '';
        }
      });
    }());

    /* ── ICEBERG INTERACTION ────────────────────────────────────── */
    (function () {
      // Simple hover/click cross-linking for callout cards ↔ bullet items

      function initIceberg(sectionEl) {
        if (!sectionEl) return;
        const callouts = [...sectionEl.querySelectorAll('.ice-callout[data-key]')];
        let active = null;

        function setActive(key) {
          active = key || null;
          callouts.forEach(el => el.classList.toggle('is-active', el.dataset.key === active));
        }

        callouts.forEach(el => {
          el.addEventListener('pointerenter', () => setActive(el.dataset.key));
          el.addEventListener('pointerleave', () => setActive(null));
          el.addEventListener('focus', () => setActive(el.dataset.key));
          el.addEventListener('blur', () => setActive(null));
        });
      }

      function init() {
        document.querySelectorAll('.ki-iceberg').forEach(initIceberg);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    }());


    /* ── LOCAL PREVIEW LINK FIXUP ───────────────────────────────── */
    (function () {
      const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
      const isFilePreview = window.location.protocol === 'file:';
      if (!isLocalHost && !isFilePreview) return;

      const path = window.location.pathname;

      const isSkippableHref = (href) => {
        if (!href) return true;
        if (href.startsWith('#')) return true;
        if (href.startsWith('http://') || href.startsWith('https://')) return true;
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return true;
        return !href.startsWith('/');
      };

      const isRootHtmlHref = (href) => /^\/[^?#]+\.html(?:[?#].*)?$/.test(href);

      const rewriteRootLinksToPages = () => {
        document.querySelectorAll('a[href]').forEach((link) => {
          const href = link.getAttribute('href');
          if (isSkippableHref(href)) return;
          if (href === '/') return;
          if (isRootHtmlHref(href) && !href.startsWith('/pages/')) {
            link.setAttribute('href', `/pages${href}`);
          }
        });
      };

      if (isFilePreview) {
        document.querySelectorAll('a[href]').forEach((link) => {
          const href = link.getAttribute('href');
          if (isSkippableHref(href)) return;
          if (href === '/') {
            link.setAttribute('href', './index.html');
          } else if (isRootHtmlHref(href) && !href.startsWith('/pages/')) {
            link.setAttribute('href', `./pages${href}`);
          }
        });
        return;
      }

      if (path.startsWith('/pages/')) {
        rewriteRootLinksToPages();
        return;
      }

      if (path === '/' || path.endsWith('/index.html')) {
        rewriteRootLinksToPages();
      }
    }());

    /* ── NAV ACTIVE LINK ─────────────────────────────────────────── */
    (function () {
      const navLinks = [...document.querySelectorAll('nav[aria-label="Main navigation"] .nav-links a[href]')];
      const logoLink = document.querySelector('nav[aria-label="Main navigation"] .nav-logo-link[href]');
      if (!navLinks.length && !logoLink) return;

      const normalize = (href) => {
        if (!href) return '';
        if (href.startsWith('http://') || href.startsWith('https://')) {
          try {
            const url = new URL(href);
            return normalize(url.pathname);
          } catch {
            return '';
          }
        }
        let out = href.replace(/^\/pages\//, '/');
        out = out.replace(/\/index\.html$/, '/');
        return out;
      };

      const current = normalize(window.location.pathname);
      navLinks.forEach((link) => {
        const target = normalize(link.getAttribute('href'));
        if (!target || target.startsWith('#')) return;
        const isMatch = current === target || (current === '/' && target === '/');
        if (isMatch) link.setAttribute('aria-current', 'page');
      });

      if (logoLink) {
        const logoTarget = normalize(logoLink.getAttribute('href'));
        if (current === '/' && logoTarget === '/') {
          logoLink.setAttribute('aria-current', 'page');
        }
      }
    }());

    /* ── MOBILE NAV DRAWER ──────────────────────────────────────── */
    (function () {
      const nav = document.querySelector('nav[aria-label="Main navigation"]');
      const navLinks = nav && nav.querySelector('.nav-links');
      if (!nav || !navLinks) return;

      const links = [...navLinks.querySelectorAll('a[href]')];
      if (!links.length) return;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-toggle';
      toggle.setAttribute('aria-label', 'Open navigation menu');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>';

      const panel = document.createElement('div');
      panel.className = 'nav-panel';
      panel.setAttribute('aria-label', 'Mobile navigation');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'false');

      links.forEach((link) => {
        const cloned = link.cloneNode(true);
        cloned.addEventListener('click', () => closeMenu());
        panel.appendChild(cloned);
      });

      function openMenu() {
        panel.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation menu');
        document.body.classList.add('nav-open');
      }

      function closeMenu() {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('nav-open');
      }

      function onToggle() {
        if (panel.classList.contains('is-open')) closeMenu();
        else openMenu();
      }

      toggle.addEventListener('click', onToggle);
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
      });

      nav.appendChild(toggle);
      nav.insertAdjacentElement('afterend', panel);
    }());

    /* ── FADE-IN ────────────────────────────────────────────────── */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
      } else {
        io.observe(el);
      }
    });

    /* ── HERO TITLE CHARACTER REVEAL ────────────────────────────── */
    function wrapChars(el, delayStart) {
      const text = el.textContent;
      el.innerHTML = '';
      text.split('').forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.style.animationDelay = (delayStart + i * 0.035) + 's';
        el.appendChild(s);
      });
    }
    const w1 = document.getElementById('htw1');
    const w2 = document.getElementById('htw2');
    if (w1 && w2) { wrapChars(w1, 0.2); wrapChars(w2, 0.7); }
    function initLucideIcons() {
      if (!(window.lucide && typeof window.lucide.createIcons === 'function')) return false;
      window.lucide.createIcons({
        attrs: {
          'stroke-width': '2.1'
        }
      });
      return true;
    }

    if (!initLucideIcons()) {
      let lucideAttempts = 0;
      const lucideTimer = setInterval(() => {
        lucideAttempts += 1;
        if (initLucideIcons() || lucideAttempts > 30) clearInterval(lucideTimer);
      }, 120);
      window.addEventListener('load', initLucideIcons, { once: true });
    }

    /* ── ANIMATED SECTION DIVIDERS ──────────────────────────────── */
    const divObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.remove('pulse-active');
          void e.target.offsetWidth; // reflow
          e.target.classList.add('pulse-active');
          divObs.unobserve(e.target);
        }
      });
    }, { threshold: 1.0 });
    document.querySelectorAll('.div-full').forEach(el => divObs.observe(el));

    /* ── KNOWLEDGE DECAY CURVE ──────────────────────────────────── */
    const decayObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.decay-path').forEach((p, i) => {
            setTimeout(() => p.classList.add('animated'), i * 400);
          });
          e.target.querySelectorAll('.decay-dot').forEach(d => {
            d.style.transition = 'opacity 0.5s ease';
            const delay = d.classList.contains('decay-delay-3') ? 2600
                        : d.classList.contains('decay-delay-2') ? 2200
                        : 1800;
            setTimeout(() => { d.style.opacity = '1'; }, delay);
          });
          decayObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    const decayEl = document.querySelector('.viz-decay');
    if (decayEl) decayObs.observe(decayEl);

    /* ── HEAT MAP CELL ANIMATION ────────────────────────────────── */
    const hmObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const cells = e.target.querySelectorAll('.hm-cell:not(.hm-axis-label):not(.hm-col-header)');
          cells.forEach((cell, i) => {
            setTimeout(() => cell.classList.add('visible'), i * 40);
          });
          hmObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    const hmEl = document.querySelector('.viz-heatmap');
    if (hmEl) hmObs.observe(hmEl);

    /* ── KHS RADAR ANIMATION ────────────────────────────────────── */
    const radarObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Five dimensions: Confidence, Currency, Usage, Concentration, Alignment
          // Values (0-1): 0.82, 0.65, 0.74, 0.38, 0.70
          // Points on hexagon at angles: -90°, -18°, 54°, 126°, 198°  (top, then clockwise)
          const cx = 170, cy = 140, rMax = 96;
          const vals = [0.82, 0.65, 0.74, 0.38, 0.70];
          const angles = [-90, -18, 54, 126, 198].map(a => a * Math.PI / 180);
          const pts = vals.map((v, i) => {
            const r = v * rMax;
            return [(cx + r * Math.cos(angles[i])).toFixed(1), (cy + r * Math.sin(angles[i])).toFixed(1)];
          });
          const poly = document.getElementById('radarPoly');
          const dotIds = ['rd1', 'rd2', 'rd3', 'rd4', 'rd5'];
          if (poly) {
            setTimeout(() => {
              poly.setAttribute('points', pts.map(p => p.join(',')).join(' '));
              pts.forEach((p, i) => {
                const d = document.getElementById(dotIds[i]);
                if (d) { d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]); }
              });
            }, 200);
          }
          radarObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    const radarEl = document.querySelector('.khs-radar-wrap');
    if (radarEl) radarObs.observe(radarEl);

    /* ── CKA WHEEL HOVER HIGHLIGHT ──────────────────────────────── */
    const ckaSegs = document.querySelectorAll('.cka-seg');
    const ckaItems = document.querySelectorAll('.cka-legend-item');
    const segColors = [
      'rgba(200,168,74,0.95)', 'rgba(183,150,87,0.93)', 'rgba(164,165,103,0.91)',
      'rgba(120,160,121,0.92)', 'rgba(103,212,135,0.98)', 'rgba(107,184,204,0.95)',
      'rgba(127,143,205,0.95)', 'rgba(211,154,99,0.96)'
    ];
    const segColorsDefault = [
      'rgba(200,168,74,0.56)', 'rgba(183,150,87,0.54)', 'rgba(164,165,103,0.52)',
      'rgba(120,160,121,0.52)', 'rgba(103,212,135,0.58)', 'rgba(107,184,204,0.56)',
      'rgba(127,143,205,0.56)', 'rgba(211,154,99,0.58)'
    ];
    const setSegColor = (seg, color) => {
      seg.setAttribute('stroke', color);
    };
    ckaSegs.forEach((seg, i) => {
      seg.style.transition = 'stroke 0.2s ease';
      seg.addEventListener('mouseenter', () => {
        setSegColor(seg, segColors[i]);
        if (ckaItems[i]) ckaItems[i].classList.add('is-active');
      });
      seg.addEventListener('mouseleave', () => {
        setSegColor(seg, segColorsDefault[i]);
        if (ckaItems[i]) ckaItems[i].classList.remove('is-active');
      });
    });
    ckaItems.forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        if (ckaSegs[i]) setSegColor(ckaSegs[i], segColors[i]);
        item.classList.add('is-active');
      });
      item.addEventListener('mouseleave', () => {
        if (ckaSegs[i]) setSegColor(ckaSegs[i], segColorsDefault[i]);
        item.classList.remove('is-active');
      });
    });

    /* ── CONFIDENCE BAR ANIMATION ───────────────────────────────── */
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.ct-bar').forEach(bar => {
            const w = bar.style.width || getComputedStyle(bar).width;
            bar.style.width = '0';
            bar.style.transition = 'width 1s cubic-bezier(0.4,0,0.2,1)';
            setTimeout(() => { bar.style.width = w; }, 100);
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    const confEl = document.querySelector('.conf-tiers');
    if (confEl) barObs.observe(confEl);

    /* ── HOME HERO NETWORK CANVAS ──────────────────────────────── */
    (function () {
      const canvas = document.getElementById('network-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let rafId;
      let nodes = [];
      const numNodes = reducedMotion ? 40 : 70;
      const connectDist = reducedMotion ? 130 : 160;

      function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      function initNodes() {
        nodes = [];
        for (let i = 0; i < numNodes; i += 1) {
          const isHub = Math.random() < 0.12;
          nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: reducedMotion ? 0 : (Math.random() - 0.5) * 0.28,
            vy: reducedMotion ? 0 : (Math.random() - 0.5) * 0.28,
            r: isHub ? 3.5 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
            hub: isHub,
            glow: isHub ? 0.9 + Math.random() * 0.1 : 0.4 + Math.random() * 0.3,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02
          });
        }
      }

      function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;
          n.pulsePhase += n.pulseSpeed;
          if (n.x < -20) n.x = canvas.width + 20;
          if (n.x > canvas.width + 20) n.x = -20;
          if (n.y < -20) n.y = canvas.height + 20;
          if (n.y > canvas.height + 20) n.y = -20;
        }

        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDist) {
              let alpha = (1 - dist / connectDist) * 0.22;
              if (nodes[i].hub || nodes[j].hub) alpha *= 2.2;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(80, 210, 245, ${alpha})`;
              ctx.lineWidth = (nodes[i].hub || nodes[j].hub) ? 0.8 : 0.4;
              ctx.stroke();
            }
          }
        }

        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          const pulse = Math.sin(n.pulsePhase);
          if (n.hub) {
            const glowR = n.r * (4 + pulse * 1.5);
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
            grad.addColorStop(0, 'rgba(57, 210, 239, 0.34)');
            grad.addColorStop(1, 'rgba(57, 210, 239, 0)');
            ctx.beginPath();
            ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + (n.hub ? pulse * 0.5 : 0), 0, Math.PI * 2);
          ctx.fillStyle = n.hub
            ? `rgba(120, 230, 255, ${n.glow})`
            : `rgba(170, 232, 255, ${n.glow * 0.6})`;
          ctx.fill();
        }

        if (!reducedMotion) rafId = requestAnimationFrame(step);
      }

      function onResize() {
        resize();
        initNodes();
        if (reducedMotion) step();
      }

      window.addEventListener('resize', onResize);
      resize();
      initNodes();
      step();

      window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
      }, { once: true });
    }());
