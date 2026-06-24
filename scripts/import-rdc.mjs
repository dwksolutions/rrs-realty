// Imports Realtor.com "RDC Inventory Core Metrics by ZIP" into src/data/market-data.csv.
//
// Usage:
//   node scripts/import-rdc.mjs                 (defaults to the path below)
//   node scripts/import-rdc.mjs "C:/path/to/RDC_Inventory_Core_Metrics_Zip.csv"
//
// To refresh figures: download a fresh file from realtor.com/research/data,
// run this script, then deploy.

import { cities } from '../src/data/cities.js';
import { readFileSync, writeFileSync } from 'fs';

const DEFAULT_SRC = `${process.env.USERPROFILE || process.env.HOME}/Downloads/RDC_Inventory_Core_Metrics_Zip.csv`;
const SRC = process.argv[2] || DEFAULT_SRC;

function parseLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ',') { out.push(cur); cur = ''; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

const text = readFileSync(SRC, 'utf8');
const lines = text.split(/\r?\n/).filter((l) => l.length);
const header = parseLine(lines[0]);
const ci = (name) => header.indexOf(name);
const C = {
  zip: ci('postal_code'),
  price: ci('median_listing_price'),
  ppsf: ci('median_listing_price_per_square_foot'),
  dom: ci('median_days_on_market'),
  active: ci('active_listing_count'),
  month: ci('month_date_yyyymm'),
};

const byZip = {};
for (let i = 1; i < lines.length; i++) {
  const f = parseLine(lines[i]);
  const zip = (f[C.zip] || '').trim();
  if (zip) byZip[zip] = f;
}

const rnd = (v) => (v && !isNaN(parseFloat(v)) ? Math.round(parseFloat(v)) : '');

const rows = [
  '# RRS market data, imported from Realtor.com Inventory Core Metrics (by ZIP).',
  '# Figures are median LISTING (asking) prices and active-listing metrics, by ZIP.',
  '# Columns: slug,medianPrice,pricePerSqft,daysOnMarket,activeListings,updated(YYYY-MM)',
  '# To refresh: download a new RDC file and run: node scripts/import-rdc.mjs <path>',
  'slug,medianPrice,pricePerSqft,daysOnMarket,activeListings,updated',
];
const missing = [];
for (const c of cities) {
  const f = byZip[c.zip];
  if (!f || !f[C.price]) { missing.push(`${c.name} (${c.zip})`); continue; }
  const ym = (f[C.month] || '').trim();
  const updated = ym.length === 6 ? `${ym.slice(0, 4)}-${ym.slice(4)}` : '';
  rows.push(`${c.slug},${rnd(f[C.price])},${rnd(f[C.ppsf])},${rnd(f[C.dom])},${rnd(f[C.active])},${updated}`);
}
writeFileSync('src/data/market-data.csv', rows.join('\n') + '\n');
console.log(`Matched ${cities.length - missing.length} of ${cities.length} cities from ${SRC}`);
if (missing.length) console.log('No ZIP match (estimate fallback used):', missing.join('; '));
