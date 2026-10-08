// Calcul mental : générateurs de questions, lecture des réponses, tolérance.

export const CATEGORIES = [
  { id: 'tout', label: 'Tout' },
  { id: 'pourcentages', label: 'Pourcentages' },
  { id: 'tva', label: 'TVA' },
  { id: 'levees', label: 'Levées et dilution' },
  { id: 'valorisation', label: 'Valorisation' },
  { id: 'revenus', label: 'Revenus' },
  { id: 'runway', label: 'Runway et marge' }
];

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });
const nf1 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

export function fmt(n) {
  return nf.format(round2(n)).replace(/ /g, ' ');
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

// Montant lisible pour l'énoncé : 2 400 €, 360 k€, 1,5 M€.
export function money(n) {
  const a = Math.abs(n);
  if (a >= 1e6 && a % 1e4 === 0) return `${nf.format(n / 1e6)} M€`.replace(/ /g, ' ');
  if (a >= 1e4 && a % 1e3 === 0) return `${nf.format(n / 1e3)} k€`.replace(/ /g, ' ');
  return `${fmt(n)} €`;
}

export function withUnit(n, unit) {
  if (unit === '€') return `${fmt(n)} €`;
  if (unit === '%') return `${fmt(n)} %`;
  if (unit === 'mois') return `${fmt(n)} mois`;
  return fmt(n);
}

const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];
const decimals = (n) => {
  const s = String(round2(n));
  return s.includes('.') ? s.split('.')[1].length : 0;
};

function q(cat, prompt, answer, unit, method) {
  return { cat, prompt, answer: round2(answer), unit, pct: unit === '%', method };
}

const GEN = {
  pourcentages(rnd) {
    const p = pick([5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 2.5, 7.5], rnd);
    const n = pick([80, 120, 240, 360, 480, 600, 750, 1200, 1800, 2400, 3600, 4500, 12000, 36000, 48000, 120000, 240000, 360000, 1500000], rnd);
    const a = (p * n) / 100;
    const ten = n / 10;
    const methods = {
      10: `Diviser par 10 : ${fmt(n)} / 10 = ${fmt(a)}.`,
      5: `10 % puis la moitié : ${fmt(ten)}, puis ${fmt(ten)} / 2 = ${fmt(a)}.`,
      20: `10 % puis × 2 : ${fmt(ten)} × 2 = ${fmt(a)}.`,
      25: `Un quart : ${fmt(n)} / 4 = ${fmt(a)}.`,
      75: `Trois quarts : ${fmt(n)} / 4 = ${fmt(n / 4)}, puis × 3 = ${fmt(a)}.`,
      12: `10 % + 2 % : ${fmt(ten)} + ${fmt(ten / 5)} = ${fmt(a)}.`,
      15: `10 % + 5 % : ${fmt(ten)} + ${fmt(ten / 2)} = ${fmt(a)}.`,
      35: `30 % + 5 % : ${fmt(ten * 3)} + ${fmt(ten / 2)} = ${fmt(a)}.`,
      45: `50 % − 5 % : ${fmt(n / 2)} − ${fmt(ten / 2)} = ${fmt(a)}.`,
      2.5: `10 % divisé par 4 : ${fmt(ten)} / 4 = ${fmt(a)}.`,
      7.5: `5 % + 2,5 % : ${fmt(ten / 2)} + ${fmt(ten / 4)} = ${fmt(a)}.`
    };
    const method = methods[p] || `10 % × ${p / 10} : ${fmt(ten)} × ${fmt(p / 10)} = ${fmt(a)}.`;
    return q('pourcentages', `${fmt(p)} % de ${money(n)}`, a, '€', method);
  },

  tva(rnd) {
    const ht = pick([150, 240, 450, 800, 1250, 1800, 2400, 3500, 4200, 7500, 12000, 36000], rnd);
    const ttc = ht * 1.2;
    if (rnd() < 0.5) {
      return q('tva', `${money(ht)} HT : combien TTC (TVA 20 %) ?`, ttc, '€',
        `Ajouter un cinquième : ${fmt(ht)} / 5 = ${fmt(ht / 5)}, puis ${fmt(ht)} + ${fmt(ht / 5)} = ${fmt(ttc)}.`);
    }
    return q('tva', `${money(ttc)} TTC : combien HT (TVA 20 %) ?`, ht, '€',
      `Diviser par 1,2, c'est prendre les 5/6 : ${fmt(ttc)} / 6 = ${fmt(ttc / 6)}, puis × 5 = ${fmt(ht)}.`);
  },

  levees(rnd) {
    if (rnd() < 0.5) {
      for (let i = 0; i < 50; i++) {
        const pre = pick([1.5e6, 2e6, 3e6, 4e6, 6e6, 8e6, 9e6, 12e6, 15e6, 20e6], rnd);
        const lev = pick([5e5, 1e6, 1.5e6, 2e6, 3e6, 4e6, 5e6], rnd);
        const post = pre + lev;
        const a = (lev / post) * 100;
        if (decimals(a) > 1 || lev >= pre) continue;
        return q('levees', `Levée de ${money(lev)} sur une pré-money de ${money(pre)}. Quel pourcentage est cédé ?`, a, '%',
          `Post-money = ${money(pre)} + ${money(lev)} = ${money(post)}. Part cédée = ${money(lev)} / ${money(post)} = ${fmt(a)} %.`);
      }
    }
    for (let i = 0; i < 50; i++) {
      const avant = pick([100, 80, 75, 60, 50, 40, 30, 25], rnd);
      const pre = pick([2e6, 3e6, 4e6, 6e6, 8e6, 9e6, 12e6], rnd);
      const lev = pick([5e5, 1e6, 1.5e6, 2e6, 3e6, 4e6], rnd);
      const post = pre + lev;
      const f = pre / post;
      const a = avant * f;
      if (decimals(a) > 1 || decimals(f) > 2 || lev >= pre) continue;
      return q('levees', `Je détiens ${fmt(avant)} %. Levée de ${money(lev)} sur une pré-money de ${money(pre)}. Quel pourcentage après ?`, a, '%',
        `Post-money = ${money(post)}. Facteur = pré / post = ${money(pre)} / ${money(post)} = ${fmt(f)}. ${fmt(avant)} % × ${fmt(f)} = ${fmt(a)} %.`);
    }
    return GEN.levees(() => 0.99);
  },

  valorisation(rnd) {
    if (rnd() < 0.5) {
      const mrr = pick([8e3, 12e3, 15e3, 20e3, 25e3, 30e3, 40e3, 50e3, 75e3, 100e3], rnd);
      const m = pick([3, 4, 5, 6, 8, 10], rnd);
      const arr = mrr * 12;
      return q('valorisation', `Revenu récurrent mensuel de ${money(mrr)}, multiple de ${m} fois le revenu annuel. Valorisation ?`, arr * m, '€',
        `Revenu annuel = ${money(mrr)} × 12 = ${money(arr)}. Puis × ${m} = ${money(arr * m)}.`);
    }
    const e = pick([150e3, 200e3, 250e3, 300e3, 400e3, 450e3, 600e3, 800e3, 1.2e6], rnd);
    const m = pick([4, 5, 6, 7, 8, 10, 12], rnd);
    return q('valorisation', `EBITDA de ${money(e)}, multiple de ${m}. Valorisation ?`, e * m, '€',
      `EBITDA × multiple : ${money(e)} × ${m} = ${money(e * m)}.`);
  },

  revenus(rnd) {
    const r = rnd();
    if (r < 0.34) {
      const n = pick([1, 2, 3, 4], rnd);
      const p = pick([2000, 2500, 3000, 4000, 5000, 6000, 8000], rnd);
      const month = n * p;
      return q('revenus', `${n} conférence${n > 1 ? 's' : ''} par mois à ${money(p)}. Revenu annuel ?`, month * 12, '€',
        `Par mois : ${n} × ${money(p)} = ${money(month)}. Par an : × 12, soit × 10 puis + 2 fois : ${money(month * 10)} + ${money(month * 2)} = ${money(month * 12)}.`);
    }
    if (r < 0.67) {
      const m = pick([20, 25, 30, 40, 50, 60, 80, 100, 150, 200], rnd);
      const p = pick([29, 49, 50, 79, 90, 99, 120, 150], rnd);
      const month = m * p;
      const trick = p % 10 === 9 ? ` Astuce : ${m} × ${p + 1} − ${m} = ${fmt(month)}.` : '';
      return q('revenus', `Cercle de ${m} membres à ${fmt(p)} € par mois. Revenu annuel ?`, month * 12, '€',
        `Par mois : ${m} × ${fmt(p)} = ${money(month)}.${trick} Par an : × 12 = ${money(month * 12)}.`);
    }
    const ex = pick([2000, 3000, 5000, 8000, 10000, 15000, 20000], rnd);
    const ht = pick([16, 18, 20, 22, 24], rnd);
    const ttc = round2(ht * 1.055);
    const a = (ex * ttc / 1.055) * 0.08;
    return q('revenus', `${fmt(ex)} exemplaires vendus à ${fmt(ttc)} € TTC, droits de 8 % sur le prix HT. Droits d'auteur ?`, a, '€',
      `Prix HT = ${fmt(ttc)} / 1,055 ≈ ${fmt(ht)} €. Ventes HT = ${fmt(ex)} × ${fmt(ht)} = ${money(ex * ht)}. 8 % : 10 % = ${money(ex * ht / 10)}, moins un cinquième = ${money(a)}.`);
  },

  runway(rnd) {
    if (rnd() < 0.5) {
      const d = pick([5e3, 8e3, 10e3, 12e3, 15e3, 20e3, 25e3, 40e3, 50e3, 60e3], rnd);
      const mois = pick([6, 8, 9, 10, 12, 15, 18, 20, 24, 30], rnd);
      const c = d * mois;
      return q('runway', `Capital de ${money(c)}, dépenses de ${money(d)} par mois. Runway ?`, mois, 'mois',
        `Capital / dépenses mensuelles : ${money(c)} / ${money(d)} = ${mois} mois.`);
    }
    const f = pick([1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000, 10000, 12000], rnd);
    const m = pick([20, 25, 30, 40, 50, 60, 65, 70, 75, 80], rnd);
    const cout = (f * (100 - m)) / 100;
    return q('runway', `Facturé ${money(f)}, coût ${money(cout)}. Marge en pourcentage ?`, m, '%',
      `Marge = ${money(f)} − ${money(cout)} = ${money(f - cout)}. ${money(f - cout)} / ${money(f)} = ${m} %.`);
  }
};

export function generate(category = 'tout', rnd = Math.random) {
  const ids = Object.keys(GEN);
  const cat = category === 'tout' || !GEN[category] ? pick(ids, rnd) : category;
  return GEN[cat](rnd);
}

// Lecture d'une réponse : « 360k », « 2,4m », « 1 200 € », « 12,5 % », « 18 mois ».
export function parseAnswer(raw) {
  if (raw === null || raw === undefined) return NaN;
  let s = String(raw).toLowerCase().trim();
  s = s.replace(/[\s  ']/g, '');
  s = s.replace(/€|euros?|eur|%|pourcents?|mois|ht|ttc/g, '');
  const m = s.match(/^([+-]?[\d.,]+)(k|m|md|mds|mrd|millions?|milliards?|mille)?$/);
  if (!m) return NaN;
  let n = m[1];
  const dots = (n.match(/\./g) || []).length;
  const commas = (n.match(/,/g) || []).length;
  if (dots && commas) {
    // Le dernier séparateur est la décimale.
    if (n.lastIndexOf(',') > n.lastIndexOf('.')) n = n.replace(/\./g, '').replace(',', '.');
    else n = n.replace(/,/g, '');
  } else if (commas > 1) {
    n = n.replace(/,/g, '');
  } else if (dots > 1) {
    n = n.replace(/\./g, '');
  } else {
    n = n.replace(',', '.');
  }
  let v = parseFloat(n);
  if (!isFinite(v)) return NaN;
  const suf = m[2] || '';
  if (suf === 'k' || suf === 'mille') v *= 1e3;
  else if (suf === 'm' || suf.startsWith('million')) v *= 1e6;
  else if (suf === 'md' || suf === 'mds' || suf === 'mrd' || suf.startsWith('milliard')) v *= 1e9;
  return v;
}

// Tolérance : 2 % de la bonne réponse, au minimum 0,5 point pour les pourcentages.
export function isCorrect(value, answer, pct = false) {
  if (!isFinite(value)) return false;
  const tol = Math.max(Math.abs(answer) * 0.02, pct ? 0.5 : 0);
  return Math.abs(value - answer) <= tol + 1e-9;
}

export function fmtSeconds(ms) {
  return `${nf1.format(ms / 1000)} s`;
}
