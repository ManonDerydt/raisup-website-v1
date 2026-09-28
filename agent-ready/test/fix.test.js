import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildJsonLd, buildLlmsTxt, jsonLdSnippet } from '../src/fix.js';
import { analyzeSite } from '../src/checks/site.js';
import { scoreSite } from '../src/score.js';

const biz = {
  name: 'Luxe Hair Studio', category: 'hair salon', website: 'https://luxehair.example/', phone: '+1-512-555-0100',
  address: { street: '100 Congress Ave', city: 'Austin', region: 'TX', postalCode: '78701', country: 'US' },
  hours: { Tuesday: [{ opens: '09:00', closes: '18:00' }], Saturday: [{ opens: '10:00', closes: '16:00' }] },
  services: [{ name: "Women's cut", price: 65, duration: 60 }, { name: 'Balayage', price: 180 }],
  bookingUrl: 'https://www.fresha.com/book-now/luxe', priceRange: '$$',
};

test('JSON-LD has the salon type, hours, priced services and a reserve action', () => {
  const ld = buildJsonLd(biz);
  assert.equal(ld['@type'], 'HairSalon');
  assert.equal(ld.openingHoursSpecification.length, 2);
  assert.equal(ld.hasOfferCatalog.itemListElement[1].price, '180');
  assert.equal(ld.potentialAction['@type'], 'ReserveAction');
  assert.equal(ld.email, undefined, 'empty fields are dropped');
});

test('llms.txt lists hours, prices and booking link', () => {
  const txt = buildLlmsTxt(biz);
  assert.match(txt, /^# Luxe Hair Studio/);
  assert.match(txt, /Balayage: \$180/);
  assert.match(txt, /Monday: Closed/);
  assert.match(txt, /Book directly at https:\/\/www\.fresha\.com/);
});

test('a bare page with the generated fixes applied scores as agent-ready', () => {
  const html = `<!doctype html><html><head><title>Luxe Hair Studio | Austin</title><meta name="description" content="Hair salon in Austin"><meta name="viewport" content="width=device-width">${jsonLdSnippet(biz)}</head><body><a href="${biz.bookingUrl}">Book</a></body></html>`;
  const site = analyzeSite({ homepage: { body: html, finalUrl: biz.website, elapsedMs: 300 }, robotsTxt: 'User-agent: *\nAllow: /', llmsTxt: buildLlmsTxt(biz), sitemapFound: true });
  assert.equal(scoreSite(site).readiness, 100);
});
