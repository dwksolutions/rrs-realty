// Data-reliability notes for the /home-values/ city pages.
//
// The figures on those pages come from a SINGLE ZIP standing in for a whole
// city, and some ZIPs are a poor match for the city they are named after (ZIP
// 53209 on the Glendale page is largely Milwaukee's north side). On top of that,
// a few ZIPs carry only a handful of active listings, so the median swings on
// one new listing.
//
// We therefore do NOT generate comparative claims from this data: no ranking
// cities against each other, no "X% above the county median", no cross-market
// price-per-square-foot or days-on-market comparisons. A single unrepresentative
// ZIP makes all of those assert something false about the city on the page. The
// bare figures stay in the stat boxes where they read as one data point, and
// this module adds an honest note about how much weight to put on them.
//
// If per-city data ever covers the full city (all its ZIPs, ideally with closed
// sales), comparisons could be revisited. Not before.

// Below this many active listings the median is too jumpy to state plainly.
const VOLATILE = 12;
// Below this it is usable but deserves an explicit hedge.
const MODEST = 30;

/**
 * True when the sample is so small that derived figures are mostly noise.
 * Year-over-year is the worst offender: a 4-listing ZIP produced "+56.2%",
 * which is a headline number describing nothing. Callers hide such figures
 * rather than print them next to a disclaimer nobody reads.
 */
export function isVolatileSample(stats) {
  if (stats.isEstimate) return true;
  return (stats.activeListings || 0) < VOLATILE;
}

/**
 * An optional sentence about how reliable this city's figures are.
 * Returns null when the sample is healthy enough to need no qualifier.
 */
export function getSampleCaveat(city, stats) {
  if (stats.isEstimate || !stats.medianPrice) return null;

  const n = stats.activeListings || 0;
  const zips = stats.zips || [city.zip];
  const where = zips.length === 1 ? `ZIP ${zips[0]}` : `the ${zips.length} ZIP codes we cover for ${city.name}`;

  if (n < VOLATILE) {
    return (
      `Only ${n} ${n === 1 ? 'home is' : 'homes are'} listed in ${where} right now, so this median can swing ` +
      `sharply on a single new listing. Treat it as a rough indicator rather than a firm read on ${city.name} values, ` +
      `and ask a local agent what is actually selling.`
    );
  }

  if (n < MODEST) {
    return (
      `These figures come from ${n} active listings in ${where}, a modest sample, so read them as a general ` +
      `direction rather than a precise value.`
    );
  }

  return null;
}
