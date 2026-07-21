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

const num = (v) => (v !== '' && v != null && !isNaN(parseFloat(v)) ? parseFloat(v) : null);

// Median of ZIP-level medians, weighted by how many listings each ZIP holds.
function weightedMedian(pairs) {
  const rows = pairs.filter((p) => p.value != null && p.weight > 0).sort((a, b) => a.value - b.value);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.weight, 0);
  let run = 0;
  for (const r of rows) {
    run += r.weight;
    if (run >= total / 2) return Math.round(r.value);
  }
  return Math.round(rows[rows.length - 1].value);
}

function weightedMean(pairs) {
  const rows = pairs.filter((p) => p.value != null && p.weight > 0);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.weight, 0);
  return rows.reduce((s, r) => s + r.value * r.weight, 0) / total;
}

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
const claimed = new Set(cities.map((c) => c.zip));
const zipsFor = new Map(cities.map((c) => [c.slug, []]));

for (const c of cities) {
  const own = rowsByZip.get(c.zip);
  if (own) zipsFor.get(c.slug).push(own);
}
for (const row of rowsByZip.values()) {
  if (claimed.has(row.zip)) continue;
  const match = cities.find((c) => row.name === `${c.name.toLowerCase()}, wi`);
  if (match) zipsFor.get(match.slug).push(row);
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
  const rows = zipsFor.get(c.slug).filter((r) => r.price != null);
  if (!rows.length) { missing.push(`${c.name} (${c.zip})`); continue; }

  const w = (key) => rows.map((r) => ({ value: r[key], weight: r.active }));
  const price = weightedMedian(w('price'));
  const ppsf = weightedMedian(w('ppsf'));
  const dom = weightedMedian(w('dom'));
  const active = rows.reduce((s, r) => s + r.active, 0);
  const yy = weightedMean(w('priceYY'));
  const mm = weightedMean(w('priceMM'));

  // Biggest ZIP first so the page leads with the most representative one.
  const zipList = rows.slice().sort((a, b) => b.active - a.active).map((r) => r.zip);

  out.push(
    [
      c.slug, price, ppsf ?? '', dom ?? '', active,
      yy == null ? '' : yy.toFixed(4),
      mm == null ? '' : mm.toFixed(4),
      zipList.join(' '), updated,
    ].join(',')
  );
  report.push({ name: c.name, zips: rows.length, active });
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
