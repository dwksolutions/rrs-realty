// Market data for the /home-values/ pages.
//
// If a RentCast API key is present at build time (env var RENTCAST_API_KEY),
// we fetch live ZIP-level sale stats. Otherwise we return clearly-labeled
// sample figures so the pages still build and look complete.
//
// To go live: create a free key at https://www.rentcast.io, then add
// RENTCAST_API_KEY in Vercel (Project Settings -> Environment Variables) and redeploy.

const RENTCAST_ENDPOINT = 'https://api.rentcast.io/v1/markets';

export function fmtPrice(n) {
  if (n == null || isNaN(n)) return 'N/A';
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function fmtNum(n) {
  if (n == null || isNaN(n)) return 'N/A';
  return Math.round(n).toLocaleString('en-US');
}

function sampleStats(city) {
  const base = city.samplePrice || 300000;
  // Derive stable, plausible figures from the ZIP so each city differs run-to-run.
  const seed = parseInt(String(city.zip).slice(-2), 10) || 25;
  const pricePerSqft = Math.round(base / (1500 + (seed % 10) * 45));
  const daysOnMarket = 18 + (seed % 28);
  const activeListings = 28 + (seed % 70);
  return {
    medianPrice: base,
    pricePerSqft,
    daysOnMarket,
    activeListings,
    updated: new Date(),
    isSample: true,
  };
}

export async function getMarketStats(city) {
  const apiKey =
    (typeof process !== 'undefined' && process.env && process.env.RENTCAST_API_KEY) ||
    (import.meta && import.meta.env && import.meta.env.RENTCAST_API_KEY);

  if (!apiKey) return sampleStats(city);

  try {
    const url = `${RENTCAST_ENDPOINT}?zipCode=${encodeURIComponent(city.zip)}&dataType=Sale`;
    const res = await fetch(url, {
      headers: { 'X-Api-Key': apiKey, accept: 'application/json' },
    });
    if (!res.ok) throw new Error('RentCast responded ' + res.status);
    const data = await res.json();
    const s = data.saleData || data;

    const medianPrice = s.medianPrice ?? s.averagePrice;
    if (medianPrice == null) throw new Error('no price field in response');

    return {
      medianPrice,
      pricePerSqft: s.medianPricePerSquareFoot ?? s.averagePricePerSquareFoot ?? null,
      daysOnMarket: s.medianDaysOnMarket ?? s.averageDaysOnMarket ?? null,
      activeListings: s.totalListings ?? s.newListings ?? null,
      updated: new Date(),
      isSample: false,
    };
  } catch (e) {
    console.warn(`[marketData] RentCast fetch failed for ${city.name} (${city.zip}): ${e.message}. Falling back to sample data.`);
    return sampleStats(city);
  }
}
