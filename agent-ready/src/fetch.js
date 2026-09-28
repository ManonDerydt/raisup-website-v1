import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export const USER_AGENT = 'AgentReadyScanner/0.1 (+https://agent-ready.example/bot)';

const PRIVATE_V4 = [
  [0x0a000000, 8], [0x7f000000, 8], [0xac100000, 12], [0xc0a80000, 16],
  [0xa9fe0000, 16], [0x64400000, 10], [0x00000000, 8],
];

function isPrivateAddress(address) {
  if (isIP(address) === 4) {
    const n = address.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
    return PRIVATE_V4.some(([base, bits]) => (n >>> (32 - bits)) === (base >>> (32 - bits)));
  }
  const a = address.toLowerCase();
  return a === '::1' || a === '::' || a.startsWith('fc') || a.startsWith('fd') || a.startsWith('fe80')
    || a.startsWith('::ffff:') && isPrivateAddress(a.slice(7));
}

// Refuse non-HTTP(S) schemes and hosts resolving to private networks (SSRF guard for the public scan endpoint).
export async function assertPublicUrl(rawUrl) {
  const url = new URL(rawUrl);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http and https URLs are allowed');
  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error('This host resolves to a private address');
  }
  return url;
}

export async function fetchText(rawUrl, { timeoutMs = 10000, maxBytes = 2_000_000 } = {}) {
  let url = await assertPublicUrl(rawUrl);
  const started = Date.now();
  // Follow redirects manually so every hop goes through the SSRF guard.
  for (let hop = 0; hop < 5; hop++) {
    const res = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,text/plain,*/*' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = await assertPublicUrl(new URL(res.headers.get('location'), url).href);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer()).subarray(0, maxBytes);
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: url.href,
      contentType: res.headers.get('content-type') || '',
      body: buffer.toString('utf8'),
      elapsedMs: Date.now() - started,
    };
  }
  throw new Error('Too many redirects');
}
