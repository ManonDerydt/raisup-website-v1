import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// File-based storage for the test phase. Swap for a database before real launch volume.
export const DATA_DIR = process.env.DATA_DIR || fileURLToPath(new URL('../data/', import.meta.url));
const REPORTS_DIR = join(DATA_DIR, 'reports');
const ID_RE = /^[A-Za-z0-9]{10}$/;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function newId() {
  return [...randomBytes(10)].map((b) => ALPHABET[b % ALPHABET.length]).join('');
}

export async function saveReport(report) {
  await mkdir(REPORTS_DIR, { recursive: true });
  const id = report.id && ID_RE.test(report.id) ? report.id : newId();
  const stored = { ...report, id };
  await writeFile(join(REPORTS_DIR, `${id}.json`), JSON.stringify(stored));
  return stored;
}

export async function loadReport(id) {
  if (!ID_RE.test(id)) return null;
  try {
    return JSON.parse(await readFile(join(REPORTS_DIR, `${id}.json`), 'utf8'));
  } catch {
    return null;
  }
}

async function appendLine(file, record) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(join(DATA_DIR, file), `${JSON.stringify({ at: new Date().toISOString(), ...record })}\n`);
}

export const EVENT_TYPES = new Set(['report_view', 'share', 'download_card', 'open_fix', 'generate_fix', 'lead', 'agency_lead', 'checkout_click']);

export function logEvent({ type, reportId, source }) {
  if (!EVENT_TYPES.has(type)) throw new Error('Unknown event type');
  return appendLine('events.jsonl', { type, reportId: ID_RE.test(reportId || '') ? reportId : null, source: String(source || '').slice(0, 40) || null });
}

export function saveLead(lead) {
  return appendLine('leads.jsonl', lead);
}

export async function readJsonLines(file) {
  try {
    return (await readFile(join(DATA_DIR, file), 'utf8')).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}
