# Agent-Ready Score — Methodology v1

The Agent-Ready Score measures whether AI assistants (ChatGPT, Gemini, Perplexity, Claude) can **find, understand, recommend and book** a local service business. It is an indicator, not a guarantee: assistant answers vary between runs and models change often.

## Overall score

- **Site readiness** (always measured): what your website gives to AI assistants. Scored out of 100.
- **AI visibility** (measured when assistants are queried): what assistants actually say about you today. Scored out of 100 per assistant and averaged.
- **Agent-Ready Score** = 60% site readiness + 40% AI visibility. When AI visibility cannot be measured, the score equals site readiness.

| Score | Grade |
|---|---|
| 80–100 | Agent-ready |
| 60–79 | Partly ready |
| 40–59 | Hard for AI to use |
| 0–39 | Invisible to AI agents |

## Site readiness (raw points, normalized to 100)

| Area | Check | Points |
|---|---|---|
| AI assistants can read your site | AI crawlers allowed in robots.txt (share of 8 known agents: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended) | 15 |
| | HTTPS | 5 |
| | Homepage responds in under 3 s | 5 |
| AI assistants understand your business | schema.org LocalBusiness (or subtype) in JSON-LD | 8 |
| | Name, address, phone in JSON-LD (2 each) | 6 |
| | Opening hours in JSON-LD (8) — or only as page text (3) | 8 |
| | Page title and meta description (2.5 each) | 5 |
| AI assistants can quote and book you | Prices in structured data (10) — or ≥ 3 prices in text (6) — or at least one (3) | 10 |
| | Booking: ReserveAction in structured data (15) — or a link/widget to a known booking platform (11) | 15 |
| AI-specific files | `/llms.txt` present | 6 |
| | `/sitemap.xml` present | 4 |
| | Mobile viewport | 3 |

Total raw points: 90, normalized to 100.

## AI visibility (per assistant, out of 100)

Each assistant receives the same prompt: recommend 5 businesses of this category in this city, then tell what it knows about the business (website, booking link, prices, hours).

| Check | Points |
|---|---|
| Business appears in the 5 recommendations | 40 |
| Assistant says it knows the business | 15 |
| Website given matches the real website | 15 |
| A booking link is given | 10 |
| Assistant says it knows the prices | 10 |
| Assistant says it knows the opening hours | 10 |

## Limits

- Answers are sampled once per scan; results can differ on another run.
- "Knows prices/hours" is self-reported by the assistant, not yet verified against the real values (planned for v2 with the Google Business Profile as ground truth).
- Booking detection covers the main US booking platforms; custom booking systems may be missed.
- The scanner identifies itself as `AgentReadyScanner` and only reads public pages, `robots.txt`, `llms.txt` and `sitemap.xml`.
