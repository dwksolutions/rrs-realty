// Per-city monthly history for the /home-values/ pages.
//
// Source is src/data/market-history.csv, built by scripts/import-rdc-history.mjs
// from Realtor.com's ten-year archive. One row per city per month, aggregated
// by the same maths as the current month, so the last point of a city's series
// equals the figure in its stat tiles.

import csvText from '../data/market-history.csv?raw';

function loadRows() {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const header = lines.shift().split(',').map((h) => h.trim());
  const idx = (n) => header.indexOf(n);
  const map = {};
  for (const line of lines) {
    const c = line.split(',');
    const slug = (c[idx('slug')] || '').trim();
    if (!slug) continue;
    const price = Number(c[idx('medianPrice')]);
    if (!price || isNaN(price)) continue;
    (map[slug] ||= []).push({
      month: (c[idx('month')] || '').trim(),
      price,
      activeListings: Number(c[idx('activeListings')]) || 0,
      zipCount: Number(c[idx('zipCount')]) || 0,
    });
  }
  for (const k of Object.keys(map)) map[k].sort((a, b) => a.month.localeCompare(b.month));
  return map;
}

const ROWS = loadRows();

// "202606" -> "June 2026"
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function monthLabel(yyyymm, short = false) {
  const y = yyyymm.slice(0, 4);
  const m = Number(yyyymm.slice(4)) - 1;
  const name = MONTHS[m] || '';
  return `${short ? name.slice(0, 3) : name} ${y}`;
}

/**
 * The last `months` points for a city, newest last.
 *
 * Returns null when there is not enough history to draw anything meaningful.
 * `thinMonths` counts points drawn from fewer than 12 active listings: those
 * medians jump around for reasons that have nothing to do with the market, and
 * a line through them looks far more authoritative than it deserves, so the
 * page says how many there were.
 *
 * `coverageChanged` flags the series spanning a change in how many ZIPs
 * reported. When that happens a step in the line can be us measuring a
 * different area, not prices moving.
 */
export function getHistory(slug, months = 60) {
  const all = ROWS[slug];
  if (!all || all.length < 24) return null;

  const series = all.slice(-months);
  if (series.length < 24) return null;

  // When most months rest on a handful of listings, the line is noise, and a
  // drawn trend reads as far more authoritative than a column of numbers would.
  // Hales Corners had under 12 listings in 54 of its last 60 months. No chart.
  const thin = series.filter((p) => p.activeListings < 12).length;
  if (thin > series.length / 2) return null;

  const zipCounts = new Set(series.map((p) => p.zipCount));

  return {
    series,
    from: series[0].month,
    to: series[series.length - 1].month,
    min: Math.min(...series.map((p) => p.price)),
    max: Math.max(...series.map((p) => p.price)),
    thinMonths: thin,
    coverageChanged: zipCounts.size > 1,
  };
}
