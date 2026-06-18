# portfolio.dporkov.tech

[![Deploy to GitHub Pages](https://github.com/borntoeatt/website/actions/workflows/deploy.yml/badge.svg)](https://github.com/borntoeatt/website/actions/workflows/deploy.yml)

Personal portfolio / résumé site for **Dimitar Porkov** — DevOps Engineer at SAP.
A single-page, fully static site hosted on GitHub Pages at
[portfolio.dporkov.tech](https://portfolio.dporkov.tech).

## Tech

- Plain HTML, CSS and vanilla JavaScript — no build step.
- [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts.
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for client-side résumé export.
- Google Analytics (gtag.js).

## Features

- **Light / dark theme** — toggled in the nav, follows the OS preference by default, and remembers the choice in `localStorage`.
- **Responsive layout** — two-column hero, skills grid, and experience timeline collapse cleanly on mobile, with a slide-down nav menu.
- **Scroll-reveal** animations (respects `prefers-reduced-motion`).
- **One-click résumé export** — the "Download résumé" button renders the résumé sections to a clean, light-themed PDF entirely in the browser.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and content |
| `index.css` | Design system (CSS variables), layout, theming, print/PDF styles |
| `script.js` | Theme toggle, mobile menu, scroll reveal, PDF export |
| `images/` | Profile photo |
| `cloudie-logo.png` | Home-lab (cloudtobe.online) logo |
| `Dox/` | Recommendation letter + résumé PDFs |
| `CNAME` | Custom domain for GitHub Pages |

## Local preview

```bash
python3 -m http.server 4173
# then open http://localhost:4173
```

## Deployment

Deployed to GitHub Pages by a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
on every push to `main`. No build step — the workflow uploads the static files as a Pages
artifact and publishes them.

**One-time setup:** in the repo on GitHub, go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions** (instead of "Deploy from a branch"). The custom
domain (`CNAME`) is preserved automatically.
