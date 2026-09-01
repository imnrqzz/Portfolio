# Portfolio — Project Structure

Live: https://markenrportfolio.is-a.dev
Repo: https://github.com/imnrqzz/Portfolio

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
