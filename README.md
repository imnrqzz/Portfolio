# Mark Anthony Enriquez — Portfolio

Personal portfolio site: web developer & BSIT student. Live at [markenrportfolio.is-a.dev](https://markenrportfolio.is-a.dev).

## Tech Stack
- HTML5, CSS3, vanilla JavaScript
- Sora (headings) + Inter (body) via Google Fonts
- Devicon icon set (CDN)
- Serverless contact form: Vercel Function → Gmail SMTP
- Vercel Analytics
- Deployed on Vercel, custom domain via is-a.dev

## File Structure

```
portfolio/
├── index.html            # Main page (hero, about, projects, certs, contact)
├── 404.html              # Custom 404 page (served automatically by Vercel)
├── favicon.ico           # Site favicon (root — browsers request it here)
├── robots.txt            # Crawler rules; points to sitemap
├── sitemap.xml           # URL list for search engines
├── site.webmanifest      # PWA manifest (name, icons, theme)
├── package.json          # Node config (Vercel build)
├── README.md             # This file
├── .gitignore            # Git ignore rules (token, node_modules)
├── api/
│   └── contact.js        # Serverless contact form → Gmail
├── assets/
│   ├── images/           # All site images (photos, project screenshots, og-image)
│   ├── certs/            # Certificate images
│   ├── icons/            # App icons (apple-touch-icon)
│   └── fonts/            # Future self-hosted fonts (currently empty)
├── css/
│   ├── main.css          # Core styles, layout, theme
│   └── animations.css    # Transitions, keyframes, reduced-motion
├── js/
│   └── main.js           # Click handlers, theme toggle, reveal-on-scroll
└── projects/
    └── shoe-inventory-system.md  # Case study (source doc, not yet a page)
```

## Run Locally
```bash
cd portfolio
python -m http.server 8000
# open http://localhost:8000
```
No build step. Note: the contact form only works on the deployed Vercel site (needs the `/api/contact` function + Gmail env vars).

## Deployment
- **Host:** Vercel (auto-deploys from the `main` branch on push)
- **Domain:** markenrportfolio.is-a.dev (CNAME via is-a.dev GitHub PR)
- **Contact form env vars (set on Vercel):** `GMAIL_USER`, `GMAIL_APP_PASSWORD`
- **Repo:** github.com/imnrqzz/Portfolio

## Planned
- **Shoe Inventory System v2** — cleaner architecture rebuild, currently in progress. Will add case study + updated preview when it ships.
