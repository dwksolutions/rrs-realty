# RRS Realty Group — Website

A fast, SEO-focused lead-generation site for RRS Realty Group, built with [Astro](https://astro.build).
Connects Southeast Wisconsin homeowners and buyers with vetted local real estate agents.

- **Hosting:** free on Vercel (or Cloudflare Pages)
- **Code/content home:** GitHub
- **Lead form:** Formspree → rrsrealtygroup@gmail.com
- **Blog publishing:** Markdown files, with an optional click-to-publish dashboard (Decap CMS) at `/admin`

---

## What's in here

```
src/
  pages/            Each file = one page (index, how-it-works, service-area, about, get-started, privacy)
  pages/guides/     The blog: index + post template
  content/guides/   Your blog posts (Markdown). Add new posts here.
  components/        Header, Footer, LeadForm (reused across pages)
  layouts/          The shared page shell (head, fonts, SEO)
  styles/global.css All the design/styling
public/
  admin/            The optional publishing dashboard (Decap CMS)
  favicon.svg, robots.txt
```

To change wording on a page, open the matching file in `src/pages/`. To add a blog post, drop a new `.md` file in `src/content/guides/` (copy an existing one as a template).

---

## Before you go live — 3 things to fill in

1. **Formspree (lead form):** create a free form at [formspree.io](https://formspree.io), set its destination email to `rrsrealtygroup@gmail.com`, copy the form ID it gives you (looks like `xeozabcd`), and paste it into `src/components/LeadForm.astro` where it says `YOUR_FORM_ID`.
2. **Phone number:** there's no phone on the site yet (placeholder left out on purpose). When you have one, add it wherever you'd like — the footer is in `src/components/Footer.astro`.
3. **Decap dashboard (optional):** in `public/admin/config.yml`, replace `YOUR_GITHUB_USERNAME` with your GitHub account. (Full dashboard login needs the one-time OAuth step in Step 5 below — but you can skip all of this and just edit Markdown files / use GitHub's web editor.)

---

## Launch — step by step

### Step 1 — Put the code on GitHub
- Create a new repository on github.com named `rrs-realty`.
- Upload these files to it. Easiest no-tools way: on the empty repo, use **Add file → Upload files** and drag everything in (skip the `node_modules` and `dist` folders — they're rebuilt automatically). Or use the **GitHub Desktop** app to push the folder.

### Step 2 — Connect Vercel
- Go to vercel.com, sign in with GitHub, **Add New → Project**, and import the `rrs-realty` repo.
- Vercel auto-detects Astro. Just click **Deploy**. In about a minute you'll get a live `*.vercel.app` URL to preview.

### Step 3 — Point your domain (Namecheap)
- In Vercel: open the project → **Settings → Domains** → add `rrsrealtygroup.com` and `www.rrsrealtygroup.com`. Vercel shows you the exact DNS records to add.
- In Namecheap: **Domain List → Manage → Advanced DNS**, and add the records Vercel gave you (typically an `A` record for the root and a `CNAME` for `www`). Save.
- DNS can take a little while to propagate. Once it does, RRSRealtyGroup.com loads your site.

### Step 4 — After launch, updates are automatic
Any change pushed to GitHub triggers Vercel to rebuild and republish in about a minute. You never touch a server.

### Step 5 (optional) — Turn on the publishing dashboard
To get a "New Post" dashboard at `rrsrealtygroup.com/admin` without editing code:
- The simplest path is to connect Decap with a GitHub OAuth app. Decap's docs walk through creating an OAuth app and a small free auth handler. Until then, you can publish posts by adding Markdown files in `src/content/guides/` (via GitHub's web editor — click **Add file → Create new file**), which is genuinely quick.

---

## Run it on your own computer (optional)

If you ever want to preview locally, install [Node.js](https://nodejs.org), then in this folder:

```
npm install
npm run dev      # preview at http://localhost:4321
npm run build    # produce the final site in dist/
```

---

## Adding a blog post (the traffic engine)

1. Copy any file in `src/content/guides/` and rename it — the filename becomes the URL (e.g. `selling-a-condo-in-milwaukee.md` → `/guides/selling-a-condo-in-milwaukee/`).
2. Edit the info at the top (title, description, category, date) and write the post below it in Markdown.
3. Save, push to GitHub, and it's live in about a minute.

Keep URLs stable — if you ever migrate to WordPress later, matching these URLs (or redirecting them) preserves your Google rankings.
