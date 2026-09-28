import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, normalize, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scan } from './scan.js';
import { enabledProviders } from './checks/assistants.js';
import { buildFixPack } from './fix.js';
import { scoreCardSvg } from './card.js';
import { demoReport } from './demo.js';
import { saveReport, loadReport, logEvent, saveLead } from './store.js';

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = fileURLToPath(new URL('../public/', import.meta.url));
const VENDOR_DIR = fileURLToPath(new URL('../node_modules/three/build/', import.meta.url));
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

// Naive per-IP rate limit so the public endpoint cannot be used to hammer third-party sites or burn API credits.
const hits = new Map();
function rateLimited(ip, limit = Number(process.env.SCAN_LIMIT_PER_HOUR) || 20, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > limit;
}

function send(res, status, body, type = 'application/json', extraHeaders = {}) {
  res.writeHead(status, { 'content-type': `${type}; charset=utf-8`, ...extraHeaders });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

async function readJson(req, maxBytes = 50_000) {
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > maxBytes) throw new Error('Request too large');
  }
  return JSON.parse(data || '{}');
}

async function serveStatic(pathname, res) {
  const vendor = pathname.startsWith('/vendor/three/');
  const root = vendor ? VENDOR_DIR : PUBLIC_DIR;
  const file = vendor ? pathname.slice('/vendor/three/'.length) : pathname === '/' ? 'index.html' : pathname.slice(1);
  const resolved = normalize(join(root, file));
  if (!resolved.startsWith(root)) return false;
  try {
    const body = await readFile(resolved);
    res.writeHead(200, {
      'content-type': TYPES[extname(resolved)] || 'application/octet-stream',
      'cache-control': extname(resolved) === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    res.end(body);
    return true;
  } catch {
    return false;
  }
}

export const server = createServer(async (req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'GET' && pathname === '/api/status') {
      return send(res, 200, { assistants: enabledProviders().map((p) => p.label) });
    }
    if (req.method === 'POST' && pathname === '/api/scan') {
      const body = await readJson(req);
      if (body.demo) return send(res, 200, demoReport(body));
      if (rateLimited(req.socket.remoteAddress)) return send(res, 429, { error: 'Too many scans from your network. Try again in an hour.' });
      if (!body.url || typeof body.url !== 'string') return send(res, 400, { error: 'Enter your website address.' });
      const report = await saveReport(await scan({ url: body.url, name: body.name, city: body.city, category: body.category || undefined }));
      return send(res, 200, report);
    }
    const reportMatch = pathname.match(/^\/api\/report\/([A-Za-z0-9]{10})$/);
    if (req.method === 'GET' && reportMatch) {
      const report = await loadReport(reportMatch[1]);
      if (!report) return send(res, 404, { error: 'This report does not exist or has expired.' });
      await logEvent({ type: 'report_view', reportId: report.id, source: searchParams.get('src') || 'direct' });
      return send(res, 200, report);
    }
    if (req.method === 'POST' && pathname === '/api/event') {
      const { type, reportId, source } = await readJson(req, 2000);
      await logEvent({ type, reportId, source });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && pathname === '/api/fix') {
      const biz = await readJson(req);
      if (!biz.name) return send(res, 400, { error: 'Business name is required.' });
      return send(res, 200, buildFixPack(biz));
    }
    if (req.method === 'POST' && pathname === '/api/lead') {
      const { email, report, source } = await readJson(req);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) return send(res, 400, { error: 'Enter a valid email address.' });
      await saveLead({ email, source: source || 'report', reportId: report?.id || null, url: report?.business?.url, name: report?.business?.name, city: report?.business?.city, score: report?.score });
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && pathname === '/api/card.svg') {
      const svg = scoreCardSvg({
        score: Number(searchParams.get('score')),
        name: searchParams.get('name') || 'Your business',
        city: searchParams.get('city') || '',
      });
      return send(res, 200, svg, 'image/svg+xml', { 'cache-control': 'public, max-age=86400' });
    }
    // Shareable report pages: /r/<id> serves the app, which loads the report client-side.
    if (req.method === 'GET' && /^\/r\/[A-Za-z0-9]{10}$/.test(pathname)) return serveStatic('/', res);
    if (req.method === 'GET' && await serveStatic(pathname, res)) return;
    send(res, 404, { error: 'Not found' });
  } catch (error) {
    send(res, 422, { error: error.message });
  }
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    const providers = enabledProviders().map((p) => p.label);
    console.log(`Agent-Ready on http://localhost:${PORT}`);
    console.log(providers.length ? `AI assistants enabled: ${providers.join(', ')}` : 'No AI assistant keys set: site readiness only.');
  });
}
