// Crawlers used by AI assistants to read or fetch pages on a user's behalf.
export const AI_AGENTS = [
  { token: 'GPTBot', owner: 'OpenAI (training)' },
  { token: 'OAI-SearchBot', owner: 'OpenAI (ChatGPT search)' },
  { token: 'ChatGPT-User', owner: 'OpenAI (ChatGPT browsing)' },
  { token: 'ClaudeBot', owner: 'Anthropic' },
  { token: 'Claude-User', owner: 'Anthropic (Claude browsing)' },
  { token: 'PerplexityBot', owner: 'Perplexity' },
  { token: 'Google-Extended', owner: 'Google (Gemini)' },
  { token: 'Applebot-Extended', owner: 'Apple Intelligence' },
];

// Minimal robots.txt evaluation: is the site root disallowed for a given user agent?
export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (current && (field === 'allow' || field === 'disallow')) {
      current.rules.push({ type: field, path: value });
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  }
  return groups;
}

export function isRootBlocked(groups, agentToken) {
  const token = agentToken.toLowerCase();
  const specific = groups.filter((g) => g.agents.includes(token));
  const applicable = specific.length ? specific : groups.filter((g) => g.agents.includes('*'));
  const rules = applicable.flatMap((g) => g.rules).filter((r) => r.path !== '' || r.type === 'allow');
  // Longest matching rule wins; for the root path "/" only "/" or "" style rules match.
  const matching = rules.filter((r) => r.path === '/' || r.path === '/*' || r.path === '*');
  if (!matching.length) return false;
  const allow = matching.some((r) => r.type === 'allow');
  const disallow = matching.some((r) => r.type === 'disallow');
  return disallow && !allow;
}

export function checkAiAccess(robotsText) {
  if (robotsText == null) {
    return AI_AGENTS.map((agent) => ({ ...agent, allowed: true }));
  }
  const groups = parseRobots(robotsText);
  return AI_AGENTS.map((agent) => ({ ...agent, allowed: !isRootBlocked(groups, agent.token) }));
}
