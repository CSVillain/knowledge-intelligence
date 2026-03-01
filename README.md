# Knowledge Intelligence

A strategic overview of Knowledge Intelligence (KI) as an enterprise capability.

## Site map

- Home: https://knowledge-intelligence.dev/
- The Assets: https://knowledge-intelligence.dev/assets.html
- The Challenge: https://knowledge-intelligence.dev/challenge.html
- The Capability: https://knowledge-intelligence.dev/capability.html
- The Framework: https://knowledge-intelligence.dev/framework.html
- The Decisions: https://knowledge-intelligence.dev/decisions.html
- The Measurement: https://knowledge-intelligence.dev/measurement.html
- The Barriers: https://knowledge-intelligence.dev/barriers.html

## Repository structure

- `index.html`: landing page and chapter hub
- `pages/`: chapter pages
- `assets/css/site.css`: shared styles
- `assets/js/site.js`: shared scripts
- `assets/images/`: image assets
- `CNAME`: custom domain mapping (`knowledge-intelligence.dev`)

## Deployment

The site is deployed by GitHub Actions + GitHub Pages via `.github/workflows/deploy.yml`.

- Trigger: push to `main` or manual dispatch
- Build: Jekyll build (`actions/jekyll-build-pages@v1`)
- Published artifact: `./_site`
- Public chapter URLs remain clean at root (`/assets.html`, `/challenge.html`, etc.) via page-level `permalink` front matter in `pages/*.html`

From information abundance to decision advantage.
