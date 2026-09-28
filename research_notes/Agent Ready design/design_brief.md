# Agent-Ready Score: Design Research & Brief (researched 2026-09-28)

> Method note: web search + fetch. **The egress proxy blocked direct fetches of hubspot.com, saasframe.io and b2bgrowthhacking.com**, so findings for those come from search-engine snippets only (flagged "[snippet]"). Items marked "[unverified]" come from general design knowledge and could not be sourced in this session. Anything under "Inferences" is my reasoning, not a sourced fact.

---

## Q1. Design patterns of best-in-class 2025–2026 US SaaS/AI landing pages

### Takeaway
The dominant 2026 pattern is "the product is the demo": a short, direct headline, a single primary CTA, a logo row right under the hero, and real product UI (not illustrations) in place of hero art. Dev-tool brands (Linear, Vercel, Stripe) use dark, near-black canvases with Inter/Geist-style grotesks. AI tools aimed at consumers or non-developers (Granola) use warm light canvases with a serif display face and one colored pill CTA.

### Cited Findings
- Linear's 2025–26 homepage is called "arguably the most-copied B2B SaaS site of the year" because it runs the "product is the demo" idea. Its hero headline uses kinetic type that swaps "teams" and "agents" — [SaaSFrame, 10 SaaS Landing Page Trends 2026 [snippet]](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- Linear hero: "The product development system for teams and agents", with the subline "Designed for the AI era". The whole page walks through real product UI in dark mode with "no abstract illustrations or stock dashboard mockups". The customer logo row (Vercel, Cursor, OpenAI…) sits directly under the hero — [SaaSFrame [snippet]](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- Linear uses a dark layout (#08090A), glowing grid lines and minimal type headers. Vercel uses terminal-prompt panels, framework selector cards and deploy timeline logs — [InspoAI, 50 Best SaaS Website Designs 2026](https://www.inspoai.io/blogs/best-saas-website-designs-2026)
- Linear typography: Inter Display for headings and Inter for body text — [Linear, "How we redesigned the Linear UI"](https://linear.app/now/how-we-redesigned-the-linear-ui). Third-party token extractions report Inter Variable with the cv01/ss03 features, a signature 510 weight, the #08090a canvas and a lavender accent (#5e6ad2) — [Refero Styles](https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1); [shadcn.io Linear design](https://www.shadcn.io/design/linear) (third-party extractions, not official)
- Vercel's Geist (Sans/Mono/Pixel) was built with Basement Studio, drawing on Swiss typography. It is free on Google Fonts and had 1.5M+ downloads within weeks — [Vercel Geist](https://vercel.com/font); [Google Fonts Geist](https://fonts.google.com/specimen/Geist)
- Granola hero: a 68px serif-flavored display headline ("The AI notepad for people in back-to-back meetings") in near-black on a warm cream canvas, one olive-green pill CTA ("Download for Mac"), cropped photos of people at the edges, and body-copy verbs marked with a yellow highlighter — [SaaSFrame [snippet]](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples); [shadcn.io Granola: "oat green on warm cream, Quadrant + Melange"](https://www.shadcn.io/design/granola)
- "Developer-focused tools — Linear, Vercel, Stripe — use dark backgrounds, monospace typefaces, and terminal aesthetics." Typography is moving from static to motion-driven — [InspoAI](https://www.inspoai.io/blogs/best-saas-website-designs-2026)
- Bento grids: the claim is that "67% of the top 100 SaaS websites on Product Hunt use bento grids", correlated with +47% dwell time and +38% CTR — [InspoAI](https://www.inspoai.io/blogs/best-saas-website-designs-2026) (**the methodology is not disclosed; treat as weak evidence**)
- The highest-converting pages lead with "real product screenshots, polished UI visuals, and interactive previews" rather than abstract illustration or stock photos — [InspoAI](https://www.inspoai.io/blogs/best-saas-website-designs-2026); [Framiq](https://framiq.app/blog/best-saas-landing-pages-2026)

### Inferences
- Pattern to borrow: hero = one-line promise + the input form itself (the tool is the demo), then a logo/proof strip, then a sample result, then a bento of "what we check".
- Dark "dev-tool" styling signals "built for engineers". For salon owners, the warm, light Granola-style direction fits better. A dark results "report" mode could still work well for agencies.
- The Linear-style kinetic word swap maps directly to "ChatGPT / Gemini / Perplexity / Siri" rotating in the headline.

### Gaps
- I could not verify first-hand the current hero copy or fonts for Stripe (believed to be Söhne) [unverified], Raycast, Perplexity (believed to be FK Grotesk) [unverified], Lovable, Gamma, Profound, Clay, Attio or Framer templates. The fetches were blocked or returned nothing relevant.
- I found no rigorous A/B data tying specific fonts or colors to conversion.

---

## Q2. Free grader / scan tools that drove lead gen: form, progress, results, gauge, gate

### Takeaway
The archetype is HubSpot Website Grader: URL + email in, a 0–100 score plus fixes out. It is credited with 4M+ sites graded, "10M+ leads" (secondary claim) and 40k backlinks. The 2025–26 generation (HubSpot AI Search Grader, Semrush, Ahrefs) mostly shows a teaser or basic result without signup. They gate the *full* report or *repeat* use (email, account, or a 3-per-day limit).

### Cited Findings
- HubSpot Website Grader launched in 2006 and graded more than 4M sites by the time it became Marketing Grader. It produced a 0–100 score and was built "to generate buzz, organic/viral traffic, inbound links and leads" — [Demand Gen Report](https://www.demandgenreport.com/industry-news/hubspot-launches-marketing-grader-tool-after-grading-4-million-web-sites-2/20329/); [HubSpot blog: 1M URLs](https://www.hubspot.com/blog/bid/4834/website-grader-evaluates-over-1-million-urls); [2M sites](https://www.hubspot.com/blog/bid/5539/website-grader-analyzes-over-2-million-sites)
- Claims that the tool "generated over 10 million leads" and "40,000+ organic backlinks from users sharing their scores" — [Outgrow case study](https://outgrow.co/blog/hubspot-website-grader-case-study); [figuringoutwithai [snippet]](https://www.figuringoutwithai.com/growth/free-tool-seo-hubspot-website-grader) (**secondary marketing sources; HubSpot has not confirmed these figures**)
- HubSpot AI Search Grader (2025–26): marketed as "Free One-Time AEO Brand Check, No Account Required". Inputs are brand name, website, industry and target-buyer description. It takes about 2–3 minutes and returns a score out of 100 across five dimensions, with written interpretation, "by email and on screen". An email is required for the full report — [HubSpot AI Search Grader [snippet, fetch blocked]](https://www.hubspot.com/ai-search-grader); [techunit.io](https://techunit.io/blog/hubspot-ai-search-grader); [xcellimark](https://www.xcellimark.com/how-to-hubspot/how-to-use-hubspots-ai-search-grader-to-boost-visibility-in-ai-searches)
- Semrush Website Authority Checker: 3 free checks per day, then free-account registration — [Semrush free tool](https://www.semrush.com/free-tools/website-authority-checker/) (search snippet)
- Ahrefs Website Authority Checker: no registration for basic lookups (DR, backlinks, referring domains). Deeper audits go through "Ahrefs Webmaster Tools / Free" with verified projects — [Ahrefs](https://ahrefs.com/website-authority-checker); [Ahrefs website checker](https://ahrefs.com/website-checker)
- Google Lighthouse/PageSpeed gauge convention: 0–49 red "Poor", 50–89 orange "Needs improvement", 90–100 green "Good". Google notes that 100 is "extremely challenging" and not expected — [Chrome for Developers, Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- Mozilla HTTP Observatory: letter grade A+ to F plus specific fix recommendations. The score starts at a 100 baseline with penalties and bonuses (max 145) — [MDN Observatory FAQ](https://developer.mozilla.org/en-US/observatory/docs/faq); [Observatory tests & scoring](https://rari-pr529.review.mdn.allizom.net/en-US/observatory/docs/tests_and_scoring)
- GEO tools (Otterly from $29/mo, Peec mid-market, Profound enterprise) are paid dashboards. Free entry points in the category are HubSpot AEO Grader, Semrush's free AI visibility checker and Mangools AI Search Grader — [Frase](https://www.frase.io/blog/the-10-best-ai-visibility-tools-in-2026); [Discovered Labs](https://discoveredlabs.com/blog/profound-vs-peec-vs-otterly-which-ai-visibility-platform-should-you-buy); [Trustmary](https://trustmary.com/ai-visibility/best-ai-search-visibility-tools/)
- Gate benchmarks: gated pages convert 40–80% of warm traffic and 10–20% of cold traffic. But "a 10% conversion rate on ungated content that reaches 10,000 people … might generate 200 leads" versus 40 from a gated page with 100 visitors. The recommended model is hybrid: ungated for reach and SEO, gated for depth — [OptinMonster](https://optinmonster.com/gated-content-marketing-strategy/); [digitalapplied benchmarks 2026](https://www.digitalapplied.com/blog/lead-magnet-conversion-benchmarks-2026-b2b-data-reference); [Abstrakt](https://www.abstraktmg.com/gated-vs-ungated-content-lead-generation/)

### Inferences
- Recommended gate: **score + top 3 issues ungated. The full fix list, PDF, re-scan alerts and "generate my fixes" require email.** This matches the 2025–26 norm (HubSpot AI grader, Semrush) and protects shareability, since a public score URL can go viral.
- A scan of 20–60 s needs a *narrated* progress screen ("Asking ChatGPT about Salon X in Austin…", "Checking your booking link…") that turns waiting into a demo. HubSpot's 2–3 min wait is tolerated because it shows AI engines being queried.
- Use the familiar red/orange/green bands, but with friendlier labels. A letter grade (Observatory-style) is easier to share than a number.

### Gaps
- I could not view the live HubSpot AI Search Grader UI (blocked), so the progress screen, gauge style and share card are not described first-hand.
- I found no public A/B test comparing email-before-results with email-after-results for a grader tool specifically.

---

## Q3. Shareable score cards and viral mechanics

### Takeaway
Sharing is driven by (a) a personal, identity-flattering or competitive stat, (b) a pre-rendered branded image in portrait and OG sizes, (c) one-tap share with prefilled copy, and (d) embeddable badges that create backlinks (Website Grader, Shields.io Observatory badges).

### Cited Findings
- Spotify Wrapped 2025: about 200M engaged users in 24h and about 500M shares (+41%), helped by new comparison ("multiplayer") features. The 2024 campaign coincided with a record 11M new Premium subscribers — [growth-academy](https://www.growth-academy.com/spotifys-growth-hack-of-the-decade); [Spotify newsroom 2025 Wrapped](https://newsroom.spotify.com/2025-12-03/wrapped-for-artists-songwriters-creators-authors-advertisers/) (the share figures are secondary)
- Share-card best practice: brand every image for attribution, prefill share text with a hook, enable one-tap sharing to IG Stories/X/LinkedIn. Common export size is 1080×1350 PNG — [Trophy, How to build a Wrapped feature](https://trophy.so/blog/how-to-build-wrapped-feature); [GitHub example PR](https://github.com/rynbhuiya/spotify-dashboard/pull/5)
- Website Grader's viral loop was users posting their scores on blogs and forums, producing about 40k backlinks (secondary claim) — [figuringoutwithai [snippet]](https://www.figuringoutwithai.com/growth/free-tool-seo-hubspot-website-grader)
- Grade badges as a distribution channel: Shields.io offers a Mozilla Observatory grade badge that developers embed in READMEs — [Shields.io](https://shields.io/badges/mozilla-http-observatory-grade)
- Birdeye markets to "200,000+ local businesses" and sells review-site badges for websites. Badge and widget embeds are a norm local SMBs already understand — [Birdeye small business](https://birdeye.com/small-business/)

### Inferences
- A salon owner probably won't share "I scored 42". They will share "Top 3 most AI-ready salons in Austin" or a certified badge. Build **positive-only public artifacts**: an "Agent-Ready Certified" badge (score ≥ 80) and a city leaderboard ("Most AI-bookable salons in Austin, TX") that shows only opted-in or top scorers. Low scores stay private.
- City leaderboards double as programmatic SEO pages (/salons/austin-tx) and as a hook for agency outreach ("your client is #14 of 60").
- Comparison ("see how you stack up vs 3 nearby salons") is the Wrapped "multiplayer" lever and the strongest motivator for SMBs.
- OG image: dynamic, per result, 1200×630, with score dial + business name + city + the three AI logos (check trademark use; prefer text names).

### Gaps
- I found no documented case study of "best X in city" leaderboards driving growth for a grader tool. The leaderboard-tool search returned only widget vendors.

---

## Q4. Designing for SMB owners (salons, non-technical, mobile-first)

### Takeaway
Salon software sells outcomes in everyday words ("get booked & paid"), leads with free, and backs claims with big customer counts and review ratings. Local-business audiences are mostly on mobile.

### Cited Findings
- GlossGenius positioning: "THE EASIEST WAY TO GET BOOKED & PAID". The "Get booked 24/7" campaign — [GlossGenius search snippet](https://glossgenius.com/for-solo-professionals); [YouTube: Get booked 24/7 with GlossGenius](https://www.youtube.com/watch?v=z_pFI72hJM8)
- Price is itself a headline: Fresha core software $0/month, Square Appointments free for a solo at one location, Vagaro from a low flat fee — [thelocalgem 2026 comparison](https://www.thelocalgem.com/blog/square-vs-vagaro-vs-glossgenius-vs-fresha-2026-salon-pick); [The Salon Business Fresha review](https://thesalonbusiness.com/fresha-review/)
- Trust signals: Birdeye leads with "trusted by 200,000+ local businesses" and "highest-rated" claims — [Birdeye](https://birdeye.com/small-business/)
- Local-business audiences (restaurants, services, retail) are said to be 70–80% mobile, and about 60% of mobile users have contacted a business straight from search results — [DesignRush mobile stats](https://www.designrush.com/agency/search-engine-optimization/trends/mobile-traffic-statistics) (aggregator; directional)
- 91% of US adults own a smartphone — [same source / Pew via aggregator](https://www.designrush.com/agency/search-engine-optimization/trends/mobile-traffic-statistics)

### Inferences
- Write in outcome words, not tech words. Say "Can ChatGPT book you?", not "JSON-LD / llms.txt". Keep technical terms behind a "For your web person" toggle or in the agency view.
- Target roughly a 6th–8th grade reading level, short sentences, second person, and money framing ("clients you're missing").
- Trust for salons: faces of real stylists, "No credit card, no login", "We only read your public website", an estimated time ("takes 30 seconds"), plus a privacy line.
- Every CTA must be thumb-reachable on a 375px screen, the form must fit above the fold on mobile, and the results page should use a sticky bottom CTA bar.

### Gaps
- Verbatim current homepage copy for Square, Fresha, Vagaro and Podium was not retrievable in this session.
- I found no source giving the reading level of SMB SaaS copy; the grade-level target above is a recommendation.

---

## Q5. Accessibility and performance guardrails for 3D and motion

### Takeaway
3D must never be the LCP element or block first paint. Lazy-mount it, pause it when offscreen, provide a static poster, and honor `prefers-reduced-motion` plus an on-page pause control (WCAG 2.2.2 requires the on-page control; the media query only satisfies 2.3.3).

### Cited Findings
- WCAG 2.2.2 Pause, Stop, Hide (Level A): content that moves automatically for more than 5 s needs an on-page mechanism to pause, stop or hide it — [W3C Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). `prefers-reduced-motion` is a sufficient technique for 2.3.3 (AAA) but is not mentioned for 2.2.2 — [w3c/wcag issue #3766](https://github.com/w3c/wcag/issues/3766); [Deque 2.3.3](https://dequeuniversity.com/resources/wcag2.1/2.3.3-animations-from-interactions)
- Keep LCP under 2.5 s. A heavy .glb blocks the main thread and hurts LCP and INP. Lazy-load the canvas, decode models off the critical path, never let WebGL block first paint, and always provide a poster or CSS fallback — [utsubo, 100 Three.js tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips); [Digital Strategy Force](https://digitalstrategyforce.com/journal/how-do-you-optimize-threejs-performance-for-mobile-devices/)
- Spline in Next.js mainly threatens LCP and main-thread time. The fixes: a loader driven by real signals, lazy mounting below the fold, and pausing offscreen loops. An IntersectionObserver that cancels rAF was "the biggest single performance win" — [Dinimiciuil Labs](https://dinimiciuillabs.com/blog/spline-nextjs-performance)
- Reduced motion for 3D: render one static frame and stop the loop. Claim that about 27% of users rely on reduced-motion settings — [utsubo](https://www.utsubo.com/blog/threejs-best-practices-100-tips) (**the 27% figure is unverified; its original source is not cited**)

### Inferences
- The hero LCP element should be the headline text (a system/Google font with `font-display: swap`, preloaded), not the canvas.
- Budget: 3D bundle ≤ 150 KB gz (three.js core tree-shaken, or OGL/vanilla WebGL), DPR capped at 1.5–2, no postprocessing on mobile, and no Spline runtime (it is heavy) in the hero.

### Gaps
- I found no authoritative dataset on the share of users with reduced motion enabled.

---

## Q6. Design brief for Agent-Ready Score (synthesis: recommendations, not sourced facts)

### Takeaway
Use a warm, light, trustworthy "beauty-adjacent" canvas (the Granola direction) with one confident accent. The tool form is the hero. The score is the shareable artifact. 3D appears in one place only, as a lightweight "agent-readiness orb/dial" that visualizes the score, never as decoration.

### Cited Findings
- Findings supporting this brief are cited in Q1–Q5 above. The specific values below are my design recommendations.

### Inferences

#### Palette (light-first; dark mode tokens included)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FBF8F4` (warm cream) | `#0E0D12` | page |
| `--surface` | `#FFFFFF` | `#17161D` | cards |
| `--ink` | `#16141A` | `#F4F1EC` | text |
| `--muted` | `#6B6573` | `#A39DAB` | secondary text (≥4.5:1 on bg) |
| `--line` | `#E9E3DA` | `#2A2833` | borders |
| `--accent` | `#5B3DF5` (electric violet: "AI") | `#8B78FF` | primary CTA, links |
| `--accent-2` | `#FF6A3D` (warm coral: "salon") | `#FF8A66` | highlights, highlighter marks |
| `--good` | `#12A150` | `#34D07A` | score 80–100 |
| `--ok` | `#E8A200` | `#F5C046` | score 50–79 |
| `--bad` | `#E5484D` | `#FF6B6F` | score 0–49 |
Score bands mirror Lighthouse's red/orange/green so the scale reads instantly, with friendlier labels: 0–49 "Invisible to AI", 50–79 "Partly visible", 80–100 "Agent-ready". Check that white text on `#5B3DF5` reaches ≥4.5:1 (it should be about 6:1; verify in tooling).

#### Fonts (all on Google Fonts)
- Display: **Instrument Serif** (warm editorial, Granola-like), used only for the headline and the score number. Alternative: **Fraunces**.
- UI/body: **Geist** (Vercel's font, free on Google Fonts) or **Inter**. Pick one.
- Mono (code previews for JSON-LD/llms.txt, agency view): **Geist Mono**.
- Load at most 2 families and 4 weights, preload the display font, `font-display: swap`.

#### Page sections, in order
1. **Nav**: logo, "For agencies", "Pricing", "Sign in"; the right-side button is "Check my salon".
2. **Hero** (the form is the hero): headline + one-line sub + a 3-field form (Website, Business name, City with autocomplete), CTA, and a trust microline below. On the right (desktop) or below (mobile) sits the 3D score orb idling at a sample score.
3. **Proof strip**: "X salons scanned this week" (live counter), plus agency logos or the ratings once they exist.
4. **"What AI sees" demo**: side-by-side chat mockups of a ChatGPT/Perplexity-style answer (use generic chat UI, not their branding) for "best balayage near me in Austin", comparing a salon that gets recommended and booked with one that doesn't.
5. **What we check** (bento, 6 tiles): Found (name/address/hours consistent), Understood (services & prices readable), Trusted (reviews, schema), Bookable (booking link that agents can use), Fresh (updated info), Allowed (robots/llms.txt).
6. **Sample report** preview (blurred lower half) → CTA.
7. **How it works**: 3 steps (Scan → See fixes → We fix it for you).
8. **Pricing** teaser: Free scan / Fix pack / Agency.
9. **For agencies** band: white-label, bulk CSV scans, client leaderboard.
10. **City leaderboard** teaser: "Most AI-ready salons in [City]".
11. **FAQ** (plain language: "What is llms.txt? Do I need a developer?").
12. **Final CTA** + footer.

#### Hero copy options
- A: **"When clients ask ChatGPT for a salon, do they find you?"** Sub: "Get your free Agent-Ready Score in 30 seconds. See exactly what AI assistants know about your salon, and what to fix."
- B: **"Can AI book your salon?"** (rotating word: ChatGPT / Gemini / Perplexity / Siri) Sub: "Your free score out of 100, plus the top fixes, in plain English."
- C: **"Your next client is asking an AI. Make sure it says your name."**
- D (agency variant): **"Show every client their AI score. Sell the fix."**

#### CTA microcopy
- Primary: "Check my salon, free" / "Get my score"
- Under-button trust line: "Free · No login · 30 seconds · We only read your public site"
- Progress: "Reading your website…" → "Asking AI about salons in {City}…" → "Checking if clients can book you…" → "Scoring 24 checks…"
- Email gate (after the score): "Send me the full fix list" (field: email) with "Plus a free re-check in 30 days. No spam."
- Upsell: "Fix it for me" / "Generate my fixes: $X one-time"
- Share: "Share my score" / "Add the Agent-Ready badge to my site" / "Compare with salons nearby"
- Agency: "Scan all my clients" / "Try white-label free"

#### Results page anatomy
1. **Header card**: business name, city, date; a big dial (score /100 + band label + letter grade A–F); one sentence: "ChatGPT can find you, but can't book you."
2. **Four sub-scores** as horizontal bars: Found · Understood · Trusted · Bookable.
3. **"What AI says about you right now"**: a quoted real answer snippet from one or more engines (clearly labeled with the timestamp).
4. **Top 3 fixes** (ungated), each with impact tag (High/Med), effort ("5 min" / "Needs web person"), plain-English why, and a "Show technical details" disclosure (code in Geist Mono).
5. **Neighbor comparison**: "You rank #7 of 23 salons scanned in Austin" (only aggregated or opted-in data).
6. **Email gate** for the full list (remaining fixes blurred), PDF, and re-scan alert.
7. **Upsell card**: "We'll generate all fixes for you" with a before→after score projection ("42 → 88 est.").
8. **Share row**: download card (1080×1350 + 1200×630 OG), copy link, badge embed (only if ≥80).
9. **Sticky mobile bottom bar**: "Fix it for me".
The public result URL gets a dynamic OG image.

#### 3D element concept
- **"The Readiness Orb"**: a single glass/iridescent sphere (or ring dial) made of 100 small facets/particles. Facets light up in the band color up to the score; unlit facets stay frosted. On the landing page it idles at a sample score and slowly rotates. On the results page it animates from 0 to the user's score (≤1.5 s), then settles. The same visual is rendered server-side as a static PNG for the share card and OG image, so the 3D *is* the brand's share asset.
- Why: it encodes the one number that matters, gives the scan a memorable "reveal" moment (the Wrapped effect), and stays reusable in 2D.
- Implementation: vanilla three.js or OGL with instanced meshes, no model file, DPR ≤ 2, loaded after first paint via `requestIdleCallback`/IntersectionObserver. Static SVG dial as the SSR fallback and LCP-safe placeholder. Under `prefers-reduced-motion`, show the static final frame. Provide a visible pause toggle if the idle animation runs longer than 5 s. Skip WebGL on low-end devices (`navigator.hardwareConcurrency <= 4` or no WebGL2) and use the SVG dial.
- Where 3D hurts: behind text (hurts legibility), as the LCP element, as scroll-jacking, or when it loads a Spline runtime or .glb models on mobile.

#### Anti-patterns to avoid
- Asking for the email *before* showing any score (it kills sharing and trust with SMBs). Also avoid requiring account creation to see results.
- Jargon in primary copy (schema, JSON-LD, llms.txt, GEO/AEO) instead of outcomes.
- Public shaming: showing low scores on public leaderboards without consent.
- Dark dev-tool aesthetic plus monospace everywhere, which reads as "not for me" to salon owners.
- Fake precision or fake live-AI claims. Label AI answers with time and engine, and say scores are estimates.
- Using OpenAI/Google/Perplexity logos or brand colors in a way that implies endorsement.
- Heavy 3D in the hero on mobile, autoplaying motion with no pause control, or ignoring reduced-motion settings.
- Scan spinners with no narration, and scans slower than about 60 s without an "email me the result" fallback.
- More than one primary CTA per viewport; tiny tap targets (<44px).

### Gaps
- Color contrast values have not been machine-checked; run the palette through a contrast checker before shipping.
- The brief has not been validated with salon-owner user testing; recommend 5 quick hallway tests of hero copy options A–C.
