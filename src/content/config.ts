import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    hero: z.string().optional(),      // public path, e.g. /blog_images/Used/guide-....jpg
    heroAlt: z.string().optional(),   // descriptive alt text for the hero image
    author: z.string().default('RRS Realty Group'),   // visible byline + Article schema author
    updated: z.coerce.date().optional(),              // GENUINE last-updated date; set only on real content revisions
    reviewedBy: z.string().optional(),                // e.g. "a Wisconsin-licensed real estate agent" (only when true)
    sources: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    // Optional per-guide call to action; falls back to the generic matching CTA.
    cta: z
      .object({
        heading: z.string(),
        text: z.string(),
        label: z.string(),
        href: z.string().default('/get-started/'),
      })
      .optional(),
  }),
});

export const collections = { guides };
