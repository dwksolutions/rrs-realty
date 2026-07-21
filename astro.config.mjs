import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { lastmodFor } from './scripts/lastmod.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://rrsrealtygroup.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/hq') && !page.includes('/thank-you'),
      // Real per-page dates, not build time. See scripts/lastmod.mjs.
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url).toISOString() }),
    }),
  ],
});
