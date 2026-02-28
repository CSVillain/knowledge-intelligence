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
├── index.html                    # Single-page website (all HTML, CSS, JS inline)
├── CNAME                         # Custom domain — do not delete
├── README.md                     # Project overview
├── AGENTS.md                     # Coding agent guidance (Codex/OpenAI)
├── CLAUDE.md                     # This file
├── assets/
│   └── kore-logo-horizontal-gradient-dark.svg
├── images/
│   ├── network.png               # Hero background
│   └── Henley docs/              # Reference PDF materials
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages deployment pipeline
├── instructions/                 # Authoritative content governance documents
│   ├── Knowledge_Intelligence_Executive_Instruction_Block.md
│   ├── Knowledge_Intelligence_Full_Instruction_Set.md
│   ├── Knowledge_Intelligence_Red_Team_Instruction_Set.md
│   └── Knowledge_Intelligence_Strategy_Governance_Pack_v1.0.md
└── research/                     # Supporting research reports
    ├── know-intl-deep-research-report.md
    ├── know-intl-deep-research-report-v2.md
    ├── know-intl-deep-research-report-v3.md      # Most complete version
    ├── kore-deep-research-report.md
    └── Henley docs/
```

---

## Tech Stack

| Concern | Detail |
|---|---|
| Site type | Static HTML — no build step, no framework |
| Styling | Embedded CSS in `index.html` (CSS variables, dark theme) |
| JS | Minimal inline scripts + Lucide icons via CDN |
| Fonts | Google Fonts (Bricolage Grotesque, DM Sans, Inter, Space Grotesk) |
| Deployment | GitHub Actions → GitHub Pages |
| Package manager | None |
| Tests | None |
| Backend | None |

---

## Safe Edit Scope

Default editable files for site updates:

- `index.html`
- `assets/**`
- `images/**` (only files already referenced by `index.html`)
- `.github/workflows/deploy.yml` (only when changing deployment behaviour)

**Do not edit unless explicitly requested:**

- `research/` — research reports used as source material
- `instructions/` — authoritative governance and instruction documents
- `whitepaper/`, `tools/` — reserved directories (not yet created)
- `CNAME` — must remain at repo root to preserve custom domain mapping

---

## Deployment

- **Trigger**: push to `main` or manual workflow dispatch via GitHub UI
- **Artifact path**: repository root (`.`) — all published files must remain in a root-relative layout
- **Custom domain**: configured via `CNAME`; never delete this file

Pushing to `main` is the only required deploy action. There is no build, compile, or bundle step.

---

## Validation Checklist (Before Committing)

1. Confirm changed assets exist and all paths in `index.html` are correct.
2. Verify no internal/unintended directories have been exposed for publishing (check `.gitignore`).
3. Ensure `.github/workflows/deploy.yml` still references the correct artifact path (`.`).
4. If links were changed, use absolute domain links or root-relative paths consistent with GitHub Pages hosting.
5. Content changes must comply with the writing constraints below.

---

## Git Hygiene

- Keep commits focused and small.
- Do not force-push unless explicitly requested.
- Do not revert unrelated local changes made by the user.
- Target branch for AI-assisted work: `claude/add-claude-documentation-DvOof`
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

## Research Materials

The `research/` directory contains supporting reports. The most complete reference is:

- `research/know-intl-deep-research-report-v3.md` — reference architecture, capability layers, open-source toolchain, use cases
- `research/kore-deep-research-report.md` — Kore Common Knowledge Asset (CKA) Standard v1.3, signal computation formulas, lifecycle states

These are **source material**, not published content. Do not treat them as authoritative outputs.

---

## What Claude Should and Should Not Do

**Do:**
- Edit `index.html` for visual, structural, or content updates as requested
- Follow the content governance constraints above for any text additions
- Keep commits small and descriptive
- Respect the safe edit scope boundaries

**Do not:**
- Add marketing language, hype, or transformation claims to white paper content
- Edit `instructions/` or `research/` unless explicitly asked
- Add unverified statistics or claims
- Delete `CNAME`
- Push to `main` without confirmation
- Force-push
