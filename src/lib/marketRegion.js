// Region-wide figures for the homepage, aggregated across every market we track.
//
// The homepage used to assert its credibility ("Licensed Wisconsin agents",
// "Local, not a national call center"). These are the same claims made with
// numbers instead, and they refresh themselves on every data import.
//
// Two bases, on purpose, matching the city pages:
//   - Counts (listings on the market) are CURRENT. "How many homes are for sale"
//     only means anything as of now.
//   - Prices are a TRAILING 12-MONTH median, so one unusual month cannot set a
//     headline. Same reasoning as getTypical() in marketHistory.js.

import historyCsv from '../data/market-history.csv?raw';
import { cities } from '../data/cities.js';

function loadRows() {
  const lines = historyCsv.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const header = lines.shift().split(',').map((h) => h.trim());
  const idx = (n) => header.indexOf(n);
  const byMonth = new Map();
  for (const line of lines) {
    const c = line.split(',');
    const month = (c[idx('month')] || '').trim();
    const price = Number(c[idx('medianPrice')]);
    if (!month || !price) continue;
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month).push({
      price,
      dom: Number(c[idx('daysOnMarket')]) || null,
      active: Number(c[idx('activeListings')]) || 0,
    });
  }
  return byMonth;
}

const BY_MONTH = loadRows();
const MONTHS = [...BY_MONTH.keys()].sort();

const median = (arr) => {
  const s = arr.filter((n) => n != null && !isNaN(n)).sort((a, b) => a - b);
  if (!s.length) return null;
  const h = s.length / 2;
  return s.length % 2 ? s[Math.floor(h)] : Math.round((s[h - 1] + s[h]) / 2);
};

// Weighted by listing count so Milwaukee's 1,049 listings count for more than a
// suburb's 20. A plain median of city medians would let small markets dominate.
function weightedMedian(rows) {
  const s = rows.filter((r) => r.price && r.active > 0).sort((a, b) => a.price - b.price);
  if (!s.length) return null;
  const total = s.reduce((x, r) => x + r.active, 0);
  let run = 0;
  for (const r of s) { run += r.active; if (run >= total / 2) return r.price; }
  return s[s.length - 1].price;
}

const totalListings = (month) => (BY_MONTH.get(month) || []).reduce((s, r) => s + r.active, 0);
const windowPrice = (months) => median(months.map((m) => weightedMedian(BY_MONTH.get(m) || [])));
const windowListings = (months) => Math.round(months.reduce((s, m) => s + totalListings(m), 0) / months.length);

export function getRegionSnapshot() {
  const latest = MONTHS[MONTHS.length - 1];
  const trailing = MONTHS.slice(-12);
  return {
    activeListings: totalListings(latest),
    typicalPrice: windowPrice(trailing),
    daysOnMarket: median((BY_MONTH.get(latest) || []).map((r) => r.dom)),
    marketCount: (BY_MONTH.get(latest) || []).length,
    countyCount: new Set(cities.map((c) => c.county)).size,
    month: latest,
  };
}

/**
 * The decade, measured between two 12-month windows rather than two single
 * months. Comparing July 2016 with June 2026 directly reads +81% and -56%;
 * the windowed version reads +73% and -54%, and is the one that survives a
 * quiet month at either end.
 */
export function getRegionTrend() {
  if (MONTHS.length < 24) return null;
  const firstWindow = MONTHS.slice(0, 12);
  const lastWindow = MONTHS.slice(-12);
  const fromPrice = windowPrice(firstWindow);
  const toPrice = windowPrice(lastWindow);
  const fromListings = windowListings(firstWindow);
  const toListings = windowListings(lastWindow);
  return {
    fromYear: firstWindow[0].slice(0, 4),
    toYear: lastWindow[lastWindow.length - 1].slice(0, 4),
    fromPrice,
    toPrice,
    fromListings,
    toListings,
    priceChange: toPrice / fromPrice - 1,
    listingChange: toListings / fromListings - 1,
    years: Math.round(MONTHS.length / 12),
  };
}
