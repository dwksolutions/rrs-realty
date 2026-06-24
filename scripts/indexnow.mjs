// Submit all live URLs to IndexNow (Bing, Yandex, Seznam, etc.). NOT Google.
// Run AFTER a deploy so the key file is live: node scripts/indexnow.mjs
// (reads the freshly built dist/sitemap-0.xml for the URL list).

import { readFileSync } from 'fs';

const KEY = '8c4e1f9a2b6d7350e1a9c4f8b203d67e';
const HOST = 'rrsrealtygroup.com';

const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: ${res.status} ${res.statusText} (${urlList.length} URLs submitted)`);
