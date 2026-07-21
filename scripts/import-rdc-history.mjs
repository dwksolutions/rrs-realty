// Builds src/data/market-history.csv from Realtor.com's ZIP history file.
//
// Usage:
//   node scripts/import-rdc-history.mjs                 (defaults to the path below)
//   node scripts/import-rdc-history.mjs "C:/path/to/RDC_..._Zip_History.csv"
//
// The monthly file realtor.com publishes holds ONE month, which is why
// import-rdc.mjs keeps dated snapshots. Their history file holds about ten
// years in one download (3.4M rows, ~800MB), so real trends do not have to be
// accumulated a month at a time. That file is far too big to read into memory,
// so this streams it line by line and keeps only the ZIPs our cities claim.
//
// Output is one row per city per month, aggregated exactly the way the current
// month is aggregated (see scripts/rdc-shared.mjs), so the last row of a city's
// history equals the figure on its page.
//
// zipCount is recorded per month on purpose. If the number of contributing ZIPs
// changes between months, a jump in the city median may be an artefact of
// coverage rather than the market moving, and nothing downstream can tell the
// difference without that column.

import { createReadStream, writeFileSync, mkdirSync } from 'fs';
import { createInterface } from 'readline';
import { cities } from '../src/data/cities.js';
import { parseLine, num, makeZipResolver, aggregate } from './rdc-shared.mjs';

const DEFAULT_SRC = `${process.env.USERPROFILE || process.env.HOME}/Downloads/RDC_Inventory_Core_Metrics_Zip_History.csv`;
const SRC = process.argv[2] || DEFAULT_SRC;

const resolve = makeZipResolver(cities);

// slug -> month -> array of ZIP rows
const data = new Map(cities.map((c) => [c.slug, new Map()]));

const rl = createInterface({ input: createReadStream(SRC, { encoding: 'utf8' }), crlfDelay: Infinity });

let C = null;
let seen = 0;
let kept = 0;

for await (const line of rl) {
  if (C === null) {
    const h = parseLine(line);
    const ci = (n) => h.indexOf(n);
    C = {
      month: ci('month_date_yyyymm'),
      zip: ci('postal_code'),
      name: ci('zip_name'),
      price: ci('median_listing_price'),
      priceYY: ci('median_listing_price_yy'),
      priceMM: ci('median_listing_price_mm'),
      ppsf: ci('median_listing_price_per_square_foot'),
      dom: ci('median_days_on_market'),
      active: ci('active_listing_count'),
    };
    continue;
  }
  if (!line) continue;
  seen++;

  // Cheap prefilter before the full CSV parse: the vast majority of these 3.4M
  // rows are other states, and parsing every one of them wastes minutes.
  if (!line.includes(', wi"')) {
    const zip = line.slice(line.indexOf(',') + 1, line.indexOf(',', line.indexOf(',') + 1));
    if (!resolve(zip, '')) continue;
  }

  const f = parseLine(line);
  const slug = resolve((f[C.zip] || '').trim(), f[C.name]);
  if (!slug) continue;
  kept++;

  const month = (f[C.month] || '').trim();
  const byMonth = data.get(slug);
  if (!byMonth.has(month)) byMonth.set(month, []);
  byMonth.get(month).push({
    zip: (f[C.zip] || '').trim(),
    price: num(f[C.price]),
    priceYY: num(f[C.priceYY]),
    priceMM: num(f[C.priceMM]),
    ppsf: num(f[C.ppsf]),
    dom: num(f[C.dom]),
    active: num(f[C.active]) || 0,
  });
}

const out = [
  '# Per-city monthly history, built by scripts/import-rdc-history.mjs from',
  '# Realtor.com\'s ZIP history file. One row per city per month.',
  '# Aggregated identically to the current month (scripts/rdc-shared.mjs).',
  '# zipCount is how many ZIPs reported that month; a change in it can move the',
  '# median for reasons that have nothing to do with the market.',
  '# Columns: slug,month,medianPrice,pricePerSqft,daysOnMarket,activeListings,zipCount',
  'slug,month,medianPrice,pricePerSqft,daysOnMarket,activeListings,zipCount',
];

let rows = 0;
const monthsPerCity = [];
for (const c of cities) {
  const byMonth = data.get(c.slug);
  const months = [...byMonth.keys()].sort();
  monthsPerCity.push({ name: c.name, months: months.length });
  for (const m of months) {
    const a = aggregate(byMonth.get(m));
    if (!a) continue;
    out.push([c.slug, m, a.medianPrice, a.pricePerSqft ?? '', a.daysOnMarket ?? '', a.activeListings, a.zipCount].join(','));
    rows++;
  }
}

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/market-history.csv', out.join('\n') + '\n');

console.log(`Scanned ${seen.toLocaleString()} rows, kept ${kept.toLocaleString()} for our cities.`);
console.log(`Wrote ${rows.toLocaleString()} city-months to src/data/market-history.csv`);
const short = monthsPerCity.filter((c) => c.months < 120).sort((a, b) => a.months - b.months);
if (short.length) {
  console.log(`\nCities with gaps (fewer than 120 months):`);
  for (const c of short) console.log(`  ${c.name.padEnd(18)} ${c.months} months`);
} else {
  console.log('\nAll cities have the full 120 months.');
}
