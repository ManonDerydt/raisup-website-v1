// Données d'exemple (format du stockage local) : captures de validation et aperçu.
// Toutes les dates sont calculées depuis aujourd'hui. Ce ne sont pas des données réelles.
export function exampleData(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (n) => { const d = new Date(now); d.setDate(d.getDate() + n); return iso(d); };
  const month = (n) => { const d = new Date(now.getFullYear(), now.getMonth() + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
  const today = iso(now);
  let t = Date.now() - 1e6;
  const docs = {};
  const set = (key, field, v) => { (docs[key] ||= {})[field] = { v, t: t++ }; };
  const dev = 'demo01';

  set('cfg', `debut-${addDays(-16)}`, true);
  // Calcul sur 30 jours : justesse en progrès, temps en baisse.
  let r = 3;
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647);
  for (let i = 29; i >= 0; i--) {
    if (i % 6 === 4) continue;
    const day = addDays(-i);
    const n = i === 0 ? 8 : 10 + Math.floor(rnd() * 6);
    const rate = Math.min(0.95, 0.55 + (29 - i) * 0.012 + rnd() * 0.08);
    set(`d:${day}`, `cn:${dev}`, n);
    set(`d:${day}`, `ck:${dev}`, Math.round(n * rate));
    set(`d:${day}`, `cms:${dev}`, Math.round(n * (26000 - (29 - i) * 420 + rnd() * 4000)));
  }
  // Aujourd'hui
  const dk = `d:${today}`;
  for (const id of ['r1', 'r2', 'r3']) set(dk, `r:${id}`, true);
  set(dk, 'a0', 'Marque : publier la vidéo sur la valorisation');
  set(dk, 'ad0', true);
  set(dk, 'a1', 'Argent : relancer la facture de septembre');
  set(dk, 'a2', 'Moi : 30 minutes de marche sans téléphone');
  set(dk, `pa:${dev}`, 1);
  // Habitudes sur 7 jours
  const pattern = { h1: [1, 1, 0, 1, 1, 1, 1], h2: [1, 0, 1, 0, 1, 1, 0], h3: [1, 1, 1, 1, 0, 1, 1], h4: [0, 1, 0, 1, 1, 0, 0], h5: [1, 1, 1, 1, 1, 1, 0] };
  for (const [id, days] of Object.entries(pattern)) days.forEach((on, k) => { if (on) set(`d:${addDays(k - 6)}`, `h:${id}`, true); });
  // Faits des jours précédents
  const facts = [
    'Le fonds a confirmé la lettre d\'intention, prix maintenu.',
    'Première conférence chronométrée en entier, 28 minutes.',
    'Revue du bilan avec l\'expert-comptable : marge brute à 82 %.',
    'Déjeuner avec une administratrice indépendante, trois contacts.',
    'Vidéo sur la dilution : 42 000 vues en deux jours.',
    'Signature du nouveau bail.'
  ];
  facts.forEach((f, k) => set(`d:${addDays(-(k + 1))}`, 'fait', f));
  // Programme
  for (const w of [1, 2]) for (const i of [0, 1, 2]) set('prog', `s${w}-${i}`, true);
  set('prog', 's3-0', true);
  // Vocabulaire : 46 fiches vues, dont une partie maîtrisée
  for (let i = 1; i <= 46; i++) {
    const id = `v${String(i).padStart(3, '0')}`;
    const l = i <= 14 ? 4 : i <= 24 ? 3 : i <= 36 ? 2 : 1;
    const due = i % 5 === 0 || i > 40 ? today : addDays(1 + (i % 9));
    const last = i > 40 ? today : addDays(-(i % 7) - 1);
    set('vocab', id, { l, due: i > 40 ? addDays(i % 2 ? 1 : 3) : due, last, first: addDays(-20) });
  }
  set('mots', 'mdemo1', { terme: 'Waterfall', definition: 'Ordre de répartition du prix de cession entre les catégories d\'actions.', exemple: 'Le waterfall montre ce que chaque associé touche à 8 millions.' });
  set('mots', 'mdemo2', { terme: 'Vendor due diligence', definition: 'Audit commandé par le vendeur avant de rencontrer les acquéreurs.', exemple: 'La vendor due diligence a raccourci le processus de six semaines.' });
  // Discours
  set('setup', 'e0', true); set('setup', 'e1', true); set('setup', 'e3', true); set('setup', 'e4', true);
  set('conf', 'c1:accroche', 'Il y a trois ans, j\'ai failli céder 40 % de mon entreprise pour 300 000 euros.');
  set('conf', 'c1:chiffre', '2 % des fonds levés en France vont à des équipes fondatrices féminines (Sista, 2024).');
  set('anec', 'ndemo1', { texte: 'Le jour où un investisseur m\'a demandé qui allait vraiment diriger l\'entreprise.', cree: Date.now() - 86400000 });
  set('anec', 'ndemo2', { texte: 'La term sheet relue à 2 heures du matin dans un train de nuit.', cree: Date.now() - 2 * 86400000 });
  // Pilotage
  set('pil', 'jourJ', addDays(68));
  set('pil', 'capital', 95000);
  set('pil', 'depenses', 5000);
  const states = { o01: 2, o02: 1, o05: 1, o06: 2, o09: 2, o10: 1, o13: 1, o16: 1, o20: 2, o21: 1 };
  for (const [id, s] of Object.entries(states)) set('obj', id, s);
  const insta = [6200, 7400, 8100, 9800, 11200, 12900, 14600, 15800];
  insta.forEach((v, k) => {
    const d = addDays(-(insta.length - 1 - k) * 12);
    set('audh', d, { instagram: v, tiktok: Math.round(v * 0.6), linkedin: 4200 + k * 310, videos: Math.floor(k / 3) });
  });
  set('aud', 'instagram', 15800); set('aud', 'tiktok', 9480); set('aud', 'linkedin', 6370); set('aud', 'videos', 2);
  const revs = [1800, 2400, 2100, 3900, 3200, 4500, 3800, 5200, 4100, 6100, 5400, 0];
  revs.forEach((total, k) => {
    const m = month(k - 11);
    if (k === 11) {
      set('rev', `${m}:conferences`, 2000); set('rev', `${m}:cercle`, 1350); set('rev', `${m}:droits`, 380);
      return;
    }
    set('rev', `${m}:conferences`, Math.round(total * 0.5));
    set('rev', `${m}:cercle`, Math.round(total * 0.3));
    set('rev', `${m}:conseil`, Math.round(total * 0.2));
  });
  return { docs, dirty: {}, meta: {} };
}
