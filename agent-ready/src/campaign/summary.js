// City-level statistics from a campaign run: the raw material for the public leaderboard and for
// press/social hooks such as "7 in 10 Austin salons can't be booked by AI".

export function summarize(rows) {
  const scanned = rows.filter((r) => r.score !== undefined && r.score !== '');
  const pct = (n) => (scanned.length ? Math.round((n / scanned.length) * 100) : 0);
  const byCity = {};
  for (const r of scanned) {
    (byCity[r.city] ||= []).push(r);
  }
  return {
    prospects: rows.length,
    scanned: scanned.length,
    withEmail: rows.filter((r) => r.email).length,
    averageScore: scanned.length ? Math.round(scanned.reduce((s, r) => s + Number(r.score), 0) / scanned.length) : null,
    pctNotBookable: pct(scanned.filter((r) => r.bookable === 'no').length),
    pctBlockingAi: pct(scanned.filter((r) => r.blocks_ai === 'yes').length),
    pctAgentReady: pct(scanned.filter((r) => Number(r.score) >= 80).length),
    cities: Object.fromEntries(Object.entries(byCity).map(([city, list]) => [city, {
      scanned: list.length,
      averageScore: Math.round(list.reduce((s, r) => s + Number(r.score), 0) / list.length),
      // Only the top of the ranking is ever published; low scores are never shown by name.
      top10: [...list].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10).map((r) => ({ company: r.company, score: Number(r.score) })),
    }])),
  };
}
