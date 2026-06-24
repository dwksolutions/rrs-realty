// Market data for the /home-values/ pages.
//
// Numbers come from src/data/market-data.csv, a simple file you maintain by hand.
// Every so often, look up each city on Redfin, Zillow, or Realtor.com and paste
// the latest figures into that CSV, then deploy. No API key, no live calls.
//
// If a city in cities.js has no row in the CSV yet, we show a rough estimate
// (flagged isEstimate) so the page still looks complete.

// Vite inlines the CSV contents as a string at build time.
import csvText from '../data/market-data.csv?raw';

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}

function loadRows() {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const header = lines.shift().split(',').map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const map = {};
  for (const line of lines) {
    const cells = line.split(',');
    const slug = (cells[idx('slug')] || '').trim();
    if (!slug) continue;
    map[slug] = {
      medianPrice: num(cells[idx('medianPrice')]),
      pricePerSqft: num(cells[idx('pricePerSqft')]),
      daysOnMarket: num(cells[idx('daysOnMarket')]),
      activeListings: num(cells[idx('activeListings')]),
      updated: (cells[idx('updated')] || '').trim(),
    };
  }
  return map;
}

const ROWS = loadRows();

function parseMonth(s) {
  const m = /^(\d{4})-(\d{1,2})/.exec(s || '');
  if (!m) return new Date();
  return new Date(Number(m[1]), Number(m[2]) - 1, 1);
}

function estimate(city) {
  const base = city.samplePrice || 300000;
  const seed = parseInt(String(city.zip).slice(-2), 10) || 25;
  return {
    medianPrice: base,
    pricePerSqft: Math.round(base / (1500 + (seed % 10) * 45)),
    daysOnMarket: 18 + (seed % 28),
    activeListings: 28 + (seed % 70),
    updated: new Date(),
    isEstimate: true,
  };
}

export function fmtPrice(n) {
  if (n == null || isNaN(n)) return 'N/A';
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function fmtNum(n) {
  if (n == null || isNaN(n)) return 'N/A';
  return Math.round(n).toLocaleString('en-US');
}

export function getMarketStats(city) {
  const row = ROWS[city.slug];
  if (!row || row.medianPrice == null) return estimate(city);
  return {
    medianPrice: row.medianPrice,
    pricePerSqft: row.pricePerSqft,
    daysOnMarket: row.daysOnMarket,
    activeListings: row.activeListings,
    updated: parseMonth(row.updated),
    isEstimate: false,
  };
}
