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
// A month-over-month swing this large says the mix of listed homes changed.
const BIG_SWING = 0.2;

/**
 * True when the sample is so small that derived figures are mostly noise.
 * Year-over-year is the worst offender: a 4-listing ZIP produced "+56.2%",
 * which is a headline number describing nothing. Callers hide such figures
 * rather than print them next to a disclaimer nobody reads.
 */
export function isVolatileSample(stats) {
  if (!stats) return true;
  return (stats.activeListings || 0) < VOLATILE;
}

/**
 * Sentences about how much weight to put on this city's figures. Returns an
 * array because a page can need more than one: a thin sample and a big monthly
 * swing are different warnings and a market can have both.
 */
export function getCaveats(city, stats) {
  if (!stats || !stats.medianPrice) return [];

  const out = [];
  const n = stats.activeListings || 0;
  const zips = stats.zips || [city.zip];
  const where = zips.length === 1 ? `ZIP ${zips[0]}` : `the ${zips.length} ZIP codes we cover for ${city.name}`;

  if (n < VOLATILE) {
    out.push(
      `Only ${n} ${n === 1 ? 'home is' : 'homes are'} listed in ${where} right now, so this median can swing ` +
        `sharply on a single new listing. Treat it as a rough indicator rather than a firm read on ${city.name} values, ` +
        `and ask a local agent what is actually selling.`
    );
  } else if (n < MODEST) {
    out.push(
      `These figures come from ${n} active listings in ${where}, a modest sample, so read them as a general ` +
        `direction rather than a precise value.`
    );
  }

  // Sample size alone misses this. Delafield carried 41 listings, comfortably
  // past every threshold above, while its median jumped 64% in one month
  // because larger lake-country homes came on the market. The figure is
  // correct and reads as wrong, so the page explains what moved.
  const mom = stats.priceMoM;
  if (mom != null && Math.abs(mom) >= BIG_SWING) {
    const pct = Math.round(Math.abs(mom) * 100);
    out.push(
      `What is listed right now in ${city.name} is asking about ${pct}% ${mom > 0 ? 'more' : 'less'} than last ` +
        `month, because the mix of homes for sale changed rather than because houses changed in value that fast. ` +
        `The headline above is a 12-month median for exactly this reason.`
    );
  }

  return out;
}
