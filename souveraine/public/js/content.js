// Chargement du contenu (fichiers de data/), séparé du code.

const FILES = {
  categories: 'categories', vocabulaire: 'vocabulaire', routine: 'routine', programme: 'programme',
  conferences: 'conferences', champs: 'champs-conference', miseEnPlace: 'mise-en-place', sujets: 'sujets',
  fondations: 'fondations', portrait: 'portrait', piliers: 'piliers', sources: 'sources-revenus',
  habitudes: 'habitudes', parametres: 'parametres'
};

// Espaces insécables de la typographie française.
function typo(s) {
  return s
    .replace(/ ([:;?!%»€])/g, ' $1')
    .replace(/« /g, '« ')
    .replace(/(\d) (\d{3})\b/g, '$1 $2');
}

function deep(v) {
  if (typeof v === 'string') return typo(v);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]));
  return v;
}

export async function loadContent(base = 'data/') {
  const entries = await Promise.all(Object.entries(FILES).map(async ([key, file]) => {
    const res = await fetch(`${base}${file}.json`);
    if (!res.ok) throw new Error(`Contenu introuvable : ${file}.json`);
    return [key, deep(await res.json())];
  }));
  const c = Object.fromEntries(entries);
  c.provisoire = Object.entries(c).filter(([, v]) => v && v.provisoire).map(([k]) => FILES[k]);
  return c;
}
