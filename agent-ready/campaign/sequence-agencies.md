# Agency sequence (US, then UK / EU / Canada / Australia) — 3 emails + LinkedIn

*Target: web and local-marketing agencies (5–50 people) that build or run websites for salons, spas, clinics and local services. Find them on Clutch, the Wix Partner directory, Squarespace Circle, Google ("salon website design {{city}}") and LinkedIn.*
*Merge fields: `{{first_name}}`, `{{agency}}`, `{{city}}`, `{{client_example}}` (one of their portfolio clients), `{{client_score}}` (score of that client, scanned beforehand), `{{client_report_url}}`.*

**Pre-work for each agency:** scan one salon from their portfolio with `build.js --input` and put its score in the first email. It turns a cold email into a free audit of their own work.

---

## Email 1 — Day 0 · their client's score

**Subject:** `{{client_example}} scored {{client_score}}/100 on AI readiness`

```
Hi {{first_name}},

Your clients' customers are starting to ask ChatGPT and Gemini for salons and book whatever they suggest.

We scanned {{client_example}}, one of the sites in your portfolio. It scored {{client_score}}/100: AI assistants can't read its prices or send clients to its booking page.

Here's the report: {{client_report_url}}

We're giving a few agencies white-label access: scan every client, send reports under your brand, and deliver the fixes as a new service. Worth a 15-minute look?

{{sender_first_name}}
```

## Email 2 — Day 4 · the business case

**Subject:** `Re: {{client_example}} scored {{client_score}}/100`

```
Hi {{first_name}},

How agencies are using this:

- Scan every client and every prospect in {{city}} in minutes
- Send a branded report: a reason to call every client this month
- Sell the fix as a small recurring add-on, at the price you set

Agency plan: $299/month for unlimited scans and fixes for up to 25 locations. Free for your first 5 clients during the pilot.

Want me to scan your whole client list? Just reply with the URLs.

{{sender_first_name}}
```

## Email 3 — Day 9 · close the loop

**Subject:** `Close the loop?`

```
Hi {{first_name}},

I don't want to crowd your inbox. If AI search isn't on your roadmap this quarter, reply "not now" and I'll leave it there.

If it is, the pilot includes white-label reports free for 5 clients: {{signup_url}}

{{sender_first_name}}
```

*Footer: same CAN-SPAM footer as the salon sequence. For UK/EU agencies: corporate addresses only, clear opt-out, legitimate-interest basis documented.*

---

## LinkedIn (in parallel, founder account)

**Connection note (≤ 300 characters):**
```
Hi {{first_name}}, I build a tool that shows local businesses whether ChatGPT can recommend and book them. Scanned a few salon sites your agency built, interesting results. Happy to share.
```

**Message after connecting:**
```
Thanks for connecting! Here's the report for {{client_example}}: {{client_report_url}}
Would white-label reports for all your clients be useful? Free pilot for 5 clients.
```

## Agency qualification (on the call)

1. How many local-business clients? (target: ≥ 15)
2. Do they sell recurring SEO or care plans? (upsell fit)
3. Who would send the reports? (need an owner)
4. Pilot: 5 clients free → convert to $299/month at day 30.
