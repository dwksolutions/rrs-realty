// Shared parsing and aggregation for the two Realtor.com importers.
//
// import-rdc.mjs (current month) and import-rdc-history.mjs (10 year archive)
// MUST combine ZIPs the same way. If they drifted, the latest month on a city
// page would not line up with the last point of that city's own history, and
// the mismatch would be invisible until someone noticed a chart that did not
// meet its own headline figure.

export function parseLine(line) {
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

export const num = (v) => (v !== '' && v != null && !isNaN(parseFloat(v)) ? parseFloat(v) : null);

// Median of ZIP-level medians, weighted by how many listings each ZIP holds, so
// a 4-listing ZIP cannot drag a 400-listing city around.
export function weightedMedian(pairs) {
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

export function weightedMean(pairs) {
  const rows = pairs.filter((p) => p.value != null && p.weight > 0);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.weight, 0);
  return rows.reduce((s, r) => s + r.value * r.weight, 0) / total;
}

/**
 * Which city page a ZIP belongs to, or null. A ZIP a city names explicitly in
 * cities.js belongs to that city; otherwise it falls to its USPS zip_name city.
 * Exactly one owner per ZIP, so listings are never counted on two pages.
 */
export function makeZipResolver(cities) {
  const byZip = new Map(cities.map((c) => [c.zip, c.slug]));
  const byName = new Map(cities.map((c) => [`${c.name.toLowerCase()}, wi`, c.slug]));
  return (zip, zipName) => byZip.get(zip) || byName.get((zipName || '').trim().toLowerCase()) || null;
}

/** Combine one city's ZIP rows for a single month into one set of figures. */
export function aggregate(rows) {
  const usable = rows.filter((r) => r.price != null);
  if (!usable.length) return null;
  const w = (key) => usable.map((r) => ({ value: r[key], weight: r.active }));
  return {
    medianPrice: weightedMedian(w('price')),
    pricePerSqft: weightedMedian(w('ppsf')),
    daysOnMarket: weightedMedian(w('dom')),
    activeListings: usable.reduce((s, r) => s + r.active, 0),
    priceYoY: weightedMean(w('priceYY')),
    priceMoM: weightedMean(w('priceMM')),
    zipCount: usable.length,
    zips: usable.slice().sort((a, b) => b.active - a.active).map((r) => r.zip),
  };
}
