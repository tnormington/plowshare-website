# Plowshare Website

Marketing website for [Plowshare](https://plowshare.app) — an on-demand snow plowing service that connects property owners with reliable snow plow drivers.

## Pages

- **Home** (`index.html`) — Landing page with hero, features, app mockups, pricing, and signup form
- **Contact** (`contact.html`) — Contact form and support information
- **Privacy** (`privacy.html`) — Privacy policy
- **Terms** (`terms.html`) — Terms of service
- **Cookies** (`cookies.html`) — Cookie policy
- **Accessibility** (`accessibility.html`) — Accessibility statement

## Tech Stack

- Static HTML, CSS, and JavaScript (no framework)
- [Lucide](https://lucide.dev/) icons
- CSS minification via `clean-css-cli`
- JS minification via `uglify-js`
- Local dev server via `serve`
- End-to-end tests via Playwright
- Deployed to GitHub Pages

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+

### Install

```bash
npm install
```

### Development

Start the dev server with file watching and auto-minification:

```bash
npm run dev
```

This runs the following concurrently:
- CSS watcher — re-minifies `css/styles.css` on change
- JS watcher — re-minifies `js/main.js` on change
- Static file server at `http://localhost:3000`

### Build

Minify CSS and JS for production:

```bash
npm run build
```

### Test

Run Playwright end-to-end tests:

```bash
npm test
```

## Project Structure

```
├── css/
│   ├── styles.css          # Source styles
│   └── styles.min.css      # Minified (generated)
├── js/
│   ├── main.js             # Source scripts
│   ├── main.min.js         # Minified (generated)
│   └── header-nav.js       # Header navigation
├── images/                 # SVG mockups, icons, and OG image
├── videos/                 # Video assets
├── tests/                  # Playwright e2e tests
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── index.html              # Home page
├── contact.html            # Contact page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── cookies.html            # Cookie policy
├── accessibility.html      # Accessibility statement
├── robots.txt              # Search engine crawl rules
├── sitemap.xml             # Sitemap for SEO
└── site.webmanifest        # PWA manifest
```

## Deployment

The site auto-deploys to GitHub Pages on push to `master` via the `.github/workflows/deploy.yml` workflow.
