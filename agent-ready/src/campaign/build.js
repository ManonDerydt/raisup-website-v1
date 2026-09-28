// Campaign builder: find businesses → scan each website → save a personal report → find the published
// contact email → export CSV files ready to import in a cold-email tool (Instantly, Smartlead, lemlist…).
//
// Usage:
//   node src/campaign/build.js --category "hair salon" --cities "Austin, TX;Denver, CO" [--max 60] [--out campaign/out/austin]
//   node src/campaign/build.js --input prospects.csv --category "hair salon"   (columns: name, website, city)
//
// Env: BASE_URL (public site, used in report links), GOOGLE_PLACES_API_KEY (for --cities),
//      optional AI keys (OPENAI_API_KEY, …) to include AI visibility in the scores.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { searchPlaces } from '../prospect/places.js';
import { findEmail } from '../prospect/contact.js';
import { scan } from '../scan.js';
import { saveReport, DATA_DIR } from '../store.js';
import { toCsv, parseCsv } from './csv.js';
import { summarize } from './summary.js';

export const COLUMNS = [
  'email', 'company', 'city', 'website', 'score', 'band', 'headline', 'fix_1', 'fix_2', 'points_available',
  'blocks_ai', 'bookable', 'report_url', 'rating', 'reviews', 'phone', 'place_id', 'status',
];

export async function loadSuppression(dir = DATA_DIR) {
  try {
    const lines = (await readFile(join(dir, 'suppression.txt'), 'utf8')).split('\n').map((l) => l.trim().toLowerCase()).filter(Boolean);
    return new Set(lines);
  } catch {
    return new Set();
  }
}

export function isSuppressed(email, website, suppression) {
  if (!email) return false;
  const e = email.toLowerCase();
  const domain = e.split('@')[1];
  let site = '';
  try { site = new URL(website).hostname.replace(/^www\./, ''); } catch { /* no website */ }
  return suppression.has(e) || suppression.has(domain) || (site && suppression.has(site));
}

export function toRow(prospect, report, email, baseUrl) {
  const fixes = report.fixes || [];
  const allowed = report.categories.find((c) => c.id === 'allowed');
  const bookable = report.categories.find((c) => c.id === 'bookable');
  return {
    email: email || '',
    company: prospect.name,
    city: prospect.city,
    website: report.business.url,
    score: report.score,
    band: report.band.label,
    headline: report.headline,
    fix_1: fixes[0]?.fix || '',
    fix_2: fixes[1]?.fix || '',
    points_available: fixes.reduce((s, f) => s + f.pointsAvailable, 0),
    blocks_ai: allowed && allowed.score < 100 ? 'yes' : 'no',
    bookable: bookable && bookable.score >= 70 ? 'yes' : 'no',
    report_url: `${baseUrl.replace(/\/$/, '')}/r/${report.id}?src=email`,
    rating: prospect.rating ?? '',
    reviews: prospect.reviews ?? '',
    phone: prospect.phone || '',
    place_id: prospect.placeId || '',
    status: 'scanned',
  };
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }));
  return results;
}

export async function buildCampaign({ prospects, category, baseUrl, concurrency = 4, log = console.log }) {
  const suppression = await loadSuppression();
  const rows = await mapLimit(prospects, concurrency, async (p, i) => {
    const base = { company: p.name, city: p.city, website: p.website, phone: p.phone, place_id: p.placeId, rating: p.rating ?? '', reviews: p.reviews ?? '' };
    if (!p.website) return { ...base, status: 'no_website' };
    try {
      const { report, html } = await scan({ url: p.website, name: p.name, city: p.city, category }, { withHtml: true });
      const saved = await saveReport({ ...report, source: 'campaign' });
      const email = await findEmail(saved.business.url, html);
      const row = toRow(p, saved, email, baseUrl);
      if (!email) row.status = 'no_email';
      else if (isSuppressed(email, saved.business.url, suppression)) row.status = 'suppressed';
      log(`[${i + 1}/${prospects.length}] ${p.name}: ${saved.score}/100 ${email ? `· ${email}` : '· no email found'}`);
      return row;
    } catch (error) {
      log(`[${i + 1}/${prospects.length}] ${p.name}: scan failed (${error.message})`);
      return { ...base, status: `scan_failed: ${error.message}`.slice(0, 120) };
    }
  });
  return rows;
}

async function main() {
  const { values } = parseArgs({
    options: {
      category: { type: 'string', default: 'hair salon' },
      cities: { type: 'string' },
      input: { type: 'string' },
      max: { type: 'string', default: '60' },
      out: { type: 'string' },
      concurrency: { type: 'string', default: '4' },
    },
  });
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  let prospects = [];
  if (values.input) {
    prospects = parseCsv(await readFile(values.input, 'utf8')).map((r) => ({ name: r.name, website: r.website, city: r.city, phone: r.phone }));
  } else if (values.cities) {
    for (const city of values.cities.split(';').map((c) => c.trim()).filter(Boolean)) {
      const found = await searchPlaces({ category: values.category, city, maxResults: Number(values.max) });
      console.log(`${city}: ${found.length} businesses found`);
      prospects.push(...found);
    }
  } else {
    throw new Error('Pass --cities "Austin, TX;Denver, CO" or --input prospects.csv');
  }

  const rows = await buildCampaign({ prospects, category: values.category, baseUrl, concurrency: Number(values.concurrency) });
  const out = values.out || join('campaign', 'out', new Date().toISOString().slice(0, 10));
  await mkdir(out, { recursive: true });
  const sendable = rows.filter((r) => r.status === 'scanned' && r.email);
  await writeFile(join(out, 'all-prospects.csv'), toCsv(rows, COLUMNS));
  await writeFile(join(out, 'send-salons.csv'), toCsv(sendable, COLUMNS));
  const summary = summarize(rows);
  await writeFile(join(out, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(`\n${rows.length} prospects · ${summary.scanned} scanned · ${sendable.length} ready to email`);
  console.log(`Average score ${summary.averageScore} · ${summary.pctNotBookable}% not bookable by AI · ${summary.pctBlockingAi}% block some AI assistants`);
  console.log(`Files written to ${out}`);
}

if (process.argv[1]?.endsWith('build.js')) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
