# Portfolio — Project Structure

Live: https://markenrportfolio.is-a.dev
Repo: https://github.com/imnrqzz/Portfolio

## Features

- Dark/light mode with persistent theme toggle
- Responsive layout (mobile-first, works on all screen sizes)
- Contact form with honeypot spam protection, rate limiting, and Gmail delivery
- IntersectionObserver scroll reveals with staggered animations
- GitHub contributions graph with zoom on mobile
- Semantic HTML, JSON-LD structured data, Open Graph meta tags
- SEO: robots.txt, sitemap.xml, 404 page, PWA manifest
- Serverless API (Vercel function) for contact form processing

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** Node.js (Vercel serverless function + Nodemailer)
- **Deployment:** Vercel (auto-deploy from GitHub)
- **Domain:** is-a.dev (CNAME via Cloudflare proxy)

## Folder map

```
portfolio/
├── index.html            # main page (all sections)
├── 404.html              # error page
├── favicon.ico           # browser tab icon
├── robots.txt            # SEO: crawler rules (keep at root)
├── sitemap.xml           # SEO: page list (keep at root)
├── site.webmanifest      # PWA manifest
├── package.json
├── css/
│   ├── main.css          # layout, colors, components
│   └── animations.css    # transitions, keyframes, hover effects
├── js/
│   └── main.js           # interactions, theme toggle, observers
├── api/
│   └── contact.js        # serverless contact form -> Gmail
├── assets/
│   ├── images/           # all site images (photos, project shots, og-image)
│   ├── certs/            # certificate images
│   ├── icons/            # apple-touch-icon, favicon variants
│   └── fonts/            # self-hosted fonts (add future fonts here)
```

## Rules

- **SEO files stay at root**: `robots.txt`, `sitemap.xml`, `favicon.ico`. Search engines expect them there.
- **All images go in `assets/images/`** — including social cards like `og-image.png`.
- **Fonts go in `assets/fonts/`** — never load from root or css/.
- **New SEO files** (verification files, structured data, etc.): add them at root unless they're images (then `assets/images/`).
- Keep one file per purpose — no stray files at root.
