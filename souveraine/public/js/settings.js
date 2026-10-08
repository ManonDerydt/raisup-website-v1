// Réglages : rappel, export et import, compte.
import { h, button, icon, confirmBox } from './ui.js';
import * as notify from './notify.js';
import { today } from './dates.js';

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function openSettings(ctx) {
  const { store, content } = ctx;
  const r = notify.settings(ctx);
  const msg = h('p', { class: 'hint', 'aria-live': 'polite' });

  const time = h('input', { type: 'time', class: 'input', id: 'rappel-heure', value: r.heure, style: { maxWidth: '140px' } });
  const toggle = button(r.on ? 'Désactiver' : 'Activer', null, { class: r.on ? '' : 'btn-primary' });
  const status = h('p', { class: 'small muted' }, r.on ? `Rappel actif chaque jour à ${r.heure}.` : 'Rappel désactivé.');
  toggle.addEventListener('click', async () => {
    const cur = notify.settings(ctx);
    msg.textContent = '';
    try {
      if (cur.on) {
        await notify.disable(ctx);
        status.textContent = 'Rappel désactivé.';
        toggle.querySelector('span').textContent = 'Activer';
        toggle.classList.add('btn-primary');
      } else {
        const mode = await notify.enable(ctx, time.value || cur.heure);
        status.textContent = `Rappel actif chaque jour à ${time.value || cur.heure}.`;
        toggle.querySelector('span').textContent = 'Désactiver';
        toggle.classList.remove('btn-primary');
        if (mode === 'local') msg.textContent = 'Sans service d\'envoi configuré, le rappel s\'affiche seulement quand l\'application est ouverte. Le calendrier ci-dessous prend le relais.';
      }
    } catch (e) {
      msg.textContent = e.message;
    }
  });
  time.addEventListener('change', async () => {
    const cur = notify.settings(ctx);
    store.set('cfg', 'rappel', { ...cur, heure: time.value || cur.heure, tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
    if (cur.on) status.textContent = `Rappel actif chaque jour à ${time.value}.`;
  });
  const ics = button('Ajouter au calendrier', () => {
    download('rappel-souveraine.ics', notify.icsFile(time.value || r.heure, content.parametres.rappel.texte), 'text/calendar');
  }, { class: 'btn-ghost' });

  const exportBtn = button('Exporter (JSON)', () => {
    const data = store.exportAll();
    download(`souveraine-${today()}.json`, JSON.stringify(data, null, 1), 'application/json');
    msg2.textContent = 'Fichier exporté.';
  });
  const file = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', id: 'import-file', tabindex: '-1' });
  const importBtn = button('Importer (JSON)', () => file.click(), { class: 'btn-ghost' });
  const msg2 = h('p', { class: 'hint', 'aria-live': 'polite' });
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    try {
      const payload = JSON.parse(await f.text());
      if (!(await confirmBox('Importer ce fichier ? Les valeurs qu\'il contient remplacent les valeurs actuelles.', { ok: 'Importer' }))) return;
      const n = store.importAll(payload);
      msg2.textContent = `${n} ensembles de données importés.`;
      ctx.refresh();
    } catch (e) {
      msg2.textContent = 'Fichier illisible ou non reconnu.';
    } finally {
      file.value = '';
    }
  });

  const account = ctx.cloud
    ? h('div', null,
        h('p', { class: 'small' }, `Connectée : ${ctx.email || ''}`),
        h('p', { class: 'small muted' }, 'Données synchronisées entre tes appareils, disponibles hors ligne.'),
        h('div', { class: 'card-foot' }, button('Se déconnecter', async () => {
          const pending = store.dirtyKeys().length;
          const text = pending
            ? `${pending} modification${pending > 1 ? 's' : ''} pas encore envoyée${pending > 1 ? 's' : ''}. Se déconnecter quand même ? Elles seront perdues sur cet appareil.`
            : 'Se déconnecter de cet appareil ?';
          if (await confirmBox(text, { ok: 'Se déconnecter', danger: pending > 0 })) {
            dlg.close();
            ctx.logout();
          }
        }))
      )
    : h('p', { class: 'small muted' }, 'Mode local : synchronisation non configurée (voir config.js). Les données restent sur cet appareil.');

  const provisional = content.provisoire.length
    ? h('section', { class: 'sheet-section' },
        h('h3', null, 'Contenu provisoire'),
        h('p', { class: 'small muted' }, `En attente de souveraine.html : ${content.provisoire.map((f) => `${f}.json`).join(', ')}.`))
    : null;

  const dlg = h('dialog', { class: 'dialog', 'aria-labelledby': 'reglages-t' },
    h('div', { class: 'dialog-body' },
      h('div', { class: 'sheet-head' },
        h('h2', { class: 'dialog-title', id: 'reglages-t' }, 'Réglages'),
        h('button', { type: 'button', class: 'btn btn-icon btn-ghost', 'aria-label': 'Fermer', on: { click: () => dlg.close() } }, icon('close'))
      ),
      h('section', { class: 'sheet-section' },
        h('h3', null, 'Rappel quotidien'),
        h('p', { class: 'small muted' }, `« ${content.parametres.rappel.texte} »`),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('label', { class: 'sr-only', for: 'rappel-heure' }, 'Heure du rappel'), time, toggle),
        status, msg,
        h('div', { class: 'card-foot' }, ics)
      ),
      h('section', { class: 'sheet-section' },
        h('h3', null, 'Mes données'),
        h('p', { class: 'small muted' }, 'Enregistrement automatique à chaque modification. Les enregistrements audio restent sur l\'appareil et ne sont pas exportés.'),
        h('div', { class: 'card-foot' }, exportBtn, importBtn, file),
        msg2
      ),
      h('section', { class: 'sheet-section' }, h('h3', null, 'Compte'), account),
      provisional
    )
  );
  dlg.addEventListener('close', () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}
