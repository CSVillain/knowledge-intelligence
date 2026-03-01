# AGENTS.md

Repository-specific guidance for Codex and other coding agents.

## Authority
- This file is the single source of truth for agent behavior in this repository.
- If another agent-specific file conflicts with this file, follow `AGENTS.md`.
- Agent-specific files are optional compatibility notes only and must not override this file.

## Project Context
- Repo: `knowledge-intelligence`
- Type: Static GitHub Pages site (Jekyll build in CI)
- Entry point: `index.html`
- Content pages source: `pages/*.html` (with Jekyll `permalink` front matter for clean root URLs)
- Assets: `assets/css/`, `assets/js/`, `assets/images/`
- Custom domain configured via `CNAME` (`knowledge-intelligence.dev`)
- Deployment workflow: `.github/workflows/deploy.yml`

## Safe Edit Scope
- Default editable files for site updates:
  - `index.html`
  - `pages/**`
  - `assets/**`
  - `README.md`
  - `.github/workflows/deploy.yml` (only when changing deployment behavior)
- Avoid editing these unless explicitly requested:
  - `research/`
  - `whitepaper/`
  - `tools/`
  - `instructions/`

## Deployment Model
- Deploy trigger: push to `main` or manual workflow dispatch.
- Build step uses `actions/jekyll-build-pages@v1` and outputs `./_site`.
- Pages deploy artifact path is `./_site`.
- Public URLs stay root-level (`/assets.html`, etc.) via `permalink` values in `pages/*.html`.
- Keep `CNAME` in the repo root to preserve custom domain mapping.

## Content Governance
- Write in plain, precise language; avoid hype and transformation buzzwords.
- Avoid unverified statistics or claims.
- Prefer structurally defensible assertions tied to governance, measurement, and decision quality.
- Treat Knowledge Intelligence as an operating/governance capability, not a marketing category.

## Validation Checklist (Before Commit)
1. Confirm changed assets exist and paths in `index.html` / `pages/*.html` are correct.
2. Verify no local/internal directories were unintentionally unignored for publishing.
3. Ensure `.github/workflows/deploy.yml` still builds and uploads `./_site`.
4. If links are changed, prefer absolute domain links or root-relative links consistent with Pages hosting.

## Git Hygiene
- Keep commits focused and small.
- Do not force-push unless explicitly requested.
- Do not revert unrelated local changes made by the user.
