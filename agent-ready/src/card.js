import { grade } from './score.js';

const escapeXml = (s) => String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));

export function scoreColor(score) {
  if (score >= 80) return '#12A150';
  if (score >= 50) return '#E8A200';
  return '#E5484D';
}

// 1200×630 share card (Open Graph size) with a score ring.
export function scoreCardSvg({ score, name, city }) {
  const s = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;
  const r = 150;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(s);
  const title = escapeXml(name.slice(0, 40));
  const place = escapeXml(city.slice(0, 40));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="30%" cy="50%" r="60%"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="#0B0B12" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0B0B12"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(330 315)">
    <circle r="${r}" fill="none" stroke="#23232F" stroke-width="28"/>
    <circle r="${r}" fill="none" stroke="${color}" stroke-width="28" stroke-linecap="round"
      stroke-dasharray="${(circumference * s) / 100} ${circumference}" transform="rotate(-90)"/>
    <text y="30" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="120" font-weight="700" fill="#F5F5F7">${s}</text>
    <text y="80" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" fill="#8A8A99">/ 100</text>
  </g>
  <g font-family="Inter, Helvetica, Arial, sans-serif">
    <text x="560" y="210" font-size="28" fill="#8A8A99" letter-spacing="4">AGENT-READY SCORE</text>
    <text x="560" y="285" font-size="56" font-weight="700" fill="#F5F5F7">${title}</text>
    <text x="560" y="335" font-size="30" fill="#8A8A99">${place}</text>
    <text x="560" y="410" font-size="38" font-weight="600" fill="${color}">${escapeXml(grade(s))}</text>
    <text x="560" y="520" font-size="26" fill="#8A8A99">Can ChatGPT book you? Check free at agentready</text>
  </g>
</svg>`;
}
