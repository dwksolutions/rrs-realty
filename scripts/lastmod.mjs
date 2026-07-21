// Real <lastmod> dates for the sitemap.
//
// Used by astro.config.mjs. The point is honesty: a lastmod that changes on every
// deploy trains search engines to ignore it. So each URL is dated from the thing
// that actually drives its content:
//   /guides/<slug>/       the guide's own `updated` (or `date`) frontmatter
//   /home-values/<city>/  the market-data CSV, since that is what changes
//   everything else       the last git commit that touched the page source
//
// Falls back to file mtime when git isn't available (e.g. a source download).

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';

// One `git log` pass over the repo: file path -> ISO date of its last commit.
function gitDates() {
  const map = new Map();
  try {
    const out = execSync('git log --name-only --format=%cI --no-merges', {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    let current = null;
    for (const line of out.split('\n')) {
      const l = line.trim();
      if (!l) continue;
      if (/^\d{4}-\d{2}-\d{2}T/.test(l)) current = l;
      else if (current && !map.has(l)) map.set(l, current); // first hit = most recent
    }
  } catch {
    // no git; mtime fallback below covers us
  }
  return map;
}

const GIT = gitDates();

function fileDate(path) {
  const git = GIT.get(path);
  if (git) return new Date(git);
  try {
    return statSync(path).mtime;
  } catch {
    return null;
  }
}

// Newest date among several source files.
function newest(...paths) {
  const dates = paths.map(fileDate).filter(Boolean);
  return dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();
}

// A guide's own dates beat file timestamps: `updated` is set by hand only on a
// genuine content revision, which is exactly what lastmod is supposed to mean.
function guideDate(slug) {
  const path = `src/content/guides/${slug}.md`;
  if (!existsSync(path)) return newest(path);
  const fm = readFileSync(path, 'utf8').split('---')[1] || '';
  const pick = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm'));
    return m ? new Date(m[1] + 'T00:00:00Z') : null;
  };
  return pick('updated') || pick('date') || newest(path);
}

const CITIES = 'src/data/cities.js';
const MARKET = 'src/data/market-data.csv';

export function lastmodFor(url) {
  const path = new URL(url).pathname;

  if (path === '/') return newest('src/pages/index.astro');

  const guide = path.match(/^\/guides\/([^/]+)\/$/);
  if (guide) return guideDate(guide[1]);
  if (path === '/guides/') return newest('src/pages/guides/index.astro', 'src/content/guides');

  if (/^\/home-values\/[^/]+\/$/.test(path)) return newest(MARKET, 'src/pages/home-values/[city].astro', CITIES);
  if (path === '/home-values/') return newest('src/pages/home-values/index.astro', CITIES);
  if (path === '/service-area/') return newest('src/pages/service-area.astro', CITIES);

  return newest(`src/pages${path.replace(/\/$/, '')}.astro`);
}
