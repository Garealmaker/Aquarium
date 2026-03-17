# Aquariow Online V1

Cette version sert a valider trois choses avant de brancher tout le jeu en ligne :

1. creation de compte
2. connexion/deconnexion
3. sauvegarde cloud du JSON de partie

Puis une quatrieme etape :

4. ouverture du vrai jeu avec synchro cloud autour de `localStorage`

Et maintenant un cinquieme bloc :

5. un noyau serveur autoritaire pour le joueur, les cycles, l'inventaire, les achats et le bac

## Fichiers

- `index.html` : interface de test
- `app.js` : logique Auth + lecture/ecriture Supabase
- `game.html` : page de lancement du vrai jeu connecte
- `game-boot.js` : bootstrap de session + chargement cloud + synchro vers Supabase
- `styles.css` : mise en forme
- `supabase-config.example.js` : modele de configuration client
- `schema.sql` : tables et policies RLS

## Ce qui est vraiment solide desormais

La page online contient maintenant deux couches :

1. couche de compatibilite
- `game_saves.state` stocke encore le JSON complet de la partie
- utile pour continuer a ouvrir le vrai jeu existant

2. couche serveur autoritaire
- `profiles` porte les monnaies et la progression de base
- `aquariums` porte les reglages et l'etat de base du bac
- `owned_fish`, `owned_plants` et `utility_inventory` portent les vivants et les stocks
- `sync_offline_cycles_for_user()` rattrape automatiquement les cycles de 4 h au prochain acces
- `advance_cycle_server(uuid)` execute un cycle manuel cote Supabase
- `buy_server_item(...)`, `use_inventory_utility_server(...)`, `update_aquarium_setting_server(...)`,
  `toggle_fish_placement_server(...)` et `toggle_plant_placement_server(...)` executent les actions critiques

Cela signifie que le premier vrai systeme critique peut deja vivre sans faire confiance au navigateur.

## Mise en place locale

1. Dans Supabase, ouvre le SQL Editor et execute `schema.sql`.
2. Dans `Online version`, copie `supabase-config.example.js` en `supabase-config.js`.
3. Remplace les placeholders par :
   - l'URL du projet Supabase
   - la cle publique `anon`
4. Sers le projet en HTTP local.
   - le plus simple : un petit serveur statique depuis la racine du projet
5. Ouvre `http://localhost:PORT/Online%20version/`.

## Test conseille

1. Cree un compte de test.
2. Connecte-toi.
3. Clique sur `Creer une sauvegarde demo`.
4. Clique sur `Charger depuis le cloud`.
5. Modifie le JSON dans l'editeur.
6. Clique hors du champ pour declencher l'envoi cloud.
7. Recharge la page.
8. Reconnecte-toi et recharge depuis le cloud.
9. Clique sur `Ecrire la sauvegarde cloud dans le navigateur` pour verifier que `localStorage` est bien alimente.

## Test du noyau serveur

1. Re-execute `schema.sql` dans Supabase pour ajouter les nouvelles tables/fonctions.
2. Recharge `Online version/index.html`.
3. Connecte-toi.
4. Clique sur `Initialiser le noyau serveur`.
5. Verifie qu'un profil serveur, un aquarium et les sections `Achats`, `Utilitaires`, `Placement` apparaissent.
6. Teste un achat de plante ou d'utilitaire.
7. Teste un reglage `Temperature` ou `Lumiere`.
8. Teste l'utilisation d'une `Pastille pH` ou de la `Nourriture`.
9. Place ou retire un poisson ou une plante.
10. Clique sur `Passer le cycle cote serveur`.
11. Verifie que :
   - les perles baissent lors d'un cycle manuel
   - le numero de cycle augmente
   - le temps repart a `120`
   - la qualite d'eau et le pH bougent cote serveur
   - les poissons / plantes et l'inventaire restent coherents

## Cycle hors ligne

Le modele recommande est maintenant en place :

- aucun cron externe n'est necessaire
- le serveur stocke `last_auto_cycle_at`
- au prochain chargement de l'etat, Supabase calcule les cycles de 4 h manques et les applique
- le joueur peut toujours forcer un cycle manuel contre des perles sans casser ce rythme automatique

## Test du vrai jeu online

1. Connecte-toi dans `Online version/index.html`.
2. Clique sur `Ouvrir le jeu`.
3. La page `game.html` charge la sauvegarde cloud, l'ecrit dans `localStorage`, puis ouvre le vrai jeu.
4. Joue quelques actions dans l'iframe.
5. Clique sur `Synchroniser maintenant`.
6. Recharge `game.html` puis verifie que l'etat est restaure.
7. Tu peux aussi cliquer sur `Recharger depuis le cloud` pour reappliquer l'etat serveur.

Important :
- le vrai jeu dans l'iframe reste encore majoritairement local + sync JSON
- le noyau serveur autoritaire sert de premiere brique solide pour sortir progressivement les actions critiques du navigateur

## Deploiement simple

### Option recommandee

- frontend : Vercel
- backend/auth/database : Supabase

### Sur Vercel

1. Pousse ce dossier dans un repo Git.
2. Cree un projet Vercel connecte au repo.
3. Configure le dossier racine si besoin.
4. Deploie.
5. Dans Supabase Auth :
   - renseigne la `Site URL`
   - ajoute l'URL de production dans les `Redirect URLs`
   - ajoute aussi les URLs locales et de production pour `index.html` et `game.html`

## Suite logique

Quand cette V1 marche, l'etape suivante est de relier le vrai jeu :

1. raccorder le vrai jeu iframe a ces RPC au lieu d'ecrire d'abord dans `localStorage`
2. etendre le serveur sur les concours, la reproduction et les interactions communautaires
3. reduire ensuite le gros JSON de compatibilite jusqu'a en faire un cache secondaire
