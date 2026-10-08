// Configuration de Souveraine.
// Sans configuration Firebase, l'application fonctionne en mode local (données sur l'appareil, sans connexion).
// Voir README.md, section « Mise en service », pour obtenir ces valeurs.
window.SOUVERAINE_CONFIG = {
  // Console Firebase > Paramètres du projet > Vos applications > Configuration du SDK.
  firebase: null,
  // Exemple :
  // firebase: {
  //   apiKey: '...',
  //   authDomain: 'mon-projet.firebaseapp.com',
  //   projectId: 'mon-projet',
  //   appId: '...'
  // },

  // Clé publique VAPID des notifications (npx web-push generate-vapid-keys).
  vapidPublicKey: null
};
