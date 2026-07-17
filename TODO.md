# RRS Realty Group, To-Do

Missing features and pages, ranked by impact. Check off as completed.
"(needs input)" means it requires something from the owner before it can be built.
"(needs attorney)" means a Wisconsin real-estate lawyer should review it before it ships.

Last external site review: 2026-07-17, overall 6.5/10. Weakest areas flagged:
Trust and credibility 4/10, Market-data quality 4/10, Legal and disclosure 4/10,
Content depth 5/10. Strong: positioning 8/10, visual design 8/10, local-SEO foundation 7/10.

## Legal and disclosure (highest priority: do before scaling traffic)
- [ ] Have a Wisconsin real-estate attorney review the referral/licensing structure (needs attorney):
      whether RRS or its operating entity needs a WI real-estate license; who legally earns and receives
      referral compensation; whether compensation must be disclosed before submission/matching; agreements
      with participating brokers/agents; use of "Realty Group" in advertising; call/text/prerecorded-message
      (TCPA) consent; privacy, data-sharing and record retention; fair-housing agent-selection criteria.
- [ ] After counsel approves, remove the "this template is provided for convenience" language from the live
      Terms, Privacy, and Cookie pages (leaving it visible implies the governing docs are not final).
- [~] Clarify buyer compensation everywhere: "no charge from RRS to be matched; services and compensation
      with your chosen agent are set out in your written buyer agreement before you tour homes." Done on
      /buy/; carry the same framing anywhere else "free" appears.

## Trust and credibility (biggest marketing weakness, 4/10)
- [ ] Founder/team section on About: real names, photos, short bios (needs input). Use REAL photos here,
      not AI images (AI photos are fine for blog illustrations only).
- [ ] "How we vet agents" detailed section: what the review actually checks (local closings, disciplinary
      history, communication standards, reviews, transaction type, price range, response speed, interview).
- [ ] Genuine testimonials / case studies with permission (needs input: real quotes).
- [ ] Business phone number, hours, and a specific response-time promise (needs input).
- [ ] Domain-based email (e.g. hello@rrsrealtygroup.com) instead of the Gmail address (needs input/setup).
- [ ] Legal business name and mailing address (needs input).
- [ ] Approximate size of the partner-agent network, once supportable (needs input).
- [ ] Agent license-verification links (WI DSPS lookup) so buyers can independently verify.
- [ ] Explain what happens when a suggested agent is not a good fit (option to request a different match).

## Conversion and UX
- [x] Adaptive lead form: labels switch with the buy/sell toggle; added a Preferred Contact field and
      autocomplete on name/tel/email/postal-code.
- [ ] Phone number + click-to-call across header, footer, and form (needs input: the number).
- [ ] Branded "Thank You" page after form submit (set Formspree redirect to it), explaining next steps.
- [ ] Alternative conversion paths: "Schedule a 10-minute call" and a shorter "Ask a question" form.
- [ ] Replace vague "quickly" with a real response time ("within one business hour" / "by the next
      business morning"), only if operations can consistently meet it (needs input).
- [ ] Consider a two-step form (step 1: buying/selling + area + timeline, step 2: contact details).
- [ ] Reduce repeated copy ("a real person, not a queue", "no anonymous lead pool", "no random handoff");
      replace some with proof: the vetting process, a client story, a sample agent-match explanation, and a
      what-happens-next timeline.

## Content and SEO (the traffic engine)
- [x] Dedicated Sellers (/sell/) and Buyers (/buy/) pages, linked in header + footer, each with lead form + FAQ.
- [x] FAQ structured data (FAQPage JSON-LD) on How It Works, /sell/, and /buy/.
- [x] Guide E-E-A-T template: named-author byline (Person in schema), optional reviewed-by, genuine
      last-updated date, cited Sources section, per-guide CTA, auto "Keep Reading" internal links, and
      BlogPosting/Article structured data with author + image + dates.
- [x] Blog hero images (16:9, optimized to ~150KB, width/height set, descriptive alt text).
- [ ] Buyer cornerstone guides (current guides are seller/agent focused). Write in order: First-Time WI Buyer
      Guide; How Much Cash to Buy a House in WI; Buyer Agency Agreements & Agent Compensation (needs attorney);
      WI Home Inspection Checklist; Competitive Offers in the Milwaukee Area; Appraisal vs Inspection.
- [ ] Fill the new template fields on the existing 4 guides: author bios, sources/citations, and 2-3
      contextual links each to relevant city market pages + the buy/sell pages.
- [ ] More local guides overall (aim 10-15 targeted). Add a table of contents on long guides and downloadable
      checklists where useful.
- [ ] Enrich priority city pages beyond the shared template so they are not thin/doorway pages: local housing
      stock, common property ages/styles, ZIP vs citywide figures, typical local inspection concerns, municipal
      resource links, original local-agent commentary, and buyer/seller considerations. Do NOT create separate
      "best agent in [city]" pages with identical text.
- [ ] Keep any school/neighborhood content neutral and third-party sourced (fair housing: no steering language).
- [ ] Real Contact page (/contact/) with email, phone, hours, service area.
- [ ] Custom 404 page (on-brand, links back).
- [ ] In Search Console: submit sitemap (sitemap-index.xml) and Request Indexing for top pages.

## Market-data quality (4/10)
- [x] State ZIP scope and "listing figures, not closed sales" on city market pages; breadcrumb label to Market Data.
- [ ] Aggregate all relevant ZIPs for larger cities (Milwaukee, Kenosha, Racine, Waukesha), or retitle those
      pages to the specific ZIP (e.g. "Milwaukee 53202 Housing Market").
- [ ] Add closed-sale data where legally and contractually available.
- [ ] Publish a methodology page: source, geography, refresh date, calculations, and limitations.
- [ ] Add 12-month trends, not only a single current snapshot.
- [ ] Confirm the Realtor.com source agreement permits republication.
- [ ] Establish a reliable monthly data-refresh process (data currently marked May 2026).

## Technical, measurement, accessibility
- [x] Autocomplete attributes on the lead form (name, tel, email, postal-code).
- [x] Google Search Console: domain verified.
- [x] Sitemap live at /sitemap-index.xml (/hq excluded).
- [x] IndexNow set up for Bing/Yandex (npm run indexnow after each deploy).
- [~] Analytics: GA4 scaffolded + consent-gated; paste Measurement ID into GA_ID in src/layouts/Layout.astro
      to activate (needs input: G-XXXX id).
- [ ] Conversion tracking events (form starts, step completion, submissions, phone clicks, scheduled calls,
      agent introductions, closed transactions) once GA4 is live.
- [ ] Test Core Web Vitals on home, forms, guides, and city templates (targets: LCP under 2.5s, INP 200ms or
      less, CLS 0.1 or less).
- [ ] Formal accessibility testing: keyboard nav + visible focus, mobile menu, form labels + error
      announcements, contrast on blue backgrounds, text resizing, tap-target sizes, whether the buy/sell toggle
      is announced to screen readers, and keyboard-accessible cookie controls.
- [ ] Accessibility statement page.

## Admin and operations
- [x] Control Room hub at /hq/ (private, noindex); CMS moved to /studio; security headers; /hq password gate.
- [ ] Set /hq login: add HQ_USER and HQ_PASS env vars in Vercel (Production), then redeploy. Until then /hq
      returns 401 for everyone.
- [ ] Optional: extend the password gate to /studio.
- [ ] Finish blog editor login: GitHub OAuth so /studio/ can publish (needs input: create GitHub OAuth app).
- [ ] Agent recruitment page + form ("Are you an agent? Join our network") (needs input: do you recruit publicly?).
- [ ] Social media links in footer (needs input: accounts).
- [ ] Google Business Profile (biggest local-SEO + indexing-trust lever). Create at business.google.com as a
      service-area business covering the 8 Southeast Wisconsin counties; add phone + hours once available,
      description, logo and photos, then verify (needs input: phone, hours, possibly an address).
- [ ] Formspree auto-reply to submitters ("a real person will reach out").

## Pre-launch checklist (carryover)
- [ ] Verify the Formspree recipient email (rrsrealtygroup@gmail.com) or leads will not deliver.
- [ ] Test a real form submission end to end.
