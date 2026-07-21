// Imports Realtor.com "RDC Inventory Core Metrics by ZIP" into src/data/market-data.csv.
//
// Usage:
//   node scripts/import-rdc.mjs                 (defaults to the path below)
//   node scripts/import-rdc.mjs "C:/path/to/RDC_Inventory_Core_Metrics_Zip.csv"
//
// To refresh figures: download a fresh file from realtor.com/research/data,
// run this script, then deploy.
//
// WHY THIS AGGREGATES ZIPS
// ------------------------
// Each city used to be represented by ONE hand-picked ZIP, which badly
// misdescribed the bigger cities: ZIP 53202 is downtown Milwaukee and holds
// about 10% of the city's listings, so a page titled "Milwaukee Home Values"
// was really showing downtown condo asking prices.
//
// The source file carries a `zip_name` column (the USPS postal city), so every
// ZIP in a city can roll up into one figure. Two rules keep that honest:
//
//   1. A ZIP belongs to exactly ONE city page. If cities.js names a ZIP
//      explicitly, that city claims it; otherwise it falls to its zip_name
//      city. Without this Milwaukee would absorb the ZIPs already shown on the
//      Wauwatosa, Glendale, and West Allis pages, and the same listings would
//      be counted on several pages at once.
//   2. Medians combine weighted by active listing count, so a 4-listing ZIP
//      cannot drag a 400-listing city around. A weighted median of ZIP medians
//      is still an approximation of a true citywide median, which is why the
//      pages state which ZIPs they cover rather than implying full coverage.
//
// USPS postal areas are not municipal boundaries. The page lists the ZIPs it
// covers so the reader can see the actual scope.

import { cities } from '../src/data/cities.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
// Shared with import-rdc-history.mjs so the newest month and the archive are
// combined by identical maths. See the note at the top of rdc-shared.mjs.
import { parseLine, num, makeZipResolver, aggregate } from './rdc-shared.mjs';

const DEFAULT_SRC = `${process.env.USERPROFILE || process.env.HOME}/Downloads/RDC_Inventory_Core_Metrics_Zip.csv`;
const SRC = process.argv[2] || DEFAULT_SRC;

const text = readFileSync(SRC, 'utf8');
const lines = text.split(/\r?\n/).filter((l) => l.length);
const header = parseLine(lines[0]);
const ci = (name) => header.indexOf(name);
const C = {
  zip: ci('postal_code'),
  name: ci('zip_name'),
  price: ci('median_listing_price'),
  priceYY: ci('median_listing_price_yy'),
  priceMM: ci('median_listing_price_mm'),
  ppsf: ci('median_listing_price_per_square_foot'),
  dom: ci('median_days_on_market'),
  active: ci('active_listing_count'),
  month: ci('month_date_yyyymm'),
};

// Newest month only. The published file holds a single month, but guard anyway.
let latestMonth = '';
for (let i = 1; i < lines.length; i++) {
  const m = (parseLine(lines[i])[C.month] || '').trim();
  if (m > latestMonth) latestMonth = m;
}

const rowsByZip = new Map();
for (let i = 1; i < lines.length; i++) {
  const f = parseLine(lines[i]);
  if ((f[C.month] || '').trim() !== latestMonth) continue;
  const zip = (f[C.zip] || '').trim();
  if (!zip) continue;
  rowsByZip.set(zip, {
    zip,
    name: (f[C.name] || '').trim().toLowerCase(),
    price: num(f[C.price]),
    priceYY: num(f[C.priceYY]),
    priceMM: num(f[C.priceMM]),
    ppsf: num(f[C.ppsf]),
    dom: num(f[C.dom]),
    active: num(f[C.active]) || 0,
  });
}

// Rule 1: every ZIP lands on exactly one city page.
const resolve = makeZipResolver(cities);
const zipsFor = new Map(cities.map((c) => [c.slug, []]));
for (const row of rowsByZip.values()) {
  const slug = resolve(row.zip, row.name);
  if (slug) zipsFor.get(slug).push(row);
}

const out = [
  '# RRS market data, imported from Realtor.com Inventory Core Metrics (by ZIP).',
  '# Figures are median LISTING (asking) prices and active-listing metrics.',
  '# Each city aggregates every ZIP assigned to it (see scripts/import-rdc.mjs).',
  '# Medians across ZIPs are weighted by active listing count. zips is space separated.',
  '# priceMoM is month over month: a large swing means the MIX of listed homes',
  '# changed, not that values moved that fast. The pages say so when it is big.',
  '# Columns: slug,medianPrice,pricePerSqft,daysOnMarket,activeListings,priceYoY,priceMoM,zips,updated',
  '# To refresh: download a new RDC file and run: node scripts/import-rdc.mjs <path>',
  'slug,medianPrice,pricePerSqft,daysOnMarket,activeListings,priceYoY,priceMoM,zips,updated',
];

const updated = latestMonth.length === 6 ? `${latestMonth.slice(0, 4)}-${latestMonth.slice(4)}` : '';
const missing = [];
const report = [];

for (const c of cities) {
  // aggregate() also sorts the ZIP list biggest first, so the page leads with
  // the most representative one.
  const a = aggregate(zipsFor.get(c.slug));
  if (!a) { missing.push(`${c.name} (${c.zip})`); continue; }

  out.push(
    [
      c.slug, a.medianPrice, a.pricePerSqft ?? '', a.daysOnMarket ?? '', a.activeListings,
      a.priceYoY == null ? '' : a.priceYoY.toFixed(4),
      a.priceMoM == null ? '' : a.priceMoM.toFixed(4),
      a.zips.join(' '), updated,
    ].join(',')
  );
  report.push({ name: c.name, zips: a.zipCount, active: a.activeListings });
}

writeFileSync('src/data/market-data.csv', out.join('\n') + '\n');

// Keep a dated copy so future imports can show real trends over time. The
// published file only ever holds one month, so history has to accumulate here.
try {
  mkdirSync('src/data/history', { recursive: true });
  writeFileSync(`src/data/history/market-data-${updated || 'unknown'}.csv`, out.join('\n') + '\n');
} catch (e) {
  console.warn('Could not write history snapshot:', e.message);
}

console.log(`Imported ${report.length} of ${cities.length} cities for ${updated}.`);
console.log(`Snapshot saved to src/data/history/market-data-${updated}.csv`);

const multi = report.filter((r) => r.zips > 1).sort((a, b) => b.zips - a.zips);
if (multi.length) {
  console.log(`\nAggregated across multiple ZIPs (${multi.length} cities):`);
  for (const r of multi) console.log(`  ${r.name.padEnd(18)} ${String(r.zips).padStart(3)} ZIPs  ${String(r.active).padStart(5)} listings`);
}
const thin = report.filter((r) => r.active < 30).sort((a, b) => a.active - b.active);
if (thin.length) {
  console.log(`\nStill thin (under 30 listings), pages will flag these:`);
  for (const r of thin) console.log(`  ${r.name.padEnd(18)} ${String(r.active).padStart(5)} listings`);
}
if (missing.length) console.log('\nNo ZIP match (estimate fallback used):', missing.join('; '));
