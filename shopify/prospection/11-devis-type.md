# Devis type

À reproduire dans votre outil de facturation (Pennylane, Freebe, Abby, Indy, ou un simple PDF). Les mentions légales obligatoires sont en bas. Les parties entre crochets sont à remplir.

Trois variantes : Diagnostic, Sprint ou Réparation, Continu. La structure est la même : le coût de ne rien faire, puis ce qu'on livre, puis le prix, puis les conditions.

---

## En-tête

**Rouage**, [Nom], [statut], [numéro SIREN], [adresse], [email]
**Devis n°** [2026-10-001] du [date], valable 15 jours
**Client** : [Marque], [adresse], [SIREN si connu]
**Contact** : [Prénom Nom, poste]

---

## 1. Ce que ça coûte aujourd'hui

*(Reprendre mot pour mot les chiffres validés pendant l'appel. Cette section est la plus importante du devis.)*

Aujourd'hui, [le stock entre Shopify, Amazon et l'entrepôt] est tenu à la main par [2 personnes], environ [15 heures par semaine].

| | |
|---|---|
| Temps passé | [15] h par semaine |
| Coût horaire chargé estimé | [25] € |
| Coût mensuel | [1 600] € |
| **Coût annuel** | **[19 000] €** |
| Dernier incident cité | [Survente de 40 unités en août, 12 commandes annulées] |

*Variante checkout cassé :*

Depuis la coupure de checkout.liquid le 26 août 2026, [le pixel Meta / le tag GTM / les réductions automatiques] ne fonctionne plus sur la page de paiement de [marque.fr] (vérifié le [date], capture jointe).

| | |
|---|---|
| Budget publicitaire mensuel concerné | [8 000] € |
| Conversions non remontées depuis | [6] semaines |
| Conséquence | Campagnes optimisées sans données de conversion ; [réductions non appliquées, paniers abandonnés] |

---

## 2. Ce que nous livrons

### Variante A : Diagnostic automatisation

- Atelier d'1 heure avec [la personne qui fait la saisie] pour relever le flux réel.
- Audit des apps installées et des flux stock, commandes, SAV, compta.
- Document écrit, livré sous 5 jours ouvrés, contenant :
  - les 3 automatisations les plus rentables, classées par euros récupérés par an,
  - pour chacune : heures gagnées, prix fixe, délai, ce qu'il faut de votre côté,
  - les apps que vous pouvez résilier.
- Restitution de 30 minutes en visio.

**Prix : 490 € HT**, payable à la commande. Montant intégralement déduit du premier Sprint commandé dans les 60 jours.

### Variante B : Sprint automatisation / Réparation checkout

**Objectif :** [Un seul stock à jour en temps réel entre Shopify, Amazon et l'entrepôt, sans ressaisie.]

Périmètre :
- [Synchronisation des quantités Shopify ↔ Amazon dans les deux sens, toutes les 5 minutes maximum.]
- [Prise en compte des réceptions entrepôt via le fichier CSV existant.]
- [Alerte email quand un produit passe sous le seuil défini par vous.]
- Mise en production sur votre boutique, tests avec votre équipe.
- Documentation d'une page : ce que ça fait, où ça tourne, comment l'arrêter.
- Support 30 jours après livraison, correctifs inclus.

Hors périmètre (pour éviter tout malentendu) : [la synchronisation des prix], [Faire et Ankorstore], [la refonte du thème]. Ces points peuvent faire l'objet d'un Sprint suivant.

Ce qu'il faut de votre côté : un accès collaborateur Shopify, [l'accès API Amazon Seller], une personne disponible 1 heure pour les tests le [jour 4].

**Durée : [5] jours ouvrés** à partir de la réception de l'acompte et des accès.
**Prix : [2 490] € HT, forfait fixe.** Si le travail dépasse [5] jours, le surcoût est à notre charge. [Déduction du diagnostic du [date] : 490 €. Reste : 2 000 € HT.]

*Garantie, variante Réparation checkout :* si à la livraison [le pixel / les réductions] ne fonctionne pas sur une commande test faite ensemble, le solde n'est pas dû.

### Variante C : Rouage Continu

- 3 jours de développement par mois, utilisables sur : nouvelles automatisations, évolutions de l'existant, correctifs, surveillance.
- Backlog partagé, priorisé ensemble en début de mois.
- Jours non utilisés reportés sur le mois suivant (dans la limite de 3 jours cumulés).
- Correctifs sur l'existant sous 48 h ouvrées.
- Point mensuel de 30 minutes et rapport écrit.
- Sans engagement : résiliable à tout moment, effet à la fin du mois en cours.

**Prix : 1 490 € HT par mois**, prélevé le 1er de chaque mois.

---

## 3. Récapitulatif

| Désignation | Montant HT |
|---|---|
| [Sprint automatisation : synchro stock Shopify, Amazon, entrepôt] | [2 490] € |
| [Déduction diagnostic du [date]] | [– 490] € |
| **Total HT** | **[2 000] €** |
| TVA | [non applicable, art. 293 B du CGI / 20 %] |
| **Total TTC** | **[2 000] €** |

Pour mémoire : coût annuel actuel du process, [19 000] €. Retour sur investissement estimé : [moins de 2 mois].

---

## 4. Conditions

- **Paiement :** Diagnostic, 100 % à la commande. Sprint et Réparation, 50 % à la commande, 50 % à la livraison, par virement ou lien de paiement. Continu, prélèvement mensuel le 1er.
- **Démarrage :** à réception de l'acompte et des accès. Créneau proposé : [lundi 13 octobre].
- **Propriété :** le code livré, les accès et la documentation appartiennent au client dès le paiement du solde. Aucune dépendance à Rouage.
- **Confidentialité :** les données auxquelles nous avons accès ne sont ni conservées au-delà de la mission, ni partagées.
- **Référence :** [Première mission seulement :] en échange d'une remise de [20 %] appliquée ci-dessus, le client accepte qu'un retour chiffré (heures gagnées) soit publié avec le nom de la marque, après validation du texte par le client.
- Pénalités de retard et indemnité forfaitaire de recouvrement (40 €) conformes aux articles L441-10 et D441-5 du Code de commerce.

**Bon pour accord** : date, nom, signature.

---

## Notes pour vous, à ne pas mettre dans le devis

- Envoyer le devis dans l'heure qui suit l'appel, avec le lien de paiement de l'acompte déjà dedans. Chaque jour d'attente divise le taux de signature.
- Un devis sans la section 1 est un devis de dev. Avec la section 1, c'est une décision financière, et elle se prend plus vite.
- Toujours une ligne « hors périmètre ». C'est elle qui évite les demandes gratuites en cours de Sprint et qui prépare le Sprint suivant.
- Mentions obligatoires sur devis et factures en France : nom, adresse, SIREN, mention TVA (franchise ou taux), numéro et date, désignation et prix, conditions de paiement, pénalités de retard et indemnité de 40 €. Si micro-entreprise : « TVA non applicable, art. 293 B du CGI ».
