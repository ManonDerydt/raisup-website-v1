# Substitutes, platform risk and demand for "document -> embeddable interactive tool" products (as of Sept 2026, global)

Research date: 2026-09-28. Method: web search (~20 calls). **Blocked by proxy:** wordpress.org (plugin pages and plugins API), outgrow.co. For those, figures come from search snippets / third-party pages and are flagged. Reddit was not reachable through search in any useful way (no relevant threads surfaced); Hacker News titles were found via search only.

## (a1) Can general AI builders (Claude artifacts, ChatGPT canvas, Gemini canvas, Lovable, Bolt, v0, Base44, Replit) already do this well enough, including hosting, embed, CRM and analytics?

### Takeaway
Generating the calculator or quiz UI from a prompt is now commoditised. Every major AI builder can do it in minutes. What they still lack out of the box is the "last mile" for a non-technical SMB: parsing a messy price list reliably, stable embedding on the customer's own site, lead storage and routing to a CRM, analytics, and non-technical editing when prices change. Full-stack builders (Lovable, Base44, Replit) can cover that last mile but need prompting skill and produce a separate app rather than a managed widget. Chat-canvas tools (ChatGPT, Gemini) are weakest at publishing and embedding.

### Cited Findings
- Claude artifacts are self-contained HTML that run in any browser without a Claude account. A marketer guide calls a quiz-style landing page "the single best fit for an HTML artifact" and says Claude can build lead-capture forms. For a working form it still recommends wiring up Typeform, Tally, Formspree or webhooks, so there is no native lead backend. — [Masset, Claude Artifacts for Marketers 2026](https://www.getmasset.com/resources/claude-artifacts-for-marketers); [ShareDuo](https://www.shareduo.com/blog/claude-artifact-examples)
- A third-party claim (unverified): "millions of users have created over half a billion artifacts". — [ShareDuo](https://www.shareduo.com/blog/claude-artifact-examples)
- ChatGPT Canvas "has no publish-to-web feature". Gemini Canvas sharing gives a g.co link that opens only inside Gemini, cannot be updated, and lets anyone copy the source. Exports do not sync later edits. A cottage industry now exists to host canvas output (e.g., GeminiLaunch). — [Unmarkdown blog](https://unmarkdown.com/blog/claude-artifacts-vs-chatgpt-canvas); [Drafty guide](https://drafty.im/guide/what-is-gemini-canvas); [GeminiLaunch](https://www.geminilaunch.com/blogs/turn-gemini-canvas-into-website)
- Lovable: reportedly more than $400M ARR in Feb 2026, about 8M users and about 100k new projects per day. It passed $100M ARR within 8 months of launch (mid-2025). About 63% of vibe-coding users are non-developers. These are aggregator figures, not primary sources. — [Sorceress.games](https://sorceress.games/blog/lovable-vibe-coding-revenue-400m-arr-but-not-for-games); [Panto stats](https://www.getpanto.ai/blog/lovable-statistics); [Taskade](https://www.taskade.com/blog/state-of-vibe-coding)
- Lovable and Bolt.new are "the most consistently recommended tools in 2026" for small-business owners without coding skills. Vibe-coded sites carry "real limitations around SEO, security, and maintenance". — [Lorphic](https://lorphic.com/vibe-coding/)
- A skool community post frames the split as Claude Artifact = prototype space and Lovable = launching real products with users and payments. — [Skool Scale Camp](https://www.skool.com/skool-scale-camp/do-you-know-the-difference-between-a-claude-artifact-and-a-lovable-build)
- Base44 was acquired by Wix for about $80M in June 2025. It generates frontend, backend, DB, auth, hosting and email/SMS from natural language. Reported 2M users and $100M ARR by Q1 2026 (secondary source). It is also listed as a Wix App Market app, and Wix says it has "smart site detection" based on installed Wix apps. — [Wix press release](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif); [WeavAI review May 2026](https://weavai.app/blog/en/2026/05/08/base44-review-2026-wix-80m-ai-app-builder-pricing/); [Wix App Market – Base44](https://www.wix.com/app-market/base44)
- Base44 is reportedly building its own AI model. — [Calcalist Ctech](https://www.calcalistech.com/ctechnews/article/bjf0qgx7mg)

### Inferences
- Pure "prompt to calculator UI" is not defensible. Any SMB with ChatGPT/Claude can get a working calculator for free. Defensibility must come from: (1) document ingestion with structured pricing extraction and validation (formulas, tiers, options, min/max, taxes); (2) managed hosting plus one-line embed that survives edits; (3) lead capture, routing to CRM, email and webhooks; (4) analytics and A/B testing; (5) non-technical owners being able to update prices (re-upload the document) without re-prompting and breaking things; (6) trust and accuracy guarantees on quoted prices.
- Wix plus Base44 is the most direct platform threat. Wix owns the SMB website, the form/CRM stack (Wix Forms, Contacts) and an AI app generator, so a "describe your calculator" flow inside Wix is a short step. No announcement of such a specific feature was found.
- Claude artifacts and Gemini canvas are moving toward shareable apps. Any move by Anthropic, OpenAI or Google to add hosted forms, data persistence and embed would compress the low end.

### Gaps
- No evidence found (Reddit blocked or unsurfaced) of how many SMBs actually use Lovable, Bolt or Claude for production embeddable calculators with lead capture. It is anecdotally plausible but unquantified.
- v0, Bolt and Replit specifics on embeddable widgets and lead capture were not researched in depth.
- Current (Sept 2026) state of Claude artifact persistence/storage and ChatGPT "apps" publishing was not verified from primary sources.

## (a2) Do website builders, form plugins and marketing platforms ship native or AI "generate a calculator/quiz" features?

### Takeaway
Yes, and increasingly with AI. Framer Workshop (May 2025) explicitly generates "pricing calculators, multi-step forms, interactive quizzes" from a prompt. Calculated Fields Form now brands itself an "AI Form Builder … Quote, Quiz". involve.me has an AI formula generator. Outgrow can generate projects from a URL or a Document/PDF, which is essentially the proposed product's core promise. HubSpot's AI goes into sales quotes and CPQ, not website calculators. Squarespace and Webflow have no calculator-specific AI features found.

### Cited Findings
- **Framer Workshop** launched on May 21, 2025. It is an AI assistant that generates custom components from descriptions, including "pricing calculators, multi-step forms, interactive quizzes". — [Framer Marketplace – Workshop](https://www.framer.com/marketplace/plugins/workshop/); [oma-kase 2026](https://www.oma-kase.com/blog/framer-ai-workshop-plugin)
- **Webflow** shipped a native Claude connector (Feb 2026) and Webflow AEO (Apr 2026). **Squarespace** Blueprint AI generates sites from a questionnaire. Neither showed a calculator-specific generator in results. — [Flow Ninja](https://www.flowninja.com/blog/framer-alternatives)
- **Outgrow (direct competitor)** offers AI content generation "to generate projects with AI including URL, Document/PDF, Contextual, Prompt-driven, or Chat". Pricing is $14/mo (annual) up to $95 Essentials and $600 Business. Source is a snippet from involve.me, a competitor; outgrow.co is blocked. — [involve.me: best Outgrow alternative](https://www.involve.me/blog/best-outgrow-alternative)
- **involve.me** has an "AI Formula Generator" that creates calculator formulas from a text prompt. Free plan: 500 visits or 50 submissions/mo. Paid from $19/mo annual, $49 for branding removal, $119 advanced. — [involve.me AI Formula Generator](https://www.involve.me/features/ai-formula-generator); [involve.me best Outgrow alternative](https://www.involve.me/blog/best-outgrow-alternative)
- **WordPress** (wordpress.org blocked; figures via search snippets):
  - Calculated Fields Form: 40,000+ active installs (Aug 14, 2026), 4.9/5 with about 960 reviews. It now titles itself "AI Form Builder for WordPress – Contact, Payment, Quote, Quiz & More". — [WordPress.org listing (via search)](https://wordpress.org/plugins/calculated-fields-form/); [WordPress.com mirror](https://wordpress.com/plugins/calculated-fields-form)
  - Cost Calculator Builder: 20,000+ active installs (Aug 28, 2026). — [WordPress.org (via search)](https://wordpress.org/plugins/cost-calculator-builder/)
  - Formidable Forms: 300K+ installs, 4.8/5. WPForms: 6M+. Gravity Forms: "5M+". Gravity Forms is a premium plugin not on wp.org, so its number is vendor/third-party claimed. Contact Form 7: 10M+. These are third-party comparison figures. — [Oddjar 2026 comparison](https://oddjar.com/wordpress-form-plugins-2026-comparison/); [Smarta Studio](https://www.smartastudio.com/compare/wordpress-form-plugins/formidable-forms-vs-gravity-forms)
  - Formidable (a vendor) publishes a "7 Best Cost Calculator WordPress Plugins [2026]" list, which shows calculator SEO is contested by the form giants. — [Formidable Forms](https://formidableforms.com/best-cost-calculator-plugin-wordpress/)
  - A dedicated "Cost Calculator for WPForms" add-on exists. — [WordPress.com](https://wordpress.com/plugins/cost-calculator-for-wpforms)
- **Shopify**: there is a fragmented long tail of price-calculator and configurator apps with small review counts. Examples: M Custom Size Price Calculator (19 reviews, 5.0), CALCIFY ($149/mo, 0 reviews), plus SE Option Price Calculator, SU Calculator & Configurator and Ex Custom Price Calculator (area, volume, length pricing). — [Shopify App Store – M Custom Size](https://apps.shopify.com/custom-size-price-calculator); [CALCIFY](https://apps.shopify.com/price-calculator); [SU Calculator](https://apps.shopify.com/configure-measure-quotes); [Ex Custom Price Calculator](https://apps.shopify.com/measurement-price-calculator)
- **HubSpot**: Breeze AI generates sales quotes from deal data and CPQ offers interactive web quotes with e-signature. A "Closing Agent" chatbot answers buyer questions on quotes. This is sales-side quoting, not a public website calculator. HubSpot itself uses interactive ROI calculators as marketing (Breeze ROI calculator). — [HubSpot KB: Generate quotes with Breeze](https://knowledge.hubspot.com/ai/generate-quotes-with-breeze-assistant); [HubSpot AI quoting](https://www.hubspot.com/products/artificial-intelligence/use-cases/sales-create-quotes-and-close-deals); [HubSpot Breeze ROI calculator](https://hubspot.com/breeze-roi-calculator/customer-agent)

### Inferences
- The exact "upload PDF/document -> interactive tool" pitch is already claimed by Outgrow (Document/PDF generation). The idea is not novel, so differentiation must come from quality of extraction (complex price grids), vertical templates, price, language/market (e.g., French/EU SMBs) or the end-to-end lead workflow.
- Framer Workshop plus Calculated Fields Form "AI" show incumbents adding AI generation as a feature. Standalone players risk being "a feature, not a product" on platforms where the site already lives (Wix, Framer, WordPress).
- Shopify's calculator market is fragmented and small by reviews. That points to a niche need (made-to-measure products), not a mass market.

### Gaps
- Exact wordpress.org install and review counts could not be verified directly (blocked).
- No confirmed Wix-native "AI calculator" feature, Canva, Notion or Gamma calculator generator was found. Canva, Notion and Gamma were not specifically searched (time budget).
- HubSpot's AI website/landing-page features (Content Hub) generating calculators were not confirmed.

## (a3) Vertical players with built-in instant estimators

### Takeaway
In high-ticket home services (roofing, solar), vertical specialists own instant-quote widgets. They are deeply integrated with satellite/3D data and field CRMs and are consolidating (Roofle was bought by SalesRabbit, with a QXO page also referencing Roofle). Field-service suites (Housecall Pro, Jobber) embed booking with dynamic pricing. A horizontal "document to calculator" tool is weakest in these verticals and better suited to verticals without a dominant specialist.

### Cited Findings
- Roofle Roof Quote PRO: vendor-reported average lead conversion of 8–10% of form completions, with some contractors above 15% (vendor-biased). Native integrations with about 10 CRMs including Jobber, JobNimbus, AccuLynx and HubSpot. — [Roofle blog](https://blog.roofle.com/best-practices-for-implementing-instant-online-roof-quotes-on-your-website-to-maximize-conversion-rate); [Contractor ToolStack review 2026](https://contractortoolstack.com/software/roofle/)
- Roofle was acquired by SalesRabbit (per 2026 review), and QXO hosts a Roofle page. A crowded field of alternatives exists (RoofD AI, QuoteIQ, MAPQX). — [Contractor ToolStack](https://contractortoolstack.com/software/roofle/); [QXO](https://www.qxo.com/roofle); [RoofD AI](https://www.roofdai.com/roofle-alternative/); [QuoteIQ](https://myquoteiq.com/best-customer-self-quoting-software-roofing-contractors-2026/)
- Aurora Solar Lead Capture AI is an embeddable widget that turns address plus bill into an instant 3D solar estimate. In a vendor case study, one company quadrupled web lead volume in under a month with 25% higher set rates (vendor-biased). Other solar estimator widgets exist (SunLead, MAPQX). — [Aurora Solar](https://aurorasolar.com/resources/capture-high-quality-web-conversions-with-lead-capture-ai/); [SunLead](https://getsunlead.com/)
- Housecall Pro's online booking widget embeds on websites with dynamic pricing that "update[s] instantly based on selected services". Plans from $59/mo. — [Housecall Pro online booking](https://www.housecallpro.com/features/online-booking/); [Housecall Pro pricing](https://www.housecallpro.com/pricing/)
- Jobber offers online request and booking forms. Instant-pricing depth was less clear in results. — [FieldPulse comparison](https://www.fieldpulse.com/resources/blog/housecall-pro-vs-jobber)

### Inferences
- Vertical tools win where the quote needs external data (roof geometry, irradiance) rather than a price list. The proposed product fits best where pricing lives in a document: cleaning, moving, events and catering, printing, agencies, B2B manufacturing options, training, and local services outside field-service suites.

### Gaps
- No data on the share of home-service SMBs actually using instant-quote widgets.
- Moving, cleaning and event-specific estimator vendors were not researched.

## (b1) Evidence that interactive calculators and quizzes improve lead conversion

### Takeaway
Nearly all hard conversion numbers come from vendors (Interact, Outgrow, Roofle, Aurora) and use favourable denominators, such as the lead rate among people who already started the quiz. The only semi-independent evidence is old: the Demand Metric 2014 survey of marketers, which measures self-reported effectiveness, not measured lift. The direction is consistent (interactive beats static) but the magnitudes are inflated.

### Cited Findings
- **Interact (vendor-biased):** 40.1% start-to-lead conversion and 65% start-to-finish for lead-gen quizzes. The figure has been stable since 2013 across more than 80M leads. The denominator is people who clicked "start", a self-selected group. — [Interact Quiz Conversion Rate Report 2026](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)
- **Outgrow 2025 Interactive Content Benchmark (vendor-biased; outgrow.co blocked, via snippet):** more than 50,000 interactive forms, 1,200 client accounts, Oct 2024–Oct 2025. Claims 40–50% conversion rates for interactive forms, "16x higher" than static. The sample is 34% SaaS and 28% B2B services. — [Outgrow blog (snippet)](https://outgrow.co/blog/interactive-forms-lead-generation-2025/)
- **Demand Metric "Enhancing the Buyer's Journey" (analyst firm, sponsored by an interactive-content vendor, ~2014):** 185 B2B/B2C marketers. 70% of interactive-content users said their content converts "moderately/very well" vs 36% for passive. 88% vs 55% said it was effective at differentiation. 38% vs 17% said it was shared frequently. — [PR Newswire](https://www.prnewswire.com/news-releases/new-research-shows-interactive-content-is-key-to-the-buyers-journey-263301861.html); [Upland Kapost](https://uplandsoftware.com/kapost/resources/blog/interactive-content-conversions/)
- **Vertical vendor claims:** Roofle 8–10% form-completion conversion (above 15% for some). Aurora reports 4x web lead volume and +25% set rate in one case. — see (a3) sources.
- **Context baselines (low reliability, aggregator):** B2B SaaS lead conversion is 3–7% and e-commerce 2–5%. — [Count.co](https://count.co/metric/lead-conversion-rate)

### Inferences
- A defensible claim for the product's pitch is "instant quotes and quizzes typically lift lead capture versus static contact forms". Do not quote 40% or 16x without stating that they are vendor figures on self-selected denominators.
- The stronger structural argument is buyer preference (b3), not the conversion benchmarks.

### Gaps
- No independent, controlled study (academic or Forrester/Gartner) measuring conversion lift from website calculators was found.

## (b2) Search demand indicators and trends 2024–2026

### Takeaway
No quantitative search-volume data could be retrieved (Google Trends and keyword tools are not accessible via search snippets). Supply-side proxies show persistent, contested demand: many "best calculator builder 2026" listicles from vendors, recurring Show HN launches of calculator builders (2024–2026), and a long tail of plugins and apps.

### Cited Findings
- Show HN launches of calculator builders: "I made a calculator builder to increase engagement and conversions" (May 2024; the maker noted existing builders were slow, broke on mobile, had "nonsense page view limits" or were expensive). Also "AI Calculator builder to build any type of calculator" (Jun 2025) and "Free online calculators built with AI" (Mar 2026). — [HN 40291352](https://news.ycombinator.com/item?id=40291352); [HN 44288951](https://news.ycombinator.com/item?id=44288951); [HN 47469600](https://news.ycombinator.com/item?id=47469600)
- Vendors actively compete for "calculator builder" SEO. Examples: involve.me "10 Best Online Calculator Builders in 2026" and Formidable "7 Best Cost Calculator WordPress Plugins [2026]". — [involve.me](https://www.involve.me/blog/best-calculator-builders); [Formidable](https://formidableforms.com/best-cost-calculator-plugin-wordpress/)
- Small embeddable quote-calculator SaaS exist, such as "Quote Calculator" (up to $39/mo) and QuoteChef. — [AlternativeTo – Quote Calculator](https://alternativeto.net/software/quote-calcultor/about); [AlternativeTo – QuoteChef](https://alternativeto.net/software/quotechef/about)

### Inferences
- Demand is real but mature and fragmented, which suggests a red-ocean category. A pain point repeated by makers is pricing and page-view caps on incumbents (Outgrow, involve.me), which gives a pricing-model opening.

### Gaps
- Search volumes and Google Trends for "pricing calculator for website", "quote calculator", "cost estimator for website" and "quiz funnel" were not obtained. Run Google Trends or Ahrefs manually.
- Reddit threads could not be surfaced via search. The request for Reddit/Indie Hackers complaints is unmet.

## (b3) Which verticals most need instant quotes, and evidence of buyer demand for upfront pricing

### Takeaway
Buyer demand for self-serve pricing is strong and rising in both B2B (Gartner: 67% of B2B buyers prefer rep-free, up from 61% a year earlier) and home services (70% of homeowners are more likely to call a contractor transparent on pricing). Home services and solar/roofing have the clearest evidence but also strong vertical incumbents. B2B services, SaaS and manufacturing benefit from the rep-free trend.

### Cited Findings
- Gartner (independent analyst): 67% of B2B buyers prefer a rep-free experience (survey of 646 buyers, Aug–Sep 2025, published Mar 9, 2026), up from 61% (632 buyers, Aug–Sep 2024, published Jun 25, 2025). Buyers still want seller input for "fit" questions. 69% of B2B buyers turn to reps to validate AI-generated insights (May 20, 2026). — [Gartner Mar 2026](https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience); [Gartner Jun 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-sales-survey-finds-61-percent-of-b2b-buyers-prefer-a-rep-free-buying-experience); [Gartner May 2026](https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-survey-finds-sixty-nine-percent-of-b-two-b-buyers-turn-to-sales-reps-to-validate-ai-generated-insights)
- HVAC/home services: 70% of homeowners say they are more likely to call a contractor transparent on pricing, consistent year over year. ACHR News reports customers and contractors are "at odds" over online pricing, since contractors resist publishing prices. — [FieldBoss 2025 HVAC survey](https://www.fieldboss.com/blog/hvacs-real-problem-isnt-price-its-poor-communication/); [ACHR News](https://www.achrnews.com/articles/163836-hvac-customers-and-contractors-at-odds-with-online-pricing)
- Housecall Pro and Jobber publish 2026 homeowner and home-service trend reports stressing upfront pricing and flexible booking (vendor sources). — [Housecall Pro 2026 spending report](https://www.housecallpro.com/resources/home-service-spending-report/); [Jobber 2026 trends report](https://www.getjobber.com/home-service-trends-report/)
- Vertical dataset in the Outgrow benchmark: SaaS 34%, B2B services 28%, e-commerce 21%, healthcare 9%. This is a proxy for who buys interactive-content tools (vendor data). — [Outgrow (snippet)](https://outgrow.co/blog/interactive-forms-lead-generation-2025/)
- Financial advisors are targeted by quiz-funnel vendors (involve.me "AI Quiz Funnels for Financial Advisors 2026"). Made-to-measure e-commerce (blinds, wallpaper, tiles, fabric) is served by Shopify calculator apps. — [involve.me](https://www.involve.me/blog/best-ai-quiz-funnel-builders-for-financial-advisors); [Shopify Ex Custom Price Calculator](https://apps.shopify.com/measurement-price-calculator)

### Inferences
- The contractor reluctance noted by ACHR is a real adoption barrier. An "estimate range plus lead capture" (not a binding price) positioning addresses it.
- The best-fit verticals for a document-driven tool are those where pricing already lives in a price list or grid and no vertical incumbent exists: B2B services and agencies, SaaS, training and education, events and catering, cleaning and moving, printing, and B2B manufacturing option grids.

### Gaps
- No verified cross-vertical statistic on "% of customers wanting price upfront" beyond HVAC (70%) and B2B rep-free (67%). No data for insurance, education or events.
- Market-size data for interactive-content software was not gathered (aggregator estimates only; skipped as unreliable).
