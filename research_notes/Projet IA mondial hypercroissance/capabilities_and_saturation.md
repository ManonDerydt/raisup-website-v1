# AI Wave Timing: New Capabilities (2025–Sept 2026) vs. Saturated / Platform-Absorbed Categories

Research date: 2026-09-28. Source-quality note: many 2026 figures come from secondary blogs/aggregators (flagged "[secondary]"). Primary sources (OpenAI, Anthropic, Apple, Google, METR, Epoch, Menlo, TechCrunch, Bloomberg) are preferred where available.

## 1. Which 2025–2026 capability jumps opened new product categories, and which remain under-exploited?

### Takeaway
The biggest 2025–26 unlocks are (a) long-horizon autonomous agents (METR time horizon ~16–20h at 50% success by early 2026), (b) computer-use agents passing the human baseline on OSWorld-Verified (but still weak on multi-hour real workflows and slow), (c) cheap realtime speech-to-speech (~$0.02–0.08/min), (d) consumer-grade image editing (Nano Banana) and video with native audio (Veo 3.x), and (e) collapsing cost per capability (median ~50x/yr, ~200x/yr since 2024). The codegen wave that created Lovable/Base44 is now mature; the next under-exploited frontier is "agent does a whole job end-to-end" in verticals, and voice/computer-use in workflows where incumbents lack APIs.

### Cited Findings
**Long-running agents**
- METR Time Horizon 1.1 (published 2026-01-29) updated methodology; strongest models near/beyond the measurable range of the suite — [METR](https://metr.org/blog/2026-1-29-time-horizon-1-1/)
- Doubling time accelerated: ~7 months (2019–2025) → ~4 months (2024–2025); a fit through Feb 2026 data gives ~105 days; "Claude Mythos Preview" estimated ~16h (50% horizon) in March 2026, ~3–4h at 80% reliability [secondary, X post and trackers] — [Aakash Gupta on X](https://x.com/aakashgupta/status/2053207639107174452); [AI 2027 tracker](https://ai2027-tracker.com/predictions/metr-doubling/); [METR time horizons page](https://metr.org/time-horizons/)
- Only 5 of 228 METR tasks are 16h+, so the benchmark itself is becoming the bottleneck [secondary] — [Aakash Gupta on X](https://x.com/aakashgupta/status/2053207639107174452)

**Computer-use / browser agents**
- As of July 2026, frontier agents exceed 85% on OSWorld-Verified, above the ~72% human baseline — [Steel.dev OSWorld leaderboard](https://leaderboard.steel.dev/leaderboards/osworld/)
- But OSWorld 2.0 (June 2026; 108 long-horizon workflows, median ~1.6 human-hours, ~318 tool calls with Claude Opus 4.7 max thinking) — best config reaches only 20.6% full completion / 54.8% partial — [arXiv 2606.29537](https://arxiv.org/abs/2606.29537)
- Efficiency problem: best agents take 2.7–4.3x more steps than necessary; "tens of minutes" latency for tasks humans do in minutes (MLSys 2026) — [OSWorld-Human, MLSys 2026](https://mlsys.org/virtual/2026/oral/3865)
- Browser war: ChatGPT Atlas launched Oct 2025; Perplexity Comet free worldwide Oct 2025; Gemini in Chrome Sept 2025 — [Sid Saladi Substack](https://sidsaladi.substack.com/p/the-browser-wars-2025-chatgpt-atlas)
- OpenAI announced (July 2026) Atlas would shut down Aug 9, 2026, folding browser-agent features (multi-tab, logins, downloads) into ChatGPT desktop — [TechCrunch, 2026-07-09](https://techcrunch.com/2026/07/09/openai-is-shutting-down-atlas-but-its-ai-browser-ambitions-are-still-growing/); [OpenAI Help Center](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work)
- Comet launched on Android Aug 19, 2026 [secondary] — [Tech Insider](https://tech-insider.org/comet-vs-gemini-agent-vs-chatgpt-atlas-2026/)

**Knowledge-work agents (Claude Cowork)**
- Anthropic launched Claude Cowork (agent for professional work) on Jan 12, 2026; on Jan 30 it released 11 open-source plugins each targeting a white-collar function; the S&P Software & Services index fell ~25% between Jan 12 and Feb 23 ("SaaSpocalypse", term from Jefferies); Feb 24 Anthropic announced integrations with Docusign, FactSet, Gmail, Intuit, Salesforce — [DeepLearning.AI The Batch](https://www.deeplearning.ai/the-batch/claude-cowork-plugins-trigger-a-saas-stock-selloff-but-partnerships-lead-to-slight-rebound)
- ~$285B of software/legal-tech market value wiped in the selloff — [TechStartups, 2026-02-05](https://techstartups.com/2026/02/05/anthropics-claude-plugins-spark-285-billion-software-stock-selloff-as-ai-targets-entire-saas-workflows/)
- OpenAI repositioning ChatGPT as a "productivity tool" ahead of IPO (March 2026); ChatGPT Work turns notes/drafts into deliverables; Codex built into ChatGPT desktop — [CNBC, 2026-03-17](https://www.cnbc.com/2026/03/17/openai-preps-for-ipo-in-2026-says-chatgpt-must-be-productivity-tool.html)

**Realtime voice**
- gpt-realtime-2 released May 7, 2026: $32/M audio-input tokens, $64/M output, $0.40 cached; context 32K→128K [secondary] — [Vantaige](https://vantaige.io/blog/openai-gpt-realtime-2-voice-agent-setup-2026)
- Works out to roughly $0.05/conversation-minute (≈$0.016 on mini) [secondary] — [Layer3Labs](https://www.layer3labs.io/guides/openai-realtime-api-pricing); Retell prices at ~$0.07/min — [Retell AI](https://www.retellai.com/blog/ai-voice-agent-pricing-full-cost-breakdown-platform-comparison-roi-analysis)
- Voice AI framed as a distinct category once latency <500ms and price <$0.10/min; vertical voice agents (Bland, Retell, Vapi, PolyAI, Hume etc.) raised $50–250M rounds [secondary, unverified figures] — [startupfundraising.com](https://startupfundraising.com/voice-ai-fundraising)

**Image editing & video generation**
- Nano Banana (Gemini 2.5 Flash Image, late Aug 2025): 5B+ creations within weeks; 500M+ images edited in the Gemini app by end Sept 2025; Google says it "spawned thousands of new startups" — [Logan Kilpatrick/Medium](https://medium.com/around-the-prompt/5-things-to-build-with-googles-new-nano-banana-image-editing-generation-model-ddfb0d167715); [Google blog](https://blog.google/products-and-platforms/products/gemini/updated-image-editing-model/)
- Google explicitly markets Nano Banana for professional headshots — [Google blog tips](https://blog.google/products/gemini/nano-banana-tips/)
- OpenAI notified developers March 24, 2026 that the Sora app would shut down (app/web closed April 26, 2026; Sora 2 API removal Sept 24, 2026) — [Bloomberg, 2026-03-24](https://www.bloomberg.com/news/articles/2026-03-24/openai-plans-to-discontinue-support-for-sora-ai-video-generator); dates detail from [MindStudio](https://www.mindstudio.ai/blog/openai-shutting-down-sora-what-happened)
- Claimed Sora economics: ~$15M/day costs vs ~$2.1M lifetime revenue [secondary, unverified — treat with caution] — [AI Magicx](https://www.aimagicx.com/blog/sora-shutdown-ai-video-landscape-openai-2026)
- Post-Sora hierarchy (Apr 2026): Veo 3.1 (quality, 4K, native audio), Runway Gen-4 (control), Kling 3.0 (cost); Google Vids gives 10 free Veo 3.1 generations/month to any Google account [secondary] — [AI Magicx](https://www.aimagicx.com/blog/sora-shutdown-ai-video-landscape-openai-2026); [Digital Applied](https://www.digitalapplied.com/blog/ai-video-market-after-sora-runway-kling-veo-2026)

**On-device models**
- WWDC June 9, 2026: Foundation Models framework gets a rebuilt on-device model (better tool calling), image input, on-device Vision tools (OCR, barcode), and a LanguageModel protocol letting apps swap to cloud models (Claude, Gemini, etc.); new "Core AI" framework for bringing own models on-device — [Apple WWDC26 guide](https://developer.apple.com/wwdc26/guides/apple-intelligence/); [WWDC26 session 339](https://developer.apple.com/videos/play/wwdc2026/339/); [Callstack](https://www.callstack.com/blog/on-device-ai-after-wwdc-2026-whats-new)

**Cost per token**
- Epoch AI: price to reach a fixed capability level falls 9x–900x/yr, median ~50x; ~200x/yr for models released since 2024; GPT-4-level on PhD science questions fell ~40x/yr — [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends)
- Caveat: declines are unequal across tasks, and agentic/reasoning workloads consume many more tokens so total bills often rise — [Epoch AI](https://epoch.ai/data-insights/llm-inference-price-trends); [Artefact](https://www.artefact.com/blog/is-ai-really-getting-cheaper-the-token-cost-illusion/)

**Enterprise demand context**
- Menlo Ventures (Dec 9, 2025): enterprise gen-AI spend $11.5B→$37B in 2025; 76% of AI solutions bought vs built (53% prior year); healthcare $1.5B = 43% of vertical AI spend; coding a ~$4B category dominated by Anthropic — [Menlo Ventures](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/); [GlobeNewswire](https://www.globenewswire.com/news-release/2025/12/09/3202258/0/en/menlo-ventures-2025-state-of-generative-ai-report-enterprise-investment-hit-37b-in-2025-tripling-in-one-year.html)

### Inferences
- The "Lovable moment" analog for late 2026 is likely long-horizon agents that deliver finished work products (a completed audit, filing, campaign, reconciliation) in a vertical, priced per outcome — the capability (hours-long autonomy at ~50% reliability) exists, but 80%-reliability horizons are only a few hours, so products that wrap agents with verification/human review in a narrow domain have an edge.
- Computer-use is benchmark-good but product-immature (slow, fails on long real workflows). Opportunity: automation of legacy/no-API software (healthcare portals, government, insurance, ERP) in verticals where general assistants won't go. Horizontal "AI browser" is a giant's game (Atlas itself was folded; Chrome+Gemini default).
- Voice at ~$0.02–0.08/min makes phone-based workflows economic for SMBs (inbound calls, scheduling, collections, multilingual); horizontal voice infra is crowded, vertical voice agents for non-English/global markets look less saturated.
- Healthcare stands out in Menlo data as the largest vertical spend pool.
- On-device (Apple Foundation Models with free inference) enables zero-marginal-cost consumer features for iOS apps — under-exploited because distribution is still app-store driven.
- Video: the consumer "generator app" layer is fragile (even OpenAI exited); value likely in workflow products (ads, e-commerce, localization) built on Veo/Kling APIs.

### Gaps
- No primary source for METR's exact 2026 per-model figures (Mythos 16h) — came via X post/trackers; verify on metr.org/time-horizons.
- Sora cost/revenue figures are unverified blog claims.
- Voice-startup funding ranges are from a non-authoritative guide.

## 2. New distribution platforms (ChatGPT Apps/App Directory, Claude connectors/MCP Apps, GPT store, Chrome, app stores) — is there an early-App-Store opportunity?

### Takeaway
Distribution surfaces exist and are growing (ChatGPT ~900M weekly users; ChatGPT App Directory opened Dec 2025; Claude directory 950+ connectors; MCP Apps since Jan 2026; 10k+ public MCP servers), but monetization inside them is weak (external checkout only, Instant Checkout sunset), and launch partners are big brands. The early-mover window resembles the GPT Store more than the 2008 App Store: useful as a discovery channel for a product with its own business, not a standalone business.

### Cited Findings
- Apps in ChatGPT + Apps SDK (built on MCP) announced at DevDay Oct 2025; launch partners Canva, Figma, Spotify, Zillow, Booking etc. — [OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/)
- OpenAI opened app submissions and launched the App Directory in Dec 2025; apps passing review rolled out early 2026 — [OpenAI](https://openai.com/index/developers-can-now-submit-apps-to-chatgpt/); [VentureBeat](https://venturebeat.com/technology/openai-now-accepting-chatgpt-app-submissions-from-third-party-devs-launches)
- ChatGPT ~900M weekly users; "chat box as launcher" [secondary] — [umesh-malik.com](https://umesh-malik.com/blog/chatgpt-apps-sdk-super-app-guide); 900M+ WAU also cited by [Washington Post, 2026-06-08](https://www.washingtonpost.com/technology/2026/06/08/openai-files-list-stock-market-expected-trillion-dollar-debut/)
- Monetization: OpenAI docs recommend external checkout on the developer's domain; in-ChatGPT checkout approval limited to physical goods — [OpenAI Apps SDK monetization](https://developers.openai.com/apps-sdk/build/monetization); [Wildnet](https://www.wildnetedge.com/blogs/chatgpt-app-monetization)
- Instant Checkout (Sept 2025, with Stripe's Agentic Commerce Protocol) — [OpenAI](https://openai.com/index/buy-it-in-chatgpt/); [Stripe](https://stripe.com/newsroom/news/stripe-openai-instant-checkout) — reportedly sunset March 2026 with <30 Shopify merchants live; Walmart saw in-ChatGPT checkout convert ~3x worse than click-through [secondary] — [Laioutr](https://www.laioutr.com/en/blog/chatgpt-instant-checkout-merchant-adoption-agentic-readiness-2026); [Lengow](https://blog.lengow.com/chatgpt-wanted-to-become-the-worlds-biggest-shop/)
- Claude: MCP Apps launched Jan 26, 2026 (interactive UIs in chat; day-one partners Amplitude, Asana, Box, Canva, Clay, Figma, Hex, Monday, Slack); available on all plans including Free — [Anthropic/Claude blog](https://claude.com/blog/interactive-tools-in-claude)
- Claude connectors directory lists 950+ MCP servers; MCP 2026-07-28 spec (stateless core) coming to Claude — [Claude blog](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude)
- MCP donated to the Linux Foundation's Agentic AI Foundation Dec 9, 2025 (with Block's goose and OpenAI's AGENTS.md); MCP Registry launched Sept 2025; 10k+ public servers; ~97M monthly SDK downloads by March 2026; client support in ChatGPT, Claude, Gemini, Copilot, VS Code, Cursor [secondary for counts] — [Digital Applied](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol); [ChatForest](https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/)
- Apple opened Foundation Models to any LLM provider (June 2026) — new on-device distribution for iOS AI features — [Apple WWDC26 session](https://developer.apple.com/videos/play/wwdc2026/339/)

### Inferences
- Because MCP is cross-platform (ChatGPT, Claude, Gemini, Copilot), building one MCP server/app gets multi-assistant distribution; being early in an under-served vertical category within directories (not generic productivity) is the realistic early-mover play.
- Directory launch slots went to incumbents (Canva, Figma, Slack); a new entrant competes on niche use cases the incumbents don't cover.
- Lack of native payments means apps must be lead-gen/top-of-funnel for an owned SaaS; don't plan a business that lives only inside ChatGPT.

### Gaps
- No reliable public data on per-app usage, installs or revenue in the ChatGPT App Directory or Claude directory.
- No data found on GPT Store status in 2026 or Chrome-extension AI category saturation.

## 3. Saturated categories in 2026 (evidence: competitors, funding, price wars, platform features)

### Takeaway
Most crowded/absorbed: AI app builders (vibe coding — multi-$B incumbents), meeting note-takers (Zoom/Meet/Teams/ChatGPT native), generic AI writing, AI headshots/photo edits (Nano Banana free), horizontal AI SDR (churn, credibility issues), enterprise AI customer support (Sierra/Decagon at $4.5–15B valuations), generic AI video generators, and AI browsers. Opportunity survives only in narrow verticals with proprietary data/workflow depth.

### Cited Findings
**AI app builders / vibe coding**
- Lovable: ~$400M ARR by Feb 2026 with 146 employees; $400M Series C at $13.3B (Aug 2026); Replit $400M at $9B; Cursor $2B ARR (Feb 2026); v0 ~$42M ARR [secondary] — [Tech Insider](https://tech-insider.org/replit-vs-lovable-vs-bolt-new-2026/); [13Labs](https://www.13labs.au/blog/vibe-coding-tools-2026)
- Price points compressed: Lovable Pro ~$25/mo, Bolt $10–20/mo [secondary] — [13Labs](https://www.13labs.au/blog/vibe-coding-tools-2026)
- New entrants still spike (Anything: $2M ARR in 2 weeks, $100M valuation, Sept 2025) but the category now also faces Codex-in-ChatGPT and Claude Code — [TechCrunch, 2025-09-29](https://techcrunch.com/2025/09/29/vibe-coding-startup-anything-nabs-a-100m-valuation-after-hitting-2m-arr-in-its-first-two-weeks); [CNBC](https://www.cnbc.com/2026/03/17/openai-preps-for-ipo-in-2026-says-chatgpt-must-be-productivity-tool.html)

**AI note-takers / meeting assistants**
- Crowded with platform competitors (Zoom, Microsoft); Granola gaining (3x spend growth in 6 months, near-zero churn) while Fireflies, Otter, Fathom have larger bases but slowing growth/spend (YipitData, 2026) — [YipitData](https://www.yipitdata.com/resources/blog/granola-vs-fathom-otter-fireflies-ai-notetaking)
- Google's Gemini note-taker extended to in-person meetings and to Zoom/Teams (Google Next 2026) — [TechBuzz](https://www.techbuzz.ai/articles/google-gemini-now-takes-notes-at-in-person-meetings); Meet auto notes — [TechRadar](https://www.techradar.com/pro/google-meet-calls-will-now-automatically-take-notes-for-you)
- ChatGPT Record Mode (macOS) transcribes/summarizes meetings natively — [tl;dv](https://tldv.io/blog/chatgpt-record-mode-for-meetings/)

**AI SDR / outbound**
- 11x faced allegations of very high churn (internal retention ~20–30% in part of 2024, disputed by 11x) and listing customers who denied using it (TechCrunch); Artisan CEO acknowledged first-gen AI SDRs had "pretty low response rate" and "relatively high churn" [compiled from vendor/comparison pages] — [devcommx](https://www.devcommx.com/blogs/artisan-vs-11x-vs-aisdr); [The CRO Report](https://thecroreport.com/blog/best-ai-sdr-tools-2026/); [TechCrunch on Artisan, 2025-04](https://techcrunch.com/2025/04/09/artisan-the-stop-hiring-humans-ai-agent-startup-raises-25m-and-is-still-hiring-humans)
- Anthropic's Cowork partner list includes Clay and Salesforce integrations, i.e., platform moving into GTM workflows — [Claude blog](https://claude.com/blog/interactive-tools-in-claude); [The Batch](https://www.deeplearning.ai/the-batch/claude-cowork-plugins-trigger-a-saas-stock-selloff-but-partnerships-lead-to-slight-rebound)

**AI customer support**
- Sierra: $200M ARR (May 2026, from $26M end-2024), $950M Series E at $15B+ — [CMSWire](https://www.cmswire.com/customer-experience/sierra-raises-950m-at-15b-valuation-eyes-transformation-beyond-customer-support/); [Sacra](https://sacra.com/c/sierra/)
- Decagon: $4.5B valuation (Jan 2026, $250M Series D), ~$100M annualized revenue (July 2026) — [Sacra](https://sacra.com/c/decagon/); [Wikipedia](https://en.wikipedia.org/wiki/Decagon_(company))

**AI headshots / image apps**
- Nano Banana is free in Gemini and promoted for headshots; 5B+ creations — [Google blog](https://blog.google/products/gemini/nano-banana-tips/); [Medium/Kilpatrick](https://medium.com/around-the-prompt/5-things-to-build-with-googles-new-nano-banana-image-editing-generation-model-ddfb0d167715)

**AI video generators**
- Even OpenAI exited consumer AI video (Sora shut down 2026); Google gives free Veo 3.1 generations via Vids — [Bloomberg](https://www.bloomberg.com/news/articles/2026-03-24/openai-plans-to-discontinue-support-for-sora-ai-video-generator); [Sunra](https://sunra.ai/blog/ai-video-generation-2026-sora-shutdown-veo-free-kling-viral)

**AI browsers**
- Atlas discontinued within ~9 months; Chrome+Gemini "already does more" (Tom's Guide) — [TechCrunch](https://techcrunch.com/2026/07/09/openai-is-shutting-down-atlas-but-its-ai-browser-ambitions-are-still-growing/); [Tom's Guide](https://www.tomsguide.com/ai/i-dont-need-an-ai-browser-like-chatgpt-atlas-gemini-3-in-chrome-already-does-more)

**General wrapper failure rates**
- Claims that ~80% of AI wrapper startups fail by end-2026, 60–70% zero revenue, only 3–5% cross $10k MRR attributed to "CB Insights and Gartner" [secondary; original source not located — treat as unverified] — [Medium/AI Empire Media](https://medium.com/@aiempiremedia/the-real-reason-ai-startups-are-failing-in-2026-30a4cc9fd140)
- IdeaProof tracks 364+ failed AI startups (2023–2026); "Killed by AI" lists 128 dead AI tools — [IdeaProof](https://ideaproof.io/failures/ai-startups); [Killed by AI](https://mixtpatrik.github.io/killedbyai/)

### Inferences
- Avoid in late 2026 (horizontal): app builders, note-takers, generic writing/copy, headshot/photo filters, generic chatbots/support for enterprise, horizontal AI SDR, AI browsers, consumer text-to-video apps, "chat with PDF/docs", resume/cover-letter generators (native in assistants — no specific 2026 data found, see gaps).
- Pattern: categories died or compressed when (1) the feature became a default toggle in a surface people already use (Meet, Zoom, Gemini, ChatGPT), or (2) leaders reached $100M+ ARR and multi-$B valuations, making paid acquisition a war.
- Vibe-coding isn't dead as a market but is closed to a new horizontal entrant; vertical builders (e.g., for a specific profession's internal tools) or "builder inside a distribution platform" remain possible.

### Gaps
- No hard 2026 data found on AI resume tools, AI writing tools (Jasper etc.), or AI headshot startup revenues/closures.
- No authoritative competitor counts per category (CB Insights market maps not accessed).

## 4. Which startups/categories were killed or hurt by platform features in 2025–2026?

### Takeaway
The clearest 2025–26 "platform killed it" events: Claude Cowork plugins (Jan–Feb 2026) hit public SaaS/legal-tech valuations (~$285B); Google's Nano Banana (Aug 2025) commoditized headshot/photo-edit apps; native meeting notes in Meet/Zoom/Teams/ChatGPT pressure note-takers; ChatGPT personal finance preview (May 2026) threatens finance-assistant apps. Notably, platforms themselves also retreated (Sora, Atlas, Instant Checkout), showing that platform launches don't always stick — some categories (AI video tooling, agentic commerce) got more room after giants exited.

### Cited Findings
- Claude Cowork + 11 plugins → S&P Software & Services -25% (Jan 12–Feb 23, 2026), legal tech and SaaS hit — [The Batch](https://www.deeplearning.ai/the-batch/claude-cowork-plugins-trigger-a-saas-stock-selloff-but-partnerships-lead-to-slight-rebound); [TechStartups](https://techstartups.com/2026/02/05/anthropics-claude-plugins-spark-285-billion-software-stock-selloff-as-ai-targets-entire-saas-workflows/)
- May 2026: OpenAI previewed a personal-finance experience in ChatGPT letting Pro users connect bank, card and investment accounts [secondary] — [Medium/AI Empire Media](https://medium.com/@aiempiremedia/the-real-reason-ai-startups-are-failing-in-2026-30a4cc9fd140)
- Earlier template: Nov 2023 file-upload made "ChatGPT for PDFs" startups obsolete; OpenAI's cadence (GPT Store, Operator, Tasks, Canvas, Search) cannibalized many wrappers [secondary; "200 startups" figure unverified] — [same source](https://medium.com/@aiempiremedia/the-real-reason-ai-startups-are-failing-in-2026-30a4cc9fd140); [LinkedIn/Pete Sena](https://www.linkedin.com/posts/petersena_openai-just-killed-your-startup-chatgpt-activity-7336376329879121922-s3jF)
- Platform retreats: Sora (shut 2026) — [Bloomberg](https://www.bloomberg.com/news/articles/2026-03-24/openai-plans-to-discontinue-support-for-sora-ai-video-generator); Atlas (Aug 2026) — [TechCrunch](https://techcrunch.com/2026/07/09/openai-is-shutting-down-atlas-but-its-ai-browser-ambitions-are-still-growing/); Instant Checkout (sunset ~Mar 2026) [secondary] — [Laioutr](https://www.laioutr.com/en/blog/chatgpt-instant-checkout-merchant-adoption-agentic-readiness-2026)
- Failure is concentrated in horizontal thin wrappers rather than vertical AI with proprietary data [opinion] — [Medium/AI Empire Media](https://medium.com/@aiempiremedia/the-real-reason-ai-startups-are-failing-in-2026-30a4cc9fd140); [Value Add VC](https://valueaddvc.com/blog/why-most-ai-startups-are-building-features-not-companies)

### Inferences
- Rule of thumb for a late-2026 entrant: if the product is one prompt + one integration a general assistant already has (email, calendar, docs, meetings, browser), assume it ships natively within 6–12 months.
- Defensible zones: regulated/vertical workflows (healthcare, legal-adjacent SMB, finance ops, public sector), non-English/local markets giants under-serve, outcome-priced services with human-in-the-loop, and products that own a data loop or a system of record.
- Giants' retreats (video app, AI browser, in-chat checkout) show consumer standalone surfaces are hard even for them; favor B2B workflow depth over consumer novelty.

### Gaps
- No verified list of named startups that shut down specifically due to a 2025–26 platform feature (HN/TechCrunch post-mortems not located in this pass); VentureCurator's analysis of startup deaths after model releases was blocked by network egress.
- Personal-finance ChatGPT preview (May 2026) not confirmed from an OpenAI primary source.
