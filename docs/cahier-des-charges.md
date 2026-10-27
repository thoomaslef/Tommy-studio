# Cahier des charges — Tommy Studio en libre-service (bâtiment)

> Document de travail. On coche les cases au fur et à mesure.
> Dernière mise à jour : 21 octobre 2026 — lots 1 à 5 faits (sauf anti-robots renforcé, sous-domaines et emails clients, qui attendent le passage des DNS chez Vercel).
> Variation des sites : 3 modèles × 12 palettes × 6 associations de polices × 3 formes × 3 en-têtes × 2 mises en page de services et de galerie × 4 ordres de sections, tirés de façon stable pour chaque entreprise.

## 1. Le principe en une phrase

Un artisan du bâtiment arrive sur tommy-studio.pro, remplit ses infos, envoie ses photos, **voit immédiatement l'aperçu de son site**, le modifie jusqu'à ce qu'il lui plaise, **paie seulement à ce moment-là**, et son site est mis en ligne automatiquement. Thomas n'intervient pas, sauf exception.

## 2. Parcours client

1. **Choix du métier** : plombier, électricien, maçon, couvreur, menuisier, peintre, carreleur, paysagiste, chauffagiste, plaquiste, multiservice…
2. **Infos de l'entreprise** : nom, ville, zone d'intervention (communes ou rayon en km), téléphone, email, horaires, SIRET, certifications (RGE, Qualibat…), assurance décennale (oui/non, assureur).
3. **Services** : une liste pré-remplie selon le métier, à cocher et compléter, avec les prix si le client veut les afficher.
4. **Photos** : logo, réalisations, éventuellement avant/après, photo de l'équipe.
5. **Style** : choix parmi 2 ou 3 modèles et une couleur principale.
6. **Aperçu** : le site complet s'affiche (vue mobile et vue ordinateur), avec un bandeau « Aperçu — non publié ». Le client peut revenir modifier n'importe quelle étape. Un lien privé lui permet de reprendre plus tard.
7. **Paiement** : quand tout lui convient, il paie via Stripe.
8. **Mise en ligne automatique** : son site est en ligne sur `son-entreprise.tommy-studio.pro`. Il reçoit un email avec son adresse et les tutos.
9. **Options en autonomie** (tutos sur le site) :
   - brancher son propre nom de domaine ;
   - télécharger son site (fichier ZIP) et l'héberger lui-même ;
   - créer sa fiche Google Business, avec ses infos pré-rédigées à copier-coller.

## 3. Ce qui sera automatique, et ce qui ne pourra pas l'être

| Élément | Automatique ? | Détail |
|---|---|---|
| Création du site à partir des infos | Oui | Modèles conçus pour le bâtiment, remplis avec les données du client. Pas de travail manuel. |
| Aperçu avant paiement | Oui | Rendu instantané à partir des mêmes modèles. |
| Rédaction des textes | Oui, en option | Rédaction par l'IA (API Claude) à partir des infos du client. Coût de quelques centimes par site, à confirmer. |
| Paiement | Oui | Stripe Checkout + confirmation automatique (webhook). |
| Mise en ligne sur `nom.tommy-studio.pro` | Oui | Tous les sites clients sont servis par le site Tommy Studio lui-même. Pas de déploiement par client. |
| Nom de domaine perso du client | Partiellement | Tuto pas à pas. Automatisable plus tard via l'API Vercel. |
| Hébergement par le client lui-même | Oui | Export ZIP + tuto (Netlify Drop, hébergeur au choix). |
| Fiche Google Business | **Non** | Google exige que le propriétaire vérifie lui-même son entreprise (courrier, appel ou vidéo), et l'accès à son API est soumis à validation. On fournit donc un tuto et une fiche pré-remplie à copier. |
| Support client | Non | Une page d'aide et une FAQ réduisent les questions, mais il en restera quelques-unes pour Thomas. |

## 4. Architecture technique (simple)

- **Site Next.js existant** (ce dépôt), hébergé sur Vercel.
- **Supabase** (déjà connecté) : base de données (projets clients, statuts, paiements) et stockage des photos. Remplace Cloudflare R2.
- **Modèles de sites** : composants React qui reçoivent les données du client. Un seul moteur sert à l'aperçu, au site publié et à l'export ZIP.
- **Sites clients** : servis sur des sous-domaines `*.tommy-studio.pro`. Le site reconnaît le sous-domaine et affiche le bon client.
- **Stripe** : paiement et confirmation.
- **Resend** : emails aux clients (lien de reprise, confirmation, mise en ligne).
- **Page `/admin`** protégée : liste des projets et intervention si besoin.

## 5. Les lots, dans l'ordre

Chaque lot est utilisable seul. Légende : 🤖 = je le fais seul · 👤 = action de Thomas nécessaire.

### Lot 0 — Décisions (👤 Thomas)
- [ ] Prix : une formule unique ou plusieurs ? Proposition : un site d'une page complète à prix unique, plus des options.
- [ ] Hébergement : passer Vercel en Pro (environ 20 $/mois, usage commercial autorisé), ou garder Hobby le temps du test.
- [ ] Où sont gérés les DNS de tommy-studio.pro (Vercel, OVH, autre) ? Nécessaire pour les sous-domaines clients.
- [x] Accord pour créer les tables et le stockage dans le projet Supabase existant.

### Lot 1 — Fondations données 🤖 (+ 👤 2 clés à coller dans Vercel)
- [x] Tables Supabase (préfixées `site_`, séparées de l'autre application du projet) : `projects` (infos client, statut : brouillon / aperçu / payé / en ligne), `assets` (photos).
- [x] Bucket de stockage pour les photos : lecture publique par adresse imprévisible, écriture seulement via le serveur.
- [x] Lien privé de reprise par projet (jeton secret, sans compte ni mot de passe).
- [ ] Photos du configurateur via Supabase Storage (bucket `site-media`, créé). La page d'envoi de fichiers lourds (vidéos) reste à part pour l'instant.
- [ ] Suppression automatique des projets non publiés 12 mois après leur dernière modification (engagement pris dans la politique de confidentialité).

### Lot 2 — Modèles bâtiment 🤖
- [x] Modèle 1 « Classique » : en-tête avec téléphone et bouton « Devis gratuit », services, zone d'intervention, réalisations, avis, certifications, contact.
- [x] Modèle 2 « Moderne ».
- [x] Modèle 3 « Robuste » (optionnel).
- [x] Listes de services pré-remplies par métier.
- [x] Optimisation Google intégrée : balises, données structurées `LocalBusiness`, métier et ville dans les titres.
- [x] Version mobile soignée, avec bouton d'appel fixe.
- [x] Jeux de données d'exemple pour chaque métier, qui servent aussi de démos sur la vitrine.

### Lot 3 — Configurateur 🤖
- [x] Parcours en étapes : métier → entreprise → services → photos → style.
- [x] Envoi des photos avec compression automatique (photos de téléphone souvent très lourdes).
- [x] Sauvegarde automatique du brouillon à chaque étape.
- [x] Limites : 12 photos, 15 Mo par fichier, formats JPEG/PNG/WebP, champs nettoyés côté serveur. Champ piège anti-robots.
- [ ] Anti-robots renforcé (Cloudflare Turnstile, gratuit) avant l'ouverture publique.
- [ ] Nettoyage des fichiers envoyés mais jamais confirmés (à faire avec le lot 8).

### Lot 4 — Aperçu 🤖
- [x] Page `/apercu/[jeton]` : le site complet avec un bandeau « Aperçu — non publié », non indexé par Google.
- [x] Bascule vue mobile / vue ordinateur.
- [x] Bouton « Modifier » qui renvoie à l'étape voulue.
- [ ] Bouton « C'est parfait, je publie » qui mène au paiement.

### Lot 5 — Paiement et mise en ligne 🤖 (+ 👤 compte Stripe et clés)
- [x] Lien de paiement Stripe (99 €, `plink_1UT2b8…`) ouvert avec l'identifiant du projet (`client_reference_id`) et l'email du client pré-rempli. Montant fixé chez Stripe, jamais par le navigateur.
- [x] Webhook `/api/stripe/webhook` (signature vérifiée, rejeu sans effet, autres applis du compte Stripe ignorées) : le site passe directement « en ligne » avec une adresse unique.
- [x] Adresse attribuée automatiquement (`nom-entreprise`, puis `nom-entreprise-ville`, puis `-2`…). En attendant les DNS : `www.tommy-studio.pro/s/nom-entreprise`. Le code des sous-domaines (`src/proxy.ts`) est prêt : passer `SUBDOMAINS_ENABLED` à `true` dans `src/lib/live-site.ts` une fois `*.tommy-studio.pro` branché.
- [x] Page `/paiement/merci` : attend la confirmation et affiche l'adresse du site. Le configurateur affiche aussi l'adresse et publie les modifications aussitôt.
- [ ] Email au client : adresse du site, lien de modification, tutos (nécessite le domaine vérifié chez Resend).
- [x] Email à Thomas : « site vendu », avec alerte en cas de paiement sans projet ou de double paiement.

### Lot 6 — Autonomie du client 🤖
- [ ] Tuto « Brancher mon nom de domaine ».
- [ ] Export ZIP du site + tuto « Héberger mon site moi-même ».
- [ ] Tuto « Créer ma fiche Google Business », avec description, catégories et horaires déjà rédigés à copier.
- [ ] Modifications après publication : le client modifie ses infos depuis son lien privé. Gratuit ou payant, à décider.

### Lot 7 — Textes par l'IA 🤖 (+ 👤 clé API Anthropic)
- [ ] Bouton « Rédigez mes textes » : présentation et descriptions des services rédigées à partir des infos du client.
- [ ] Le client relit et corrige dans l'aperçu.
- [ ] Plafond d'utilisation par projet pour maîtriser le coût.

### Lot 8 — Admin et suivi 🤖
- [ ] Page `/admin` protégée : liste des projets, statut, accès à l'aperçu.
- [ ] Relance automatique par email des aperçus non payés (après 2 jours, puis 7 jours).
- [ ] Mise hors ligne d'un site (impayé, abus).

### Lot 9 — Lancement 👤🤖
- [ ] Vitrine repensée pour le bâtiment : démos par métier, « Créez votre site en 10 minutes ».
- [ ] CGV mises à jour (aperçu gratuit, paiement à la publication, modifications), à faire relire. 👤
- [ ] Politique de confidentialité mise à jour (photos, durée de conservation).
- [ ] Domaine d'envoi vérifié dans Resend, pour écrire aux clients depuis @tommy-studio.pro. 👤
- [ ] Tests de bout en bout sur téléphone.
- [ ] Premiers clients : objectif 3 ventes en 4 à 6 semaines.

## 6. Coûts de fonctionnement estimés

À vérifier sur les sites officiels, les offres changent souvent.

| Poste | Coût | Remarque |
|---|---|---|
| Développement | 0 € | Fait avec Claude Code. |
| Vercel | 0 € (Hobby) ou ~20 $/mois (Pro) | Hobby est réservé à un usage non commercial. |
| Supabase | 0 € au départ | L'offre gratuite a des limites de stockage et peut mettre en pause un projet inactif. |
| Stripe | ~1,5 % + 0,25 € par paiement (carte européenne) | Pas d'abonnement. |
| Resend | 0 € au départ | Quota mensuel gratuit. |
| API Claude (textes) | Quelques centimes par site | Seulement si le lot 7 est activé. |
| Nom de domaine tommy-studio.pro | Déjà payé | — |

## 7. Risques et limites

- **Trouver des clients** reste le vrai défi : l'automatisation réduit le temps passé par site, pas le besoin de se faire connaître.
- **Qualité perçue** : un site généré doit avoir l'air fait sur mesure. Les modèles doivent être très soignés, et les photos du client comptent beaucoup.
- **Aperçus sans paiement** : certains visiteurs feront un aperçu sans payer. C'est normal ; le bandeau, la non-indexation et l'expiration limitent les abus.
- **Support** : il restera quelques questions, surtout sur les noms de domaine.
- **Juridique** : CGV, mentions et assurance à faire valider. Thomas reste responsable de ce qui est vendu.

## 8. Évolution : d'autres métiers après le bâtiment

Décision : on lance et on vend **uniquement le bâtiment** d'abord (objectif 3 ventes), mais le code est prêt à s'ouvrir.

- Ajouter un métier proche du bâtiment (serrurier, vitrier, déménageur, nettoyage, services à domicile) = une entrée dans `src/site-engine/trades.ts` (services, accroches, palettes, type Google). Aucun changement de modèle.
- Métiers avec d'autres besoins (restaurant, commerce, bien-être, coach…) : nouvelles sections à créer (carte/menu, réservation, horaires détaillés, tarifs), et regrouper les métiers par secteur dans le configurateur.
- À éviter : les secteurs déjà couverts par une plateforme dominante (ex. coiffure avec Planity).

## 9. Site Tommy Studio remis en cohérence (21 octobre 2026)

- Supprimé : ancienne offre à 3 formules (Services, commande en 5 étapes, page merci), pages Caen et Normandie, ancienne page d'envoi de fichiers (Cloudflare R2), API associées. Les anciennes adresses redirigent (308) vers `/creer`, `/#tarif` ou l'accueil.
- Accueil réécrit autour du libre-service bâtiment, tarif unique dans `src/lib/offer.ts` (99 €, puis 39 €/an).
- Paiement automatique (lot 5) : le bouton « Payer et publier » envoie vers Stripe ; le site est en ligne dès le paiement confirmé. Le compte Stripe est partagé avec d'autres applications : leurs webhooks reçoivent aussi nos paiements et doivent les ignorer (métadonnée `app = tommy-studio-sites`).
- CGV et politique de confidentialité réécrites pour ce parcours (sous-traitants : Vercel, Supabase, Resend, Stripe). À faire relire. Service réservé aux professionnels (27 oct.) : SIRET obligatoire et vérifié (clé de Luhn) avant paiement, nom d'entreprise obligatoire sur la page Stripe, CGV sans droit de rétractation ni médiateur de la consommation (inutiles hors vente aux consommateurs). Si un jour on vend aux particuliers : adhérer à un médiateur (ex. La Médiation Professionnelle, 30 € TTC pour 3 ans) et rétablir la rétractation.
- Factures (21 oct.) : Stripe génère une facture acquittée après chaque paiement (lien `plink_1UT2b8…`, `invoice_creation`), avec SIRET, « TVA non applicable, art. 293 B du CGI », mentions pour les clients professionnels ; adresse de facturation obligatoire, raison sociale et n° de TVA facultatifs. L'adresse du vendeur et l'envoi des emails viennent des réglages du tableau de bord Stripe.

## 10. Audit du 27 octobre 2026 et lot 1 de corrections

Audit complet (vitesse et Google, parcours d'un artisan sur téléphone, sécurité du code). Lot 1 fait :
- Next.js 16.4.3 (failles corrigées), DNS chez Vercel, sous-domaines `nom-entreprise.tommy-studio.pro` actifs (`www.../s/<slug>` y redirige), adresse affichée avant le paiement.
- Domaine vérifié chez Resend : emails envoyés depuis thomas@tommy-studio.pro. Après paiement, le client reçoit l'adresse de son site et son lien privé (gardé chiffré, colonne `edit_token_enc`, clé `TOKEN_ENCRYPTION_KEY`). La page `/paiement/merci` retrouve le site par la session Stripe. Les échecs d'envoi sont signalés à Thomas.
- Aperçu en lecture seule par identifiant (`/apercu/<id>`) : le lien privé n'est plus exposé par l'aperçu.
- Sauvegarde quotidienne (tâche Vercel `/api/cron/sauvegarde`, `CRON_SECRET`) : export JSON des tables envoyé par email les jours où quelque chose a changé. Schéma versionné dans `supabase/schema.sql`. Photos limitées à 5 Mo.
- Textes : « 99 € la 1re année, puis 39 €/an sans engagement » partout. Démos et /modeles avec bouton « Créer mon site de … » (ouvre /creer avec le métier proposé), /modeles en captures au lieu de mini-sites intégrés, polices des sites clients chargées à la demande, champs à 16 px sur iPhone, contrastes relevés, page 404 en français, titres et aperçus de partage propres à chaque page, image de partage 1200×630, robots.txt et sitemap corrigés.

Reste à faire (lots suivants) : anti-abus (limite d'envois de photos, pare-feu), purge RGPD des brouillons à 12 mois et des fichiers orphelins, renouvellement 39 €/an (rappel, paiement, mise hors ligne), contrôle des sites publiés (SIRET via l'API Recherche d'entreprises, alerte de modification, procédure hors ligne), aperçu sur mobile pendant la saisie et vignettes des modèles, formulaire de devis sur les sites clients, contact téléphone/WhatsApp dans le parcours, vraies références clients, pages par métier pour Google, en-têtes de sécurité, tests automatiques, Sentry.
À décider par Thomas : Vercel Pro avant la première vente, désactiver l'Adaptive Pricing Stripe (prix affiché en dollars à l'étranger), photo professionnelle, numéro WhatsApp, garantie.
