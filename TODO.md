# RRS Realty Group, To-Do

Missing features and pages, ranked by impact. Check off as completed.
"(needs input)" means it requires something from the owner before it can be built.

## High impact (conversion and business model)
- [ ] Phone number + click-to-call across header, footer, and form (needs input: the number)
- [ ] Testimonials / reviews / social-proof section (needs input: real quotes)
- [ ] Branded "Thank You" page after form submit (set Formspree redirect to it)
- [ ] Agent recruitment page + form ("Are you an agent? Join our network") (needs input: do you recruit publicly?)

## Content and SEO (the traffic engine)
- [ ] Dedicated Sellers page (/sell/) and Buyers page (/buy/)
- [ ] More local guides (only 4 exist; aim for 10-15 targeted ones)
- [ ] FAQ page with FAQ structured data
- [ ] Real Contact page (/contact/) with email, phone, hours, service area

## Admin and operations
- [x] Control Room dashboard hub at /hq/ (private, noindex)
- [x] Move CMS off /admin to /studio (bot avoidance)
- [x] Security headers (vercel.json)
- [ ] Finish blog editor login: GitHub OAuth so /studio/ can publish (needs input: create GitHub OAuth app)

## Technical and measurement
- [~] Analytics: GA4 scaffolded + consent-gated; paste Measurement ID into GA_ID in src/layouts/Layout.astro to activate (needs input: G-XXXX id)
- [ ] Conversion tracking (event on form submit, after GA4 is live)
- [ ] Google Search Console: verify domain + submit sitemap (needs input: verification)
- [ ] Custom 404 page (on-brand, links back)
- [ ] Formspree auto-reply to submitters ("a real person will reach out")

## Trust and polish
- [ ] Founder/team bios on About (currently generic)
- [ ] Social media links in footer (needs input: accounts)
- [ ] Real business address if applicable (needs input)
- [ ] Accessibility statement

## Pre-launch checklist (carryover)
- [ ] Verify the Formspree recipient email (rrsrealtygroup@gmail.com) or leads will not deliver
- [ ] Test a real form submission end to end
