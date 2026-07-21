// SINGLE SOURCE OF TRUTH for service area + market data.
//
// HARD RULE: the Service Area page (/service-area/) and the Market Data pages
// (/home-values/) are BOTH generated from this list. To add or remove a city,
// edit ONLY this file. Do not hardcode cities anywhere else, or the two will drift.
//
// `marketPage: false` is the single exception and it means one thing: we serve
// this community, but its ZIP carries too little listing activity to publish a
// market page anyone should rely on. The city still shows in the service area.
// It is NOT a way to quietly stop covering somewhere. Use marketCities() for
// anything linking to /home-values/, and `cities` for describing where we work.
//
// ABOUT THE BLURBS: keep them to geography and civic description, things anyone
// can verify on a map or a municipal website. They previously carried claims we
// could not stand behind ("demand consistently outpaces supply", "top-rated
// schools", "some of the most affordable homes in the county"), which were
// nobody's measured findings. Two reasons they are gone and must not come back:
//   1. We do not have the data. Stating market dynamics we have not measured is
//      inventing facts, and these pages already carry real figures that do the
//      job honestly.
//   2. School quality and neighborhood desirability are steering language under
//      fair housing rules. A referral service has no business ranking
//      communities by who it implies should want to live in them.
// If a genuine, sourced local detail is worth adding later, cite the source.

export const cities = [
  // ---- Milwaukee County ----
  { slug: 'milwaukee', name: 'Milwaukee', county: 'Milwaukee County', zip: '53202', nearby: ['wauwatosa', 'west-allis', 'shorewood', 'oak-creek'], blurb: "Wisconsin's largest city, blending historic neighborhoods and lakefront living. Conditions vary widely from one neighborhood to the next, so a local read matters more here than almost anywhere." },
  { slug: 'wauwatosa', name: 'Wauwatosa', county: 'Milwaukee County', zip: '53213', nearby: ['milwaukee', 'west-allis', 'brookfield'], blurb: "Tosa pairs a walkable village center with quick access to downtown Milwaukee. Classic bungalows and Tudors are common here." },
  { slug: 'west-allis', name: 'West Allis', county: 'Milwaukee County', zip: '53214', nearby: ['milwaukee', 'wauwatosa', 'greenfield'], blurb: "A well-located suburb just southwest of Milwaukee, with established neighborhoods and a compact street layout." },
  { slug: 'greenfield', name: 'Greenfield', county: 'Milwaukee County', zip: '53220', nearby: ['west-allis', 'new-berlin', 'franklin'], blurb: "Centrally located with easy freeway access, Greenfield has a steady supply of ranch and split-level homes." },
  { slug: 'oak-creek', name: 'Oak Creek', county: 'Milwaukee County', zip: '53154', nearby: ['milwaukee', 'franklin', 'south-milwaukee'], blurb: "On the metro's south end near the lakefront and the airport, Oak Creek has added new construction and retail in recent years." },
  { slug: 'franklin', name: 'Franklin', county: 'Milwaukee County', zip: '53132', nearby: ['oak-creek', 'muskego', 'greenfield'], blurb: "Franklin sits on Milwaukee County's southern edge, with newer, larger homes and a lower-density, green layout." },
  { slug: 'shorewood', name: 'Shorewood', county: 'Milwaukee County', zip: '53211', nearby: ['milwaukee', 'whitefish-bay', 'glendale'], blurb: "A compact, walkable lakeside village just north of Milwaukee, with vintage homes and easy access to the lakefront." },
  { slug: 'whitefish-bay', name: 'Whitefish Bay', county: 'Milwaukee County', zip: '53217', nearby: ['shorewood', 'glendale', 'milwaukee'], blurb: "An established North Shore suburb known for its stately homes and tree-lined streets." },
  { slug: 'glendale', name: 'Glendale', county: 'Milwaukee County', zip: '53209', nearby: ['whitefish-bay', 'shorewood', 'milwaukee'], blurb: "A North Shore location with retail, parks, and a mix of mid-century and updated homes." },
  { slug: 'hales-corners', name: 'Hales Corners', county: 'Milwaukee County', zip: '53130', nearby: ['greenfield', 'franklin', 'muskego'], blurb: "A small village on the southwest edge of the county, with easy access to both Milwaukee and Waukesha County." },
  { slug: 'cudahy', name: 'Cudahy', county: 'Milwaukee County', zip: '53110', nearby: ['south-milwaukee', 'milwaukee', 'oak-creek'], blurb: "A lakeside south-suburban community within easy reach of downtown Milwaukee." },
  { slug: 'south-milwaukee', name: 'South Milwaukee', county: 'Milwaukee County', zip: '53172', nearby: ['cudahy', 'oak-creek', 'milwaukee'], blurb: "South Milwaukee has walkable neighborhoods and lakefront parks." },

  // ---- Waukesha County ----
  { slug: 'waukesha', name: 'Waukesha', county: 'Waukesha County', zip: '53188', nearby: ['new-berlin', 'pewaukee', 'brookfield'], blurb: "The county seat pairs a historic downtown with newer subdivisions." },
  { slug: 'brookfield', name: 'Brookfield', county: 'Waukesha County', zip: '53045', nearby: ['wauwatosa', 'new-berlin', 'pewaukee', 'elm-grove'], blurb: "Brookfield is known for larger lots and a large retail corridor along its eastern side." },
  { slug: 'new-berlin', name: 'New Berlin', county: 'Waukesha County', zip: '53151', nearby: ['brookfield', 'waukesha', 'muskego', 'greenfield'], blurb: "New Berlin sits between Milwaukee and Waukesha, with larger properties and a quieter, suburban feel." },
  { slug: 'menomonee-falls', name: 'Menomonee Falls', county: 'Waukesha County', zip: '53051', nearby: ['brookfield', 'germantown', 'hartland'], blurb: "A northwest suburb with a mix of established neighborhoods and new construction, and a significant employer presence." },
  { slug: 'pewaukee', name: 'Pewaukee', county: 'Waukesha County', zip: '53072', nearby: ['waukesha', 'brookfield', 'delafield'], blurb: "Anchored by Pewaukee Lake, with waterfront and near-water homes alongside newer subdivisions." },
  { slug: 'muskego', name: 'Muskego', county: 'Waukesha County', zip: '53150', nearby: ['new-berlin', 'franklin', 'mukwonago'], blurb: "Muskego has lake access, larger lots, and a semi-rural feel within reach of Milwaukee and Waukesha." },
  { slug: 'delafield', name: 'Delafield', county: 'Waukesha County', zip: '53018', nearby: ['hartland', 'pewaukee', 'waukesha'], blurb: "A Lake Country community with a compact downtown and several lakes." },
  { slug: 'hartland', name: 'Hartland', county: 'Waukesha County', zip: '53029', nearby: ['delafield', 'pewaukee', 'menomonee-falls'], blurb: "Part of Waukesha County's Lake Country, Hartland has a walkable village center and newer subdivisions." },
  { slug: 'elm-grove', name: 'Elm Grove', county: 'Waukesha County', zip: '53122', nearby: ['brookfield', 'wauwatosa', 'new-berlin'], blurb: "A small, leafy village bordering Brookfield, with established homes." },
  { slug: 'mukwonago', name: 'Mukwonago', county: 'Waukesha County', zip: '53149', nearby: ['muskego', 'waukesha', 'east-troy'], blurb: "On the county's rural southern edge, Mukwonago has lake access, larger parcels, and newer construction." },

  // ---- Ozaukee County ----
  { slug: 'mequon', name: 'Mequon', county: 'Ozaukee County', zip: '53092', nearby: ['cedarburg', 'grafton', 'whitefish-bay'], blurb: "Mequon is known for large wooded lots, lakefront properties, and acreage." },
  { slug: 'cedarburg', name: 'Cedarburg', county: 'Ozaukee County', zip: '53012', nearby: ['mequon', 'grafton', 'saukville'], blurb: "Known for its preserved historic downtown and small-town character." },
  { slug: 'grafton', name: 'Grafton', county: 'Ozaukee County', zip: '53024', nearby: ['cedarburg', 'mequon', 'port-washington'], blurb: "Grafton has a walkable downtown and a mix of established and newer neighborhoods." },
  { slug: 'port-washington', name: 'Port Washington', county: 'Ozaukee County', zip: '53074', nearby: ['grafton', 'saukville', 'cedarburg'], blurb: "A historic Lake Michigan harbor town with a lively downtown and a range of homes." },
  { slug: 'saukville', name: 'Saukville', county: 'Ozaukee County', zip: '53080', nearby: ['port-washington', 'grafton', 'cedarburg'], blurb: "A small village just inland from Port Washington, with easy access to the lakefront and I-43." },

  // ---- Washington County ----
  { slug: 'west-bend', name: 'West Bend', county: 'Washington County', zip: '53090', nearby: ['germantown', 'hartford', 'jackson'], blurb: "The Washington County seat, with a full-service downtown, parks, and a broad mix of housing." },
  { slug: 'germantown', name: 'Germantown', county: 'Washington County', zip: '53022', nearby: ['menomonee-falls', 'jackson', 'west-bend'], blurb: "Bordering Waukesha and Milwaukee counties, Germantown has newer subdivisions and convenient highway access." },
  { slug: 'hartford', name: 'Hartford', county: 'Washington County', zip: '53027', nearby: ['west-bend', 'slinger', 'jackson'], blurb: "A small city on the county's western side, with a historic downtown and newer neighborhoods." },
  { slug: 'jackson', name: 'Jackson', county: 'Washington County', zip: '53037', nearby: ['west-bend', 'germantown', 'slinger'], blurb: "Jackson pairs a village feel with newer construction and quick access to West Bend and the Milwaukee metro." },
  { slug: 'slinger', name: 'Slinger', county: 'Washington County', zip: '53086', nearby: ['hartford', 'jackson', 'west-bend'], blurb: "A village near the junction of US-41 and SR-60, with newer homes and an easy commute." },

  // ---- Racine County ----
  { slug: 'racine', name: 'Racine', county: 'Racine County', zip: '53403', nearby: ['mount-pleasant', 'caledonia', 'sturtevant'], blurb: "A Lake Michigan city with a walkable downtown and historic housing stock." },
  { slug: 'mount-pleasant', name: 'Mount Pleasant', county: 'Racine County', zip: '53406', nearby: ['racine', 'sturtevant', 'caledonia'], blurb: "Mount Pleasant has seen new development in recent years, with newer subdivisions in a suburban setting." },
  // No market page: ZIP 53108 held under 12 active listings in 107 of the 120
  // months from 2016-07 to 2026-06 (89%). A median drawn from that few listings
  // swings on a single new one, so there is no honest snapshot to publish. We
  // still serve Caledonia and it stays on the service area page.
  { slug: 'caledonia', name: 'Caledonia', county: 'Racine County', zip: '53108', marketPage: false, nearby: ['racine', 'mount-pleasant', 'oak-creek'], blurb: "Sitting between Racine and Milwaukee County, Caledonia has larger lots and a semi-rural feel." },
  { slug: 'burlington', name: 'Burlington', county: 'Racine County', zip: '53105', nearby: ['racine', 'east-troy', 'mount-pleasant'], blurb: "Known as Chocolate City, Burlington has a historic downtown and riverfront on the county's western side." },
  { slug: 'sturtevant', name: 'Sturtevant', county: 'Racine County', zip: '53177', nearby: ['mount-pleasant', 'racine', 'caledonia'], blurb: "A small village between Racine and the interstate, with a rail and highway location." },

  // ---- Kenosha County ----
  { slug: 'kenosha', name: 'Kenosha', county: 'Kenosha County', zip: '53142', nearby: ['pleasant-prairie', 'racine', 'mount-pleasant'], blurb: "On the Illinois border, Kenosha has lakefront character and a location convenient to northern Illinois." },
  { slug: 'pleasant-prairie', name: 'Pleasant Prairie', county: 'Kenosha County', zip: '53158', nearby: ['kenosha', 'racine', 'mount-pleasant'], blurb: "Pleasant Prairie pairs newer construction, parks, and retail with proximity to the Illinois line." },
  { slug: 'twin-lakes', name: 'Twin Lakes', county: 'Kenosha County', zip: '53181', nearby: ['kenosha', 'lake-geneva', 'pleasant-prairie'], blurb: "A western Kenosha County village built around its lakes, with year-round and seasonal homes." },

  // ---- Walworth County ----
  { slug: 'lake-geneva', name: 'Lake Geneva', county: 'Walworth County', zip: '53147', nearby: ['elkhorn', 'delavan', 'twin-lakes'], blurb: "A resort town on Geneva Lake, with waterfront and near-lake homes." },
  { slug: 'elkhorn', name: 'Elkhorn', county: 'Walworth County', zip: '53121', nearby: ['lake-geneva', 'delavan', 'whitewater'], blurb: "The Walworth County seat, with a classic small-city downtown, inland from the lake towns." },
  { slug: 'delavan', name: 'Delavan', county: 'Walworth County', zip: '53115', nearby: ['lake-geneva', 'elkhorn', 'whitewater'], blurb: "Built around Delavan Lake, mixing in-town homes with lakefront and recreational properties." },
  { slug: 'whitewater', name: 'Whitewater', county: 'Walworth County', zip: '53190', nearby: ['elkhorn', 'delavan', 'fort-atkinson'], blurb: "A university town on the Walworth and Jefferson county line." },
  { slug: 'east-troy', name: 'East Troy', county: 'Walworth County', zip: '53120', nearby: ['mukwonago', 'burlington', 'elkhorn'], blurb: "A village on the county's northern edge near the Kettle Moraine, with a rural feel and larger lots." },

  // ---- Jefferson County ----
  { slug: 'watertown', name: 'Watertown', county: 'Jefferson County', zip: '53094', nearby: ['lake-mills', 'jefferson', 'fort-atkinson'], blurb: "Straddling the Jefferson and Dodge county line, Watertown has historic homes and newer builds." },
  { slug: 'fort-atkinson', name: 'Fort Atkinson', county: 'Jefferson County', zip: '53538', nearby: ['jefferson', 'lake-mills', 'whitewater'], blurb: "A riverside city with a walkable downtown and small-city amenities." },
  { slug: 'jefferson', name: 'Jefferson', county: 'Jefferson County', zip: '53549', nearby: ['fort-atkinson', 'watertown', 'lake-mills'], blurb: "The county seat sits at the meeting of the Rock and Crawfish rivers, between the Madison and Milwaukee metros." },
  { slug: 'lake-mills', name: 'Lake Mills', county: 'Jefferson County', zip: '53551', nearby: ['jefferson', 'watertown', 'fort-atkinson'], blurb: "Built around Rock Lake and a town square, Lake Mills sits between Madison and Milwaukee." },
];

export function getCity(slug) {
  return cities.find((c) => c.slug === slug) || null;
}

// Cities that have a /home-values/ page. Anything that LINKS to a market page
// must use this, not `cities`, or it will link somewhere that does not exist.
export function marketCities() {
  return cities.filter((c) => c.marketPage !== false);
}

export function hasMarketPage(slug) {
  const c = getCity(slug);
  return !!c && c.marketPage !== false;
}

// Cities grouped by county, county names sorted, cities sorted within each.
// Pass marketCities() when the output will be turned into /home-values/ links.
export function citiesByCounty(list = cities) {
  const groups = {};
  for (const c of list) (groups[c.county] ||= []).push(c);
  for (const k of Object.keys(groups)) groups[k].sort((a, b) => a.name.localeCompare(b.name));
  return Object.keys(groups)
    .sort()
    .map((county) => ({ county, cities: groups[county] }));
}
