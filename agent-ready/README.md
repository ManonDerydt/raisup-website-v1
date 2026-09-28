# Agent-Ready

Free **Agent-Ready Score** for local service businesses (salons first): can ChatGPT, Gemini and Perplexity find, understand, recommend and book you? Plus a generator for the fixes (JSON-LD business card, `llms.txt`, `robots.txt` lines).

## Run

```bash
npm install
npm start            # http://localhost:3000  (open /?demo=1 for a sample report)
npm test
node src/cli.js yoursalon.com "Salon name" "Austin, TX"
```

Zero-build: a plain Node 20+ server (`src/server.js`) serves `public/` and the API. The only dependency is three.js for the 3D score orb, served locally from `node_modules`.

## Environment variables

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Ask ChatGPT what it knows (AI visibility) |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Same with Gemini |
| `PERPLEXITY_API_KEY`, `PERPLEXITY_MODEL` | Same with Perplexity |
| `PORT` | Server port (default 3000) |
| `SCAN_LIMIT_PER_HOUR` | Scans per IP per hour (default 20) |

Without AI keys the score equals **site readiness** only. See `METHODOLOGY.md`.

## API

- `POST /api/scan` `{ url, name?, city?, category? }` → report (`{ demo: true }` returns a sample)
- `POST /api/fix` business details → `{ jsonLd, llmsTxt, robotsTxt }`
- `POST /api/lead` `{ email, report?, source }` → appended to `data/leads.jsonl`
- `GET /api/card.svg?score=&name=&city=` → 1200×630 share card

## Layout

```
src/checks/  site.js (fetch + extract), html.js, robots.js, assistants.js
src/score.js scoring, bands, fixes      src/fix.js  fix pack generator
src/card.js  share card                 src/demo.js sample report
public/      landing, results, fix wizard, orb.js (three.js Readiness Orb)
```

## Campaign

See `campaign/PLAN.md` (plan, calendar, legal rules, KPIs) and the email sequences in `campaign/`.

```bash
BASE_URL=https://your-domain GOOGLE_PLACES_API_KEY=… node src/campaign/build.js --category "hair salon" --cities "Austin, TX" --max 200
node src/campaign/build.js --input prospects.csv          # columns: name, website, city
node src/campaign/kpi.js --since 2026-10-06 --sent 500    # funnel from data/events.jsonl and data/leads.jsonl
node scripts/build-preview.mjs ./preview                  # static, server-less preview of the site
```

Reports are saved in `data/reports/` and shared as `/r/<id>`; unsubscribes go in `data/suppression.txt`.

## Deploy

Any Node host (Render, Fly.io, Railway): build `npm install`, start `npm start`. Set the API keys as secrets. Leads are written to `data/`; use a persistent disk or swap for a database before launch.
