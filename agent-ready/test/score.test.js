import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analyzeSite } from '../src/checks/site.js';
import { scoreSite, overallScore, grade } from '../src/score.js';
import { checkAiAccess } from '../src/checks/robots.js';
import { scoreAnswer, parseAnswer } from '../src/checks/assistants.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
const page = (body, finalUrl = 'https://luxehair.example/') => ({ body, finalUrl, elapsedMs: 400, ok: true });

test('a well-prepared salon site scores as agent-ready', () => {
  const site = analyzeSite({ homepage: page(fixture('good-salon.html')), robotsTxt: 'User-agent: *\nAllow: /', llmsTxt: '# Luxe Hair Studio\nServices and prices for AI assistants.', sitemapFound: true });
  assert.equal(site.structuredData.localBusiness, 'HairSalon');
  assert.ok(site.structuredData.hasReserveAction);
  assert.deepEqual(site.content.bookingLinks, ['https://www.fresha.com/book-now/luxe']);
  const { readiness } = scoreSite(site);
  assert.equal(readiness, 100);
  assert.equal(grade(readiness), 'Agent-ready');
});

test('a bare site scores low and gets fixes', () => {
  const site = analyzeSite({ homepage: page(fixture('bare-salon.html'), 'http://bare.example/'), robotsTxt: null, llmsTxt: null, sitemapFound: false });
  const result = scoreSite(site);
  assert.ok(result.readiness < 30, `expected < 30, got ${result.readiness}`);
  const fixes = result.categories.flatMap((c) => c.items).filter((i) => i.fix);
  assert.ok(fixes.length >= 8);
});

test('robots.txt blocking AI crawlers is detected', () => {
  const access = checkAiAccess('User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /');
  assert.equal(access.find((a) => a.token === 'GPTBot').allowed, false);
  assert.equal(access.find((a) => a.token === 'PerplexityBot').allowed, true);
  const all = checkAiAccess('User-agent: *\nDisallow: /');
  assert.ok(all.every((a) => !a.allowed));
  assert.ok(checkAiAccess('User-agent: *\nDisallow:').every((a) => a.allowed));
});

test('assistant answers are parsed and scored', () => {
  const answer = parseAnswer('Sure! {"recommendations":["Luxe Hair Studio","Other"],"business":{"known":true,"website":"https://www.luxehair.example","booking_url":"https://fresha.com/x","knows_prices":false,"knows_hours":true}}');
  const { score, checks } = scoreAnswer(answer, { name: 'Luxe Hair Studio', website: 'https://luxehair.example/' });
  assert.ok(checks.recommended && checks.websiteCorrect);
  assert.equal(score, 90);
});

test('overall score blends readiness and visibility only when assistants were checked', () => {
  assert.equal(overallScore(80, null), 80);
  assert.equal(overallScore(80, 50), 68);
});
