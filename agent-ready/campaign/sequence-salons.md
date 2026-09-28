# Salon sequence (US) — 3 emails

*Merge fields match the columns of `send-salons.csv`: `{{company}}`, `{{city}}`, `{{score}}`, `{{headline}}`, `{{fix_1}}`, `{{fix_2}}`, `{{report_url}}`, `{{rating}}`.*
*Plain text only, no images, no tracking pixel (better deliverability; we measure report opens instead). One link per email.*
*Send Tuesday–Thursday, 9–11 am local time of the salon.*

**Required footer on every email (CAN-SPAM):**

```
—
{{sender_name}}, Agent-Ready · {{postal_address}}
Not relevant? Reply "no" or unsubscribe: {{unsubscribe_link}}
```

---

## Email 1 — Day 0 · the score

**Subject (A/B test):**
- A: `{{company}}: can ChatGPT book you?`
- B: `{{company}} scored {{score}}/100`
- C: `What ChatGPT tells clients about {{company}}`

**Body:**

```
Hi {{company}} team,

More clients now ask ChatGPT, Gemini or Siri things like "best balayage near me I can book this week".

We checked what those assistants can see about {{company}}. Your Agent-Ready Score is {{score}}/100.

In short: {{headline}}

Your #1 fix: {{fix_1}}

Your full report (free, no login): {{report_url}}

{{sender_first_name}}
```

---

## Email 2 — Day 3 · the neighbors

**Subject:** `Re: {{company}}: can ChatGPT book you?`

```
Hi again,

Quick follow-up. We scanned salons across {{city}} this week, and most can't be booked by AI assistants yet. The ones that can are the ones AI recommends first.

Two fixes would move {{company}} the most:
1. {{fix_1}}
2. {{fix_2}}

Most take about 5 minutes, no developer needed. Your report shows exactly how: {{report_url}}

{{sender_first_name}}
```

---

## Email 3 — Day 8 · done for you

**Subject:** `Want us to fix it for {{company}}?`

```
Hi,

Last note from me.

If you'd rather not touch your website, we can generate everything AI assistants need (your services, prices, hours and booking link) and you just paste it in. It works with Wix, Squarespace and WordPress.

Start from your report here: {{report_url}}

If now isn't the right time, no problem. Reply "later" and I'll check back in 3 months.

{{sender_first_name}}
```

---

## Handling replies

| Reply | Action |
|---|---|
| "No", "stop", "unsubscribe", angry | Add email **and** website domain to `data/suppression.txt` the same day. No reply needed. |
| "Later" | Tag for re-scan in 90 days (new score = new reason to write). |
| Question about price | "Free to scan. Fix & Monitor is $29/month and includes a monthly AI re-check. Here's your report: {{report_url}}" |
| "Who are you?" | One sentence on what Agent-Ready does + link to `/methodology.html`. |
| "My web person handles this" | Ask for an intro, offer the agency program (link to `#agencies`). |
| Interested | Reply within 2 hours with the report link and offer a 10-minute call. |

## A/B tests (one at a time, ≥ 300 sends per variant)

1. Subject line A vs B vs C.
2. Score in subject vs question in subject.
3. Email 1 with `{{fix_1}}` vs without.
4. Send time: 9 am vs 2 pm.
