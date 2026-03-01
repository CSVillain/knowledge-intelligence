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


    /* ── FADE-IN ────────────────────────────────────────────────── */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

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
            d.style.transition = 'opacity 0.4s ease';
            setTimeout(() => { d.style.opacity = '1'; }, 1800);
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

