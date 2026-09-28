// Funnel dashboard for the test and the campaign, computed from data/events.jsonl and data/leads.jsonl.
// Usage: node src/campaign/kpi.js [--since 2026-10-01] [--sent 500]

import { parseArgs } from 'node:util';
import { readJsonLines } from '../store.js';

export function funnel(events, leads, { since, sent } = {}) {
  const after = (x) => !since || x.at >= since;
  const ev = events.filter(after);
  const uniqueReports = (type, source) => new Set(ev.filter((e) => e.type === type && (!source || e.source === source)).map((e) => e.reportId)).size;
  const emailViews = uniqueReports('report_view', 'email');
  const l = leads.filter(after);
  const rate = (a, b) => (b ? `${Math.round((a / b) * 1000) / 10}%` : '—');
  return {
    emailsSent: sent ?? null,
    reportsOpenedFromEmail: emailViews,
    openRate: rate(emailViews, sent),
    shares: ev.filter((e) => e.type === 'share' || e.type === 'download_card').length,
    fixOpened: uniqueReports('open_fix'),
    fixGenerated: uniqueReports('generate_fix'),
    fixRate: rate(uniqueReports('generate_fix'), emailViews),
    salonLeads: l.filter((x) => x.source === 'report').length,
    agencyLeads: l.filter((x) => x.source === 'agency').length,
    checkoutClicks: ev.filter((e) => e.type === 'checkout_click').length,
  };
}

const THRESHOLDS = [
  ['J14 · rapports ouverts', (f) => f.emailsSent && f.reportsOpenedFromEmail / f.emailsSent >= 0.15, '≥ 15 % des commerces ouvrent leur rapport'],
  ['J14 · agences', (f) => f.agencyLeads >= 5, '≥ 5 agences demandent un accès'],
];

if (process.argv[1]?.endsWith('kpi.js')) {
  const { values } = parseArgs({ options: { since: { type: 'string' }, sent: { type: 'string' } } });
  const f = funnel(await readJsonLines('events.jsonl'), await readJsonLines('leads.jsonl'), { since: values.since, sent: values.sent ? Number(values.sent) : undefined });
  console.table(f);
  for (const [label, test, rule] of THRESHOLDS) console.log(`${test(f) ? '✅' : '⏳'} ${label}: ${rule}`);
}
