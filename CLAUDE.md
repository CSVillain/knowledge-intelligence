# CLAUDE.md

Guidance for Claude Code and other AI assistants working in this repository.

---

## Project Overview

This repository publishes the **Knowledge Intelligence** white paper and framework as a static website hosted on GitHub Pages at [knowledge-intelligence.dev](https://knowledge-intelligence.dev).

**This is not a software application.** It is a structured systems design initiative — a strategically authored document artefact. Treat all content work with the same discipline applied to the framework itself.

---

## Repository Structure

```
knowledge-intelligence/
├── index.html                    # Landing page and chapter hub
├── pages/
│   ├── assets.html               # Source page (permalink: /assets.html)
│   ├── barriers.html             # Source page (permalink: /barriers.html)
│   ├── capability.html           # Source page (permalink: /capability.html)
│   ├── challenge.html            # Source page (permalink: /challenge.html)
│   ├── decisions.html            # Source page (permalink: /decisions.html)
│   ├── framework.html            # Source page (permalink: /framework.html)
│   └── measurement.html          # Source page (permalink: /measurement.html)
├── CNAME                         # Custom domain — do not delete
├── README.md                     # Project overview
├── AGENTS.md                     # Coding agent guidance (Codex/OpenAI)
├── CLAUDE.md                     # This file
├── assets/
│   ├── css/
│   │   └── site.css              # Shared stylesheet
│   ├── js/
│   │   └── site.js               # Shared JavaScript
│   └── images/
│       ├── kore-logo-horizontal-gradient-dark.svg
│       └── network.png
└── .github/
    └── workflows/
        └── deploy.yml            # GitHub Pages deployment pipeline
```

---

## Tech Stack

| Concern | Detail |
|---|---|
| Site type | Static HTML source + Jekyll build for clean URL routing |
| Styling | Shared CSS in `assets/css/site.css` |
| JS | Shared JS in `assets/js/site.js` + Lucide icons via CDN |
| Fonts | Google Fonts (Bricolage Grotesque, DM Sans, Inter, Space Grotesk) |
| Deployment | GitHub Actions → GitHub Pages |
| Package manager | None |
| Tests | None |
| Backend | None |

---

## Safe Edit Scope

Default editable files for site updates:

- `index.html`
- `pages/**`
- `assets/**`
- `README.md`
- `.github/workflows/deploy.yml` (only when changing deployment behaviour)

**Do not edit unless explicitly requested:**

- `CNAME` — must remain at repo root to preserve custom domain mapping

---

## Deployment

- **Trigger**: push to `main` or manual workflow dispatch via GitHub UI
- **Build**: `actions/jekyll-build-pages@v1` (source `.` → destination `./_site`)
- **Artifact path**: `./_site`
- **Custom domain**: configured via `CNAME`; never delete this file

Pushing to `main` is the required deploy action; GitHub Actions handles the Jekyll build and Pages deploy.

---

## Validation Checklist (Before Committing)

1. Confirm changed assets exist and all paths in `index.html` / `pages/*.html` are correct.
2. Verify no internal/unintended directories have been exposed for publishing (check `.gitignore`).
3. Ensure `.github/workflows/deploy.yml` still builds and uploads `./_site`.
4. If links were changed, use absolute domain links or root-relative paths consistent with GitHub Pages hosting.
5. Content changes must comply with the writing constraints below.

---

## Git Hygiene

- Keep commits focused and small.
- Do not force-push unless explicitly requested.
- Do not revert unrelated local changes made by the user.
- Target branch for AI-assisted work: feature branches prefixed `claude/` (created per session)
- Production branch: `main` (triggers live deployment on push)

---

## Content Governance — Instruction Set Summary

The `instructions/` directory contains authoritative governance documents. All content work must follow these rules.

### Conceptual Positioning

Treat Knowledge Intelligence as:

- An **architectural correction** to systemic weaknesses in enterprise knowledge ecosystems
- A discipline that moves from storage and search toward **measurable decision leverage**
- A **governance model** as much as a technical model

Do **not** position it as:
- "The future of work" or any transformation narrative
- A rebranding of AI
- A generic content management upgrade
- A buzzword layer over search and tagging

### Structural Framing

All content must be structured around these five pillars:

1. **Problem Reality** — define structural failures and operational consequences
2. **Structural Correction** — define the architectural shift and how it differs from existing KM patterns
3. **Measurement & Signals** — define measurable signals, thresholds, degradation indicators, and drift conditions
4. **Operating Model** — define ownership of taxonomy, thresholds, and governance intervention
5. **Intelligence Layer** — define what makes outputs decision-grade and how traceability is preserved

Every section must answer:
- What problem is being solved?
- Why do current models fail?
- What structural shift is introduced?
- How is success measured?
- How is failure detected?

### Writing Constraints

- Use plain, disciplined language
- Avoid hype, unverified statistics, and AI utopianism
- Avoid abstract academic terminology
- No unverified statistics
- No abstract transformation claims
- Define ownership and thresholds
- Separate confidence, coverage, and consistency
- Expose assumptions and scale risks
- If a claim cannot be structurally defended, remove it

### Anti-Hype Safeguards

Value must be framed only in terms of:
- Reduced ambiguity
- Reduced risk
- Improved decision quality
- Measurable signal clarity

### Intellectual Discipline

- Label speculation clearly
- Expose hidden assumptions
- Identify scale risks and governance blind spots
- Distinguish novelty from recombination

### Red Team Requirement

No white paper draft is considered complete without a formal red-team review. Before finalising any draft, identify:

- Failure modes
- Taxonomy fragility
- Governance risk
- Behavioural resistance

Red-team evaluation outputs must include:
- Top 5 structural vulnerabilities
- Top 3 economic weaknesses
- Top 3 governance risks
- Top 3 measurement fragilities
- Final verdict: **durable**, **conditionally viable**, or **fragile**

---

## White Paper Narrative Arc

When developing or extending white paper content, follow this arc:

1. Structural problem
2. Limits of current KM and AI tooling
3. Architectural correction
4. Measurement discipline
5. Governance model
6. Decision-grade outputs
7. Risks and limitations
8. Conceptual implementation trajectory

---

## What Claude Should and Should Not Do

**Do:**
- Edit `index.html` and `pages/*.html` for visual, structural, or content updates as requested
- Follow the content governance constraints above for any text additions
- Keep commits small and descriptive
- Respect the safe edit scope boundaries

**Do not:**
- Add marketing language, hype, or transformation claims to white paper content
- Add unverified statistics or claims
- Delete `CNAME`
- Push to `main` without confirmation
- Force-push
