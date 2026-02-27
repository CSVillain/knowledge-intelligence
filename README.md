# knowledge-intelligence

Static GitHub Pages site for `knowledge-intelligence.dev`.

## Deployment
- Source: repository root (`index.html`, `assets/`, `images/`, `CNAME`)
- Workflow: `.github/workflows/deploy.yml`
- Trigger: push to `main` (or manual workflow dispatch)

## Codex Environment Settings
Use these settings when creating/editing a Codex environment for this repo:

- `Container image`: `universal`
- `Container caching`: `On`
- `Setup script`: `Manual` (no dependency install/build needed)
- `Agent internet access`: `Off` by default
- `Environment variables`: none required
- `Secrets`: none required for content edits; add a GitHub token only if you want Codex to push/PR from the environment

## Notes
- Keep `CNAME` in repo root to preserve custom domain mapping.
- Prefer root-relative asset paths for GitHub Pages compatibility.
- Repo-specific agent guidance lives in `AGENTS.md`.
