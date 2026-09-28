// Usage: node src/cli.js <url> ["Business name"] ["City, ST"] ["category"]
import { scan } from './scan.js';

const [url, name, city, category] = process.argv.slice(2);
if (!url) {
  console.error('Usage: node src/cli.js <url> ["Business name"] ["City"] ["category"]');
  process.exit(1);
}

try {
  const report = await scan({ url, name, city, category });
  console.log(`\n${report.business.url}\nAgent-Ready Score: ${report.score}/100 — ${report.band.label} (${report.letter})\n${report.headline}`);
  console.log(`Site readiness: ${report.readiness}/100` + (report.visibility == null ? ' (AI assistants not checked: no API key)' : ` · AI visibility: ${report.visibility}/100`));
  for (const c of report.categories) console.log(`  ${c.label}: ${c.score}/100`);
  for (const a of report.assistants) console.log(`  ${a.label}: ${a.error ? `error (${a.error})` : `${a.score}/100`}`);
  console.log('\nTop fixes:');
  for (const f of report.fixes.slice(0, 5)) console.log(`  +${f.pointsAvailable}  ${f.fix}`);
  if (process.env.JSON) console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(`Scan failed: ${error.message}`);
  process.exit(1);
}
