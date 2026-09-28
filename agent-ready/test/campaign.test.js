import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractEmails, pickBest, findContactPage } from '../src/prospect/contact.js';
import { toCsv, parseCsv } from '../src/campaign/csv.js';
import { toRow, isSuppressed } from '../src/campaign/build.js';
import { summarize } from '../src/campaign/summary.js';
import { funnel } from '../src/campaign/kpi.js';
import { toProspect } from '../src/prospect/places.js';
import { demoReport } from '../src/demo.js';

test('keeps only emails the business publishes on its own domain or a mailbox provider', () => {
  const html = `<a href="mailto:Hello@LuxeHair.com?subject=Hi">Email</a> info&#64;luxehair.com
    support@wixpress.com agency@webdesignco.com owner.luxe@gmail.com logo@2x.png`;
  const emails = extractEmails(html, 'https://www.luxehair.com/');
  assert.deepEqual(emails.sort(), ['hello@luxehair.com', 'info@luxehair.com', 'owner.luxe@gmail.com']);
  assert.equal(pickBest(['owner.luxe@gmail.com', 'info@luxehair.com', 'hello@luxehair.com']), 'hello@luxehair.com');
  assert.equal(pickBest([]), null);
});

test('finds a same-site contact page only', () => {
  assert.equal(findContactPage('<a href="/contact-us">Contact</a>', 'https://luxehair.com/'), 'https://luxehair.com/contact-us');
  assert.equal(findContactPage('<a href="https://other.com/contact">x</a>', 'https://luxehair.com/'), null);
});

test('CSV round-trips commas, quotes and newlines', () => {
  const rows = [{ a: 'Luxe, "Hair"', b: 'line1\nline2' }, { a: 'plain', b: '' }];
  assert.deepEqual(parseCsv(toCsv(rows, ['a', 'b'])), rows);
});

test('a scanned report becomes a personalised campaign row', () => {
  const report = { ...demoReport(), id: 'Abc123XyZ9' };
  const prospect = toProspect({ id: 'place1', displayName: { text: 'Bella Hair Co.' }, websiteUri: 'https://bellahair.example/', rating: 4.6, userRatingCount: 212 }, { city: 'Austin, TX', category: 'hair salon' });
  const row = toRow(prospect, report, 'hello@bellahair.example', 'https://agentready.example/');
  assert.equal(row.report_url, 'https://agentready.example/r/Abc123XyZ9?src=email');
  assert.equal(row.company, 'Bella Hair Co.');
  assert.equal(row.blocks_ai, 'yes');
  assert.equal(row.bookable, 'no');
  assert.ok(row.fix_1.length > 10);
});

test('suppression matches email, email domain or website domain', () => {
  const list = new Set(['bye@a.com', 'b.com', 'c.com']);
  assert.ok(isSuppressed('bye@a.com', 'https://a.com', list));
  assert.ok(isSuppressed('x@b.com', 'https://zzz.com', list));
  assert.ok(isSuppressed('x@gmail.com', 'https://www.c.com/', list));
  assert.ok(!isSuppressed('x@gmail.com', 'https://d.com', list));
});

test('summary and funnel compute the campaign KPIs', () => {
  const rows = [
    { company: 'A', city: 'Austin, TX', score: 90, bookable: 'yes', blocks_ai: 'no', email: 'a@a.com' },
    { company: 'B', city: 'Austin, TX', score: 30, bookable: 'no', blocks_ai: 'yes', email: '' },
    { company: 'C', city: 'Austin, TX', status: 'no_website' },
  ];
  const s = summarize(rows);
  assert.equal(s.scanned, 2);
  assert.equal(s.pctNotBookable, 50);
  assert.equal(s.cities['Austin, TX'].top10[0].company, 'A');
  const events = [
    { at: '2026-10-02', type: 'report_view', reportId: 'r1', source: 'email' },
    { at: '2026-10-02', type: 'report_view', reportId: 'r1', source: 'email' },
    { at: '2026-10-03', type: 'generate_fix', reportId: 'r1' },
  ];
  const f = funnel(events, [{ at: '2026-10-03', source: 'agency' }], { sent: 10 });
  assert.equal(f.reportsOpenedFromEmail, 1);
  assert.equal(f.openRate, '10%');
  assert.equal(f.agencyLeads, 1);
});
