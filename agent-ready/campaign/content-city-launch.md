# City launch content (English)

*One post set per city, published the day the first emails go out. Figures come from `summary.json` of the campaign run for that city. Only the top of the ranking is ever named; low scores are never published by name.*

---

## LinkedIn (founder)

```
We scanned {{scanned}} hair salons in {{city}} to see if AI assistants can book them.

{{pct_not_bookable}}% can't be booked by ChatGPT, Gemini or Perplexity.
{{pct_blocking_ai}}% block at least one AI assistant from reading their website, usually without knowing it.
Average score: {{average_score}}/100.

The most AI-ready salons in {{city}}:
1. {{top_1}} ({{score_1}})
2. {{top_2}} ({{score_2}})
3. {{top_3}} ({{score_3}})

Clients are starting to ask AI "where can I get a balayage tonight?". The salons AI can read are the ones it recommends.

Free check for any salon: {{site_url}}
```

## X / Threads

```
We checked {{scanned}} {{city}} salons.
{{pct_not_bookable}}% can't be booked by AI assistants.
Top 3 most AI-ready: {{top_1}}, {{top_2}}, {{top_3}}.
Check yours free: {{site_url}}
```

## Reddit (r/{{city_sub}}, r/smallbusiness, r/hairstylist), value-first, no link unless allowed

```
Title: I checked what ChatGPT knows about {{scanned}} salons in {{city}}. Most can't be booked by AI.

I've been looking at how AI assistants pick local businesses. A few patterns from {{city}} salons:
- Prices published as a photo of the menu are invisible to AI
- Booking pages on a separate platform often aren't linked in a way AI can follow
- {{pct_blocking_ai}}% of sites block at least one AI crawler in robots.txt (often a default setting)

Happy to answer questions or check anyone's salon for free.
```

## Local press pitch (email to a local business journalist)

```
Subject: {{pct_not_bookable}}% of {{city}} salons can't be booked by AI assistants

Hi {{journalist_first_name}},

We scanned {{scanned}} salons in {{city}} to see whether ChatGPT, Gemini and Perplexity can recommend and book them. {{pct_not_bookable}}% can't. The top-scoring salons are {{top_1}} and {{top_2}}.

Happy to share the full data and methodology ({{site_url}}/methodology.html) if it's useful for a story on how AI is changing local search.

{{sender_name}}
```

## Winners outreach (salons in the top 10)

```
Subject: {{company}} is one of the most AI-ready salons in {{city}}

Congrats! {{company}} scored {{score}}/100, top {{rank}} in {{city}}.
Here's your report and score card to share with clients: {{report_url}}
```
