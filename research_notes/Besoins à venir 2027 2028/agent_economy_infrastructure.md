# Agent Economy Infrastructure ("picks and shovels") for 2026–2028 — needs, timing, standards, players, white space for a tiny team

Research date: 2026-09-28. Method: ~23 web searches (search snippets; few full-page fetches). IMPORTANT source-quality caveat: many 2026 datapoints come from secondary aggregators/vendor blogs (eco.com, digitalapplied.com, stellagent.ai, presenc.ai, paz.ai, get-ryze.ai, etc.) rather than primary announcements. Primary sources (Visa, Mastercard, Stripe, Google, OpenAI, Shopify, TechCrunch, CNBC, Modern Retail, EU Commission) are marked where available. Figures from aggregators should be re-verified before publication.

## 1. Agent-readiness of businesses (MCP, llms.txt, NLWeb, WebMCP, Apps SDK/ACP, UCP, Shopify)

### Takeaway
Big platforms have already made *product catalogs* agent-readable at massive scale (Shopify switched on 5.6M stores to ChatGPT/Copilot/Gemini/AI Mode in March 2026; Google UCP via Merchant Center), so "agent-ready retail e-commerce" is largely being absorbed by platforms. The real white space is the long tail of **non-Shopify, service-based SMBs** (restaurants, salons, clinics, trades, local services, B2B quote-based businesses) whose booking, pricing, availability and quoting are not exposed to agents at all — adoption of simple signals (llms.txt ~6–9% of top sites) and MCP by SMBs is still tiny.

### Cited Findings
- Shopify activated "Agentic Storefronts" for all eligible merchants on March 24, 2026, making products from 5.6 million stores discoverable inside ChatGPT, Microsoft Copilot, Google AI Mode and Gemini; rollout was opt-out; no per-listing fees or commission on AI-attributed sales; a "Shopify Agentic Plan" lets brands on any e-commerce platform list in the Shopify Catalog — [digitalapplied (secondary)](https://www.digitalapplied.com/blog/agentic-storefronts-chatgpt-google-ai-copilot-seo); [Shopify news (primary)](https://shopify.com/news/agentic-commerce-momentum); [Shopify blog](https://www.shopify.com/blog/agentic-commerce)
- Google announced the Universal Commerce Protocol (UCP) on Jan 11, 2026 at NRF, co-developed with Shopify, Etsy, Wayfair, Target, Walmart and endorsed by 20+ partners incl. Visa, Mastercard, Stripe, Adyen; March 19, 2026 update added Cart, Catalog, Identity Linking and a simplified Merchant Center onboarding "for retailers of all sizes"; UCP-powered checkout currently for eligible US merchants, global expansion "throughout 2026" — [Google blog UCP updates](https://blog.google/products-and-platforms/products/shopping/ucp-updates/); [Google Merchant Center Help](https://support.google.com/merchants/answer/16837055?hl=en); [Google Developers Blog](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- ChatGPT apps directory (Apps SDK, MCP-based): ~1,624 apps as of July 2, 2026; 2,049–2,289 apps from ~2,007 developers by August 2026 (third-party counts differ); 392 of the 2,289 (17.1%) also ship a Claude connector — [Node8 directory](https://node8.ai/ai-connectors/chatgpt/); [Nicolas Sitter census](https://www.nicolassitter.com/research/mcp-apps-census-2026); [ChatGPTAppsRank](https://chatgptappsrank.com/state-of-chatgpt-apps-2026); OpenAI Apps SDK launch: [OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/)
- MCP registries: mcp.so lists ~20,222 servers; Glama indexed ~20,000; Smithery 7,000+; MCP SDKs ~97M downloads/month — but these are mostly developer/tool servers, not SMB business endpoints ("a directory of MCP servers is a different kind of thing from a tool that ships one") — [tooldirectory.ai](https://tooldirectory.ai/blog/state-of-mcp-servers-2026); [WorkOS](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)
- llms.txt adoption: 8.7% of top 1,000 sites (Rankability, June 2026); 5.86% of Tranco top 10,000 (May 6, 2026 crawl) — [Rankability](https://www.rankability.com/data/llms-txt-adoption/); [digitalapplied](https://www.digitalapplied.com/blog/llms-txt-in-practice-adoption-evidence-2026)
- NLWeb (Microsoft): an analysis (Sept 2026) advises small sites that Schema.org + llms.txt "capture most of the benefit today" and NLWeb can wait until agent demand shows in logs — i.e., NLWeb adoption remains limited — [Presenc AI](https://presenc.ai/research/nlweb-adoption-2026)
- WebMCP: a proposed browser standard (Google + Microsoft) letting sites expose actions (book, buy, sign up, support) to in-browser agents; a vendor blog claims "Chrome 146 shipped WebMCP support" and "first 100 companies being onboarded" (UNVERIFIED; likely early preview/flag) — [mean.ceo blog](https://blog.mean.ceo/startup-news-guide-to-webmcp-and-machine-usable-websites-2026/); [web-mcp.net (templates vendor, 37+ industry templates)](https://web-mcp.net/)
- Website builders (Wix/Squarespace/GoDaddy): search found only community-built MCP servers (e.g., an unofficial Squarespace MCP with 67–100+ tools on GitHub), not a first-party "make my SMB site agent-ready" product — [GitHub BusyBee3333](https://github.com/BusyBee3333/squarespace-mcp-2026-complete)
- One-click MCP hosting/gateways exist but target developers/enterprises (MintMCP one-click deploy with OAuth + monitoring) — [MintMCP](https://www.mintmcp.com/blog/gateways-ai-startups-with-mcp)

### Inferences
- Product e-commerce agent-readiness is becoming a platform feature (Shopify, Google Merchant Center, Stripe ACS) — a tiny team should NOT compete there head-on.
- Gap: a self-serve "agent profile" for service SMBs — one hosted endpoint (MCP + WebMCP + llms.txt + Schema.org + UCP/ACP feed where relevant) generated from a Google Business Profile / website crawl, exposing hours, services, prices, availability, booking/quote request, FAQs; with a dashboard showing which agents visited and what they asked. Distribution via Wix/WordPress/Squarespace plugins and agencies. This mirrors how "mobile-ready" and "Google My Business" were once cottage industries.
- Protocol fragmentation (MCP, WebMCP, NLWeb, ACP, UCP, A2A, llms.txt) itself creates demand for a "write once, publish to all agent protocols" abstraction for SMBs.

### Gaps
- No reliable count of SMBs/local businesses operating their own MCP server; found no primary data.
- Did not verify whether Wix/GoDaddy/Squarespace have launched official first-party agent/MCP features in 2026 (search results were dominated by comparison SEO pages).
- WebMCP shipping status in Chrome not verified from primary source (Chrome blog).

## 2. Agent payments & commerce (Visa, Mastercard, Stripe/OpenAI ACP, Google AP2/UCP, x402, stablecoins)

### Takeaway
Rails exist and are live in pilots, but agent *checkout* is still early: OpenAI shut down ChatGPT Instant Checkout on ~March 5, 2026 after only ~12–30 merchants went live; discovery-in-AI / buy-on-site won in 2026. Network-led agentic tokens (Visa/Mastercard) are going live with issuers in Europe/LatAm mid-2026 and x402 has high transaction counts but tiny dollar volume (~$53M cumulative). Expect real merchant-side need (accepting agent orders, verifying agents, disputes) to peak 2027–2028.

### Cited Findings
- OpenAI announced on March 5, 2026 that Instant Checkout (launched Sept 2025) would be discontinued because it wasn't converting; only ~a dozen Shopify merchants integrated and ~30 completed onboarding; <200,000 Walmart products available; failure partly due to scraped (stale) inventory/pricing; OpenAI pivoted to purchases via retailer apps inside ChatGPT — [CNBC, Mar 20, 2026](https://www.cnbc.com/2026/03/20/open-ai-agentic-shopping-etsy-shopify-walmart-amazon.html); [Modern Retail](https://www.modernretail.co/technology/what-went-wrong-with-chatgpts-instant-checkout/); [agenticcommercefeed](https://www.agenticcommercefeed.com/blog/2026-03-16-openai-kills-instant-checkout)
- "Agent-driven checkout collapsed in early 2026; agent-driven discovery is thriving" (analyst synthesis) — [agenticplug.ai tracker](https://agenticplug.ai/current-state-of-agentic-commerce); [digitalapplied](https://www.digitalapplied.com/blog/ai-agentic-commerce-discover-in-ai-buy-on-site-2026)
- Mastercard Agent Pay launched Apr 29, 2025; Visa Intelligent Commerce Apr 30, 2025; Visa Trusted Agent Protocol Oct 14, 2025 — [eco.com comparison (secondary)](https://eco.com/support/en/articles/15192003-mastercard-agent-pay-vs-visa-trusted-agent-2026-compared)
- Visa: July 2, 2026 (Visa Payments Forum, Paris) — AI agents completing live purchases at merchants across Europe backed by 30+ issuers (merchants incl. lastminute.com, Frasers, Cleverbridge, BrickDepot); June 10, 2026 — Visa + OpenAI announced integration of Visa Intelligent Commerce into OpenAI experiences (tokenized credentials, spend caps, merchant categories, human approval); 100+ partners, 30+ in sandbox, 20+ agents integrating — [The Industry Spread](https://theindustryspread.com/visa-agentic-payments-live-30-european-issuers/); [Visa newsroom](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-partners-complete-secure-agentic-transactions.html); [TechInformed](https://techinformed.com/visa-opens-one-integration-for-ai-agent-payments/)
- Mastercard launched "Agent Pay for Machines" (June 2026) and extended Agent Pay across LatAm & Caribbean from early 2026 — [Mastercard press, June 2026](https://www.mastercard.com/us/en/news-and-trends/press/2026/june/mastercard-launches-agent-pay-for-machines.html)
- Forbes (June 7, 2026): Visa, Mastercard and Coinbase "are fighting over how AI agents pay" — [Forbes](https://www.forbes.com/sites/digital-assets/2026/06/07/visa-mastercard-and-coinbase-are-fighting-over-how-ai-agents-pay/)
- Stripe: Agentic Commerce Suite (low-code, single integration to sell across AI agents); Shared Payment Tokens (SPTs) let agents pay with buyer permission without exposing credentials; March 2026 expansion of SPTs to Mastercard Agent Pay, Visa Intelligent Commerce and BNPL (Affirm, Klarna) — [Stripe newsroom](https://stripe.com/newsroom/news/agentic-commerce-suite); [Stripe blog](https://stripe.com/blog/supporting-additional-payment-methods-for-agentic-commerce); [Stripe docs](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens)
- Google AP2 announced Sept 16, 2025 with 60+ partners (Mastercard, AmEx, PayPal, Coinbase, Adyen, Worldpay, Salesforce, Etsy…); purchases expressed as signed Intent/Cart/Payment Mandates (verifiable credentials); Revolut Pay announced AP2 compatibility for UK/EEA in Jan 2026; reportedly contributed to FIDO Alliance — [Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol); [ap2-protocol.org](https://ap2-protocol.org/); [eco.com (secondary)](https://eco.com/support/en/articles/15192002-ap2-protocol-explained-google-s-agentic-commerce-standard-2026)
- x402 (Coinbase, HTTP 402 stablecoin micropayments): ~69,000 active agents, 165M transactions, ~$50M cumulative volume by late April 2026; 205M+ transactions, ~$53M cumulative by Aug 27, 2026; Coinbase facilitates ~67%; Agent.market (Apr 2026) is a directory of x402-paywalled services. CoinDesk (Mar 11, 2026): "demand is just not there yet" — [cryptonews.net](https://cryptonews.net/news/market/33360007/); [CoinDesk](https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet); [Presenc tracker](https://presenc.ai/research/x402-protocol-adoption-tracker-2026)
- a16z crypto (Apr 2026): identity, not intelligence, is the bottleneck; "headless merchants" (server + endpoints + price per call) are a new merchant class traditional processors won't underwrite; non-human identities outnumber humans 96:1 in financial services — [a16z crypto](https://a16zcrypto.com/posts/article/5-ways-blockchains-help-ai-agents/)

### Inferences
- Average ticket on x402 is ~$0.25 ($53M / 205M tx) — this is API/data micro-payments, not consumer shopping. Near-term opportunity: tooling for **"headless merchants"** (creators/devs/data owners selling per-call access to agents) — pricing pages, paywall middleware, revenue dashboards, tax/receipts — more than consumer checkout.
- For SMB merchants, the 2027–2028 needs are: (a) accept agent-initiated orders without a human session (order confirmation, policy/terms acceptance by mandate), (b) distinguish legitimate signed agents from bots, (c) agent-specific chargeback/dispute evidence (AP2 mandates, Visa TAP signatures). Payment processors (Stripe, Adyen, Shopify) will cover the rails; the gap is a lightweight "agent order desk" for non-platform merchants and service businesses (quotes, bookings, deposits).
- Consumer-side: families/SMBs delegating purchases to agents will need a spend-limits + approvals + receipts layer that works across ChatGPT/Gemini/Claude and card/stablecoin rails.

### Gaps
- No reliable 2026 figure for total agent-initiated card GMV (Visa/Mastercard don't disclose).
- UCP checkout merchant count not found.
- Stablecoin-for-agent volume outside x402 not found.

## 3. Agent identity, authentication, trust (KYA, Web Bot Auth, delegation, audit)

### Takeaway
The signed-agent layer is standardizing fast (IETF adopted Web Bot Auth as Standards Track on ~Sept 1, 2026; Visa TAP and Mastercard build on HTTP Message Signatures; Cloudflare and Akamai verify at the edge). KYA is attracting VC money (Baselayer $35M Sept 22, 2026; Vouched $17M; Persona KYA). These target enterprises/fintechs; a self-serve layer for small sites ("who's this agent, allow/charge/block, log it") is not yet productized outside Cloudflare.

### Cited Findings
- Web Bot Auth: Cloudflare-proposed protocol using HTTP Message Signatures (RFC 9421, Ed25519 key, Signature-Agent header, JWKS directory); IETF Web Bot Auth WG adopted it as a Standards Track document on Sept 1, 2026 (per secondary source) — [Stellagent](https://stellagent.ai/insights/cloudflare-web-bot-auth-agent-verification); [Coronium](https://www.coronium.io/blog/web-bot-auth-verifiable-ai-agents-2026)
- Akamai implemented Web Bot Auth verification at the edge — [Akamai blog](https://www.akamai.com/blog/security/redefine-trust-web-bot-authentication); [Akamai bot mgmt for agentic era](https://www.akamai.com/blog/security/bot-management-agentic-era)
- Visa Trusted Agent Protocol layers commerce authorization on Web Bot Auth so merchants can identify registered agents and link them to consumer identity — [ppc.land](https://ppc.land/web-bot-auth/)
- Baselayer raised $35M Series A (Sept 22, 2026, led by M13) for AI agent identity verification "no law yet requires" — [TechTimes](https://www.techtimes.com/articles/327943/20260923/baselayer-raises-35m-build-ai-agent-identity-verification-no-law-yet-requires.htm)
- Vouched launched "Know Your Agent" verification (May 2025) and raised $17M Series A — [BusinessWire](https://www.businesswire.com/news/home/20250522624223/en/Vouched-Launches-Know-Your-Agent-Verification-to-Bring-Trust-and-Identity-to-the-Next-Generation-of-AI-Agents); Persona also markets a KYA product — [tracebrief](https://tracebrief.com/articles/ai-agent-startup-funding-2026/)
- Academic proposals emerging: "terms.txt: A Consent and Compensation Protocol for Agentic Web Access" (arXiv, Sept 2026) — [arXiv](https://arxiv.org/pdf/2609.11152)
- Cloud Security Alliance 2026 survey: 65% of enterprises running agents had ≥1 agent-related incident in 12 months; 35% of those had direct financial losses (cited via secondary) — [Portal26/Ramp context](https://ramp.com/blog/ai-agent-spending-controls)

### Inferences
- Enterprise KYA will be won by identity incumbents (Persona, Socure, Vouched, Baselayer) and CDNs. The small-team angle: (1) a WordPress/Shopify/Wix plugin + hosted service that verifies Web Bot Auth signatures without Cloudflare, labels traffic (human / search bot / training crawler / signed agent / unsigned agent), and applies policies (allow, rate-limit, charge, block); (2) "agent passport" tooling for indie agent builders to register keys/directories so their agents aren't blocked (a developer-side counterpart).
- Delegation/permission receipts ("my agent may spend $50 at X") for consumers and micro-businesses remain unproductized outside bank/network apps.

### Gaps
- Could not verify the Sept 1, 2026 IETF adoption date from the IETF datatracker directly (proxy/time); flagged as secondary.
- No data on share of web traffic that is signed agents.

## 4. Content licensing & creator monetization (pay-per-crawl, RSL, TollBit)

### Takeaway
The economic squeeze is documented (AI referral CTR collapsing; scrape:referral ratios in hundreds or thousands to one), and infra is arriving: Cloudflare moved from Pay-per-Crawl (July 2025) to "Pay Per Use" (July 2026) with new defaults from Sept 15, 2026; RSL 1.0 (Nov/Dec 2025) has 1,500+ publishers. But payouts flow mainly to large publishers; small creators/blogs lack a simple, CDN-agnostic way to license, get attribution-based revenue, and see which AI used their content.

### Cited Findings
- Cloudflare Pay-per-Crawl marketplace launched July 1, 2025 with AI crawlers blocked by default — [TechCrunch 2025](https://techcrunch.com/2025/07/01/cloudflare-launches-a-marketplace-that-lets-websites-charge-ai-bots-for-scraping/); [AlternativeTo](https://alternativeto.net/news/2025/7/cloudflare-blocks-ai-crawlers-by-default-and-launches-pay-per-crawl-for-publishers)
- July 1, 2026: Cloudflare policy "pushes AI companies to pay"; evolution to "Pay Per Use" charging when content creates value in an AI product (not just fetch); initial partners Ceramic.ai and You.com; Cloudflare acts as merchant of record — [TechCrunch, Jul 1, 2026](https://techcrunch.com/2026/07/01/cloudflares-new-policy-pushes-ai-companies-to-pay-for-publishers-content/)
- From Sept 15, 2026 Cloudflare defaults block "mixed-use" crawlers on pages with ads; crawlers sorted into Search / AI Training / AI Agent buckets — [Technology.org](https://www.technology.org/2026/07/03/cloudflare-blocks-mixed-use-ai-crawlers/); [agentexperiences.com](https://www.agentexperiences.com/blog/cloudflare-pay-per-use-september-2026)
- RSL: launched Sept 2025; 1.0 spec Nov/Dec 2025; supported by Cloudflare, Akamai, Creative Commons, IAB Tech Lab; publishers incl. AP, Vox Media, USA Today, BuzzFeed, Stack Overflow, The Guardian, Slate; 1,500+ publishers by March 2026 — [RSL spec](https://rslstandard.org/rsl); [mediacopilot](https://mediacopilot.ai/rsl-licensing-standard-hits-1-0-gains-support-from-1500-publishers/); [GIGAZINE](https://gigazine.net/gsc_news/en/20251211-really-simple-licensing-1-0/)
- TollBit State of the Bots: AI app CTR fell from 0.8% (Q2 2025) to 0.27% (end 2025); sites with 1:1 AI deals saw CTR fall from 8.8% to 1.33% (Q4 2025); AI chatbot referrals ~96% lower CTR than traditional search; Digital Trends saw a 966:1 scrape-to-referral ratio in one week — [TollBit](https://tollbit.com/state-of-the-bots/); [mediacopilot](https://mediacopilot.ai/digital-trends-tollbit-ai-bot-monitoring/); [GMA](https://www.gmal.co.uk/bots-overtake-human-traffic/)
- TollBit reports scrapers bypassing publisher protections at scale ("the pipes are leaky") — [mediacopilot](https://mediacopilot.ai/ai-scrapers-bypassing-publisher-protections/)

### Inferences
- Small publishers/creators (newsletters, niche blogs, recipe sites, YouTubers' transcripts, course creators) need a one-click bundle: RSL license file + x402/pay-per-crawl endpoint + Web Bot Auth verification + "who used my content" dashboard + collective bargaining/aggregation (they are too small to negotiate alone). Cloudflare covers only its customers; TollBit targets mid/large publishers. An "ASCAP/collecting society for the long tail" style aggregator is white space, but revenue per small site will be small until AI companies actually pay at scale (2027+).

### Gaps
- No data on actual Pay-per-Crawl payout volumes or number of paying AI companies.
- TollBit 2026 (Q1/Q2) report figures not retrieved directly.

## 5. Provenance, watermarking, deepfake & voice-clone protection

### Takeaway
Regulatory forcing function is dated: EU AI Act Article 50 transparency obligations apply from Aug 2, 2026; the final Transparency Code of Practice (July 2026) names watermarks and C2PA manifests; legacy systems have until Dec 2, 2026 (per secondary sources). Generation-side compliance is handled by big model providers; the consumer/SMB side (verify content, protect likeness/voice, stop voice-clone payment fraud) is the underserved mass market.

### Cited Findings
- Article 50 obligations take effect Aug 2, 2026: generative AI outputs must be marked machine-readably; final Code of Practice published by the Commission (reported July 2026) accepts invisible watermarks and C2PA provenance; text <200 tokens exempt; systems on market before Aug 2, 2026 have until Dec 2, 2026 — [EU Commission Code of Practice page](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content); [Bird & Bird](https://www.twobirds.com/en/insights/2026/taking-the-eu-ai-act-to-practice-the-final-transparency-code-of-practice); [artificialintelligenceact.eu](https://artificialintelligenceact.eu/transparency-rules-article-50/). NOTE: exact dates for code publication and grace period come from secondary sources and possible EU "digital omnibus" amendments; verify.
- Adobe Firefly, OpenAI DALL·E 3/Sora, Google Imagen already embed C2PA manifests — [c2paviewer](https://c2paviewer.com/articles/eu-ai-act-content-credentials)
- BEC stole >$3B in 2025 with a ~$250M increase attributed to AI voice cloning/deepfake calls; claims that 40% of BEC in 2026 includes AI voice/video (vs <5% in 2023) and that ~3 seconds of audio suffice for a clone — [sqmagazine (aggregator, low confidence)](https://sqmagazine.co.uk/ai-voice-cloning-fraud-statistics/); [CybelAngel](https://cybelangel.com/blog/deepfake-ceo-fraud-how-voice-cloning-targets-us-executives/); [Resemble incident DB](https://www.resemble.ai/learn/deepfake-incident-database/incidents/reported-ai-voice-cloning-contributed-to-business-email-scam-losses-exceeding-do)
- Small businesses typically lack verification procedures for payment requests or staff training on voice cloning — [AutoCore AI](https://www.autocoreai.net/blog/ai-voice-cloning-fraud-protect-small-business-2026)

### Inferences
- White space: (a) family/SMB "safe word + callback verification" apps and phone-call deepfake screening sold like antivirus (mass-market, global, subscription); (b) "likeness monitoring" for creators/individuals (find unauthorized voice/face clones, file takedowns — tied to US NO FAKES/TAKE IT DOWN-type laws); (c) a simple C2PA "sign your content / verify this image" tool for SMB marketing teams and creators needing to prove authenticity.
- Enterprise deepfake detection (Reality Defender, Pindrop etc.) is crowded; SMB/family is not.

### Gaps
- Voice-clone fraud statistics are mostly from low-quality aggregators; no FBI IC3 2025/2026 voice-clone-specific figure retrieved.
- Did not research US state deepfake laws or C2PA member/adoption counts in 2026.

## 6. Agent observability, evals, guardrails and cost control for SMB users

### Takeaway
Agent spend is exploding (Ramp: token spend per customer up 13x since Jan 2025; Uber exhausted its 2026 AI budget by April) and agent wallets with guardrails exist (Coinbase, Crossmint, Circle, Privy, Openfort, MetaMask Agent Wallet June 2026) — but they target developers/enterprises. SMBs and prosumers running several agents (ChatGPT agents, Claude, Zapier/n8n, voice receptionists) lack a unified "agent bill + permissions + activity log" dashboard.

### Cited Findings
- Ramp: average monthly token spend by customers up 13x since Jan 2025; Uber's Claude Code rollout (~5,000 engineers, Dec 2025) exhausted its 2026 AI budget by April 2026 — [Ramp](https://ramp.com/blog/ai-agent-spending-controls); [Portal26](https://portal26.ai/ai-agent-cost-control-stop-agents-burning-budget/)
- Spending caps/approvals offered by Coinbase Agentic Wallets, Crossmint, Circle Agent Stack; MetaMask Agent Wallet early access June 8, 2026 with default limits and allowlists — [Fystack](https://fystack.io/blog/6-guardrails-to-limit-ai-agent-spending-on-payment-rails); [Vectrel](https://www.vectrel.ai/blog/metamask-agent-wallet-ai-agent-spending-controls); [Openfort](https://www.openfort.io/blog/best-agent-wallets-for-developers); [Privy](https://www.privy.io/agent-wallets)
- Visa's OpenAI integration includes user-defined guardrails (spend cap, merchant categories, human approval) — [TechInformed](https://techinformed.com/visa-opens-one-integration-for-ai-agent-payments/)

### Inferences
- Gap: "Mint/Ramp for agents" for SMBs — connect OpenAI/Anthropic/Google bills, SaaS agent seats, agent cards/wallets; alerts, caps, per-agent audit trail, "what did my agents do this week" digest. Enterprise observability (LangSmith, Arize, etc.) doesn't fit non-technical owners.

### Gaps
- No SMB-specific survey on agent usage/cost found; no funding data for SMB-focused agent cost tools.

## 7. GEO / AI search visibility — evolution and crowding

### Takeaway
GEO monitoring is already crowded and well-funded (Profound ~$1B valuation Feb 2026; Peec AI $21M Series A Nov 2025, ~$10M ARR by mid-2026; $300M+ raised across the category). It is NOT white space for monitoring dashboards; remaining openings are execution-side for local/service SMBs (actually fixing listings/structured data/agent-readiness) and very cheap global self-serve tiers.

### Cited Findings
- Profound reached ~$1B valuation (Series C, ~$96M) in Feb 2026 — [everything-pr](https://everything-pr.com/profound-reaches-1-billion-valuation-with-96m-series-c-cementing-category-leadership-in-ai-search-marketing)
- Peec AI: €5.2M seed (20VC, July 2025), $21M Series A (Singular, Nov 2025), ~$29M total; grew from $4M to $10M ARR in ~six months — [The Next Web](https://thenextweb.com/news/peec-ai-berlin-10-million-arr-geo-ai-search); [TNW valuation](https://thenextweb.com/news/peec-ai-200m-valuation-geo-ai-search)
- AI visibility tools raised $300M+ between summer 2025 and spring 2026; market consolidating — [Surmado](https://www.surmado.com/blog/best-ai-visibility-tools-2026); [Scrunch FAQ](https://scrunch.com/faqs/what-are-the-most-well-funded-ai-visibility-startups-for-aeo-geo-monitoring)

### Inferences
- GEO is converging with "agent-readiness": being cited is necessary but being *actionable* (bookable/buyable via agent) is the next step. A product bundling "AI visibility score + one-click agent endpoint" for local SMBs differentiates from Profound/Peec (brand/mid-market monitoring).

### Gaps
- No data on SMB-tier GEO tool pricing adoption or churn.

## 8. Cross-cutting synthesis: timing and white-space ranking for a tiny, self-serve, global team

### Takeaway
2026 = protocols + big-platform pilots; 2027 = network/processor general availability and regulation (EU Art. 50 enforcement, IETF Web Bot Auth RFC); 2028 = long-tail SMB demand. Best tiny-team positions are the long-tail "compliance/readiness kits" that platforms and enterprises ignore.

### Cited Findings
- Five production deployments of agentic commerce as of April 2026: ChatGPT Instant Checkout (later withdrawn), Amazon Buy for Me, Mastercard Agent Pay, Visa Intelligent Commerce, Coinbase Agent.market — [agenticplug.ai](https://agenticplug.ai/current-state-of-agentic-commerce)
- Coordinated-checkout protocol extensions testing in 2026, production possibly 2027; merchants will need to support multiple protocols (ACP + UCP) — [MetaRouter](https://www.metarouter.io/post/agentic-commerce-trends-statistics); [commercetools](https://commercetools.com/blog/google-ucp-merchant-guide-to-agentic-commerce)

### Inferences (ranked white space, author's judgment)
1. **Agent-ready kit for service SMBs** (booking/quotes/pricing via MCP+WebMCP+llms.txt+Schema, generated from Google Business Profile; agent-visit analytics). Timing: early (2026–27), mass market, viral via "Is your business visible to AI agents? Free scan".
2. **Long-tail creator/publisher AI licensing + bot-traffic firewall** (RSL + Web Bot Auth + x402 pay-per-access, CDN-agnostic WordPress/Ghost/Substack-adjacent plugin). Timing: demand now, revenue 2027+.
3. **Headless-merchant toolkit** (sell API/data/content per call to agents via x402/Stripe; pricing, receipts, tax). Timing: now, developer/creator audience.
4. **Family & SMB voice-clone/deepfake protection** (verification protocols, call screening, likeness monitoring). Timing: now; strong consumer pull.
5. **SMB agent spend/permission dashboard** across agents and wallets. Timing: 2027 as SMBs run multiple agents.
- Avoid: generic GEO monitoring (crowded, $300M+ funded), enterprise KYA (Persona/Baselayer/Vouched), core payment rails (Visa/Mastercard/Stripe/Coinbase/Google).

### Gaps
- No primary quantitative evidence of SMB demand (surveys of SMBs about agent-readiness) was found; all SMB demand arguments are inferential.
- Regional (non-US) availability of UCP checkout / Shopify agentic channels outside US not verified beyond "global expansion planned 2026".
