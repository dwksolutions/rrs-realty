# CLAUDE.md

Guidance for working in this repo. Read this before making changes.

## What this is
RRS Realty Group: a fast, SEO-focused lead-generation site for Southeast Wisconsin
real estate. It is a referral / matching service (NOT a licensed brokerage): a real
person reaches out, has a conversation, then connects the visitor with the right agent
from a team of trusted agents. Built with Astro (static output), deployed to Vercel.

See [TODO.md](TODO.md) for the backlog of missing features and pages.

## HARD RULES (do not break)
1. **No em dashes (—) anywhere.** Copy, titles, meta, comments, content. Use commas,
   colons, periods, or parentheses. Avoid en dashes (–) too; use plain hyphens in
   ranges (e.g. `$200k-$300k`, `1-3 months`).
2. **`src/data/cities.js` is the single source of truth** for which cities we serve.
   The Service Area page, the Market Data pages (/home-values/), and the homepage
   "where we work" strip all read from it. To add/remove a city, edit ONLY that file.
   Never hardcode a city list elsewhere or the pages will drift.

## Deploy workflow (manual, no Git auto-deploy)
There is no Git-to-Vercel auto-deploy (Free-plan limitation). When the owner says
"deploy": run `git push` then `vercel --prod --yes` (also `npm run deploy`).
- GitHub repo: `dwksolutions/rrs-realty` (branch `main`).
- Vercel project: `rrs-realty` (team `workline-iq`).
- Domain: `rrsrealtygroup.com` is canonical (apex); `www` 301-redirects to it (vercel.json).
- `gh` CLI lives at `C:\Program Files\GitHub CLI\gh.exe` (not on PATH).

## Market data
The /home-values/ figures come from `src/data/market-data.csv` (read at build via a
Vite `?raw` import in `src/lib/marketData.js`). NO API. These are Realtor.com LISTING
figures (median list price, $/sqft, days on market, active listings), labeled as such.
To refresh: download "RDC Inventory Core Metrics by ZIP" from realtor.com/research/data,
then `npm run import:market` (or `node scripts/import-rdc.mjs <path>`), then deploy.

## Conventions
- **Headings and nav labels: Title Case** (e.g. "How It Works", "Market Data").
- **Brand colors:** navy `#15315E` (`--ink`), royal blue `#2456C9` (`--brick`),
  blue-gray muted `#5C6A82`. Defined as CSS vars in `src/styles/global.css`.
- **Fonts:** Spectral (serif headings), Libre Franklin (sans body).
- **Lead form:** Formspree, shared `src/components/LeadForm.astro` (id `xpqgqjab`).
  Has TCPA-style consent text; the price field label switches between
  "Expected Price" (selling) and "Budget" (buying).
- **Map:** one shared `src/components/ServiceMap.astro` used on the homepage and
  Service Area page (geographic, real coordinates). Keep it shared so they stay in sync.

## Structure
```
src/
  pages/            One file per page (index, how-it-works, service-area, about,
                    get-started, privacy, terms, cookies)
  pages/home-values/[city].astro   Per-city market-data pages (from cities.js)
  pages/guides/     Blog: index + [...slug] template
  content/guides/   Blog posts (Markdown)
  components/       Header, Footer, LeadForm, CookieBanner, ServiceMap
  layouts/Layout.astro   Shared shell: SEO meta, OG, structured data
  data/cities.js    SINGLE SOURCE for served cities
  data/market-data.csv   Market figures (imported from Realtor.com)
  lib/marketData.js Reads the CSV
  styles/global.css All styling + CSS variables
public/             og-image.png, favicon.svg, robots.txt, admin/ (Decap CMS)
scripts/import-rdc.mjs   Realtor.com CSV importer
```

## Build / verify
- `npm run build` then check `dist/`. Before deploying, confirm there are zero em dashes
  in the built HTML and no broken internal links.
