# Deploiement Online

Ce guide sert a mettre Aquariow online en production de maniere propre, avec Supabase pour l'auth/base et un hebergement statique pour le front.

Le plus simple pour cette V1 :

- frontend : Vercel
- backend / auth / base : Supabase

## 1. Verifier l'etat local

Avant toute publication :

- la checklist [PREDEPLOY_CHECKLIST.md](C:/Users/lesci/Documents/Aquariow/PREDEPLOY_CHECKLIST.md) est validee
- [Online version/schema.sql](C:/Users/lesci/Documents/Aquariow/Online%20version/schema.sql) est a jour
- [Online version/supabase-config.js](C:/Users/lesci/Documents/Aquariow/Online%20version/supabase-config.js) pointe vers le bon projet Supabase

## 2. Preparer Supabase

Dans Supabase :

1. Ouvre le bon projet de production.
2. Va dans `SQL Editor`.
3. Execute integralement [Online version/schema.sql](C:/Users/lesci/Documents/Aquariow/Online%20version/schema.sql).
4. Va dans `Authentication > Providers`.
5. Active `Email`.
6. Choisis si tu gardes ou non la confirmation email.

Pour un lancement test prive :

- tu peux laisser la confirmation email desactivee pour fluidifier l'entree

Pour un lancement public :

- active la confirmation email seulement si ton flux email est correctement configure

## 3. Configurer les URLs Auth Supabase

Dans `Authentication > URL Configuration` :

- `Site URL` : ton URL de production principale
- `Redirect URLs` : ajoute au minimum
  - l'URL racine du site
  - la page online
  - la page du jeu online
  - ton URL locale de test si tu veux continuer a tester en local

Exemple typique :

- `https://ton-domaine.vercel.app`
- `https://ton-domaine.vercel.app/Online%20version/`
- `https://ton-domaine.vercel.app/Online%20version/game.html`
- `http://127.0.0.1:5500/Online%20version/index.html`

## 4. Verifier la config front

Dans [Online version/supabase-config.js](C:/Users/lesci/Documents/Aquariow/Online%20version/supabase-config.js), renseigne :

- `url` : URL du projet Supabase
- `anonKey` : cle publique `anon`

Important :

- la `anonKey` est bien une cle publique front
- n'utilise jamais la `service_role` dans le navigateur

## 5. Mettre le projet sur Git

Si ce n'est pas deja fait :

1. pousse le projet dans un repo Git
2. verifie que la version de [Online version/supabase-config.js](C:/Users/lesci/Documents/Aquariow/Online%20version/supabase-config.js) reference bien la prod

## 6. Deployer sur Vercel

Dans Vercel :

1. `Add New Project`
2. connecte ton repo
3. garde la racine du projet sur `C:\Users\lesci\Documents\Aquariow`
4. framework preset : `Other`
5. build command : vide
6. output directory : vide
7. deploye

Comme le projet est statique, Vercel sert simplement les fichiers.

## 7. Tester la prod juste apres deploiement

Teste dans cet ordre :

1. ouverture de la page online
2. creation de compte
3. connexion avec `pseudo + mot de passe`
4. ouverture du jeu
5. tutorial complet sur un compte neuf
6. achat poisson / plante
7. plantation
8. nourrissage
9. cycle
10. nettoyage
11. refresh
12. deconnexion / reconnexion
13. second compte

## 8. Ce qu'il faut surveiller

Si un probleme apparait, les zones les plus probables sont :

- URLs de redirection Supabase manquantes
- mauvais projet Supabase cible
- vieux `schema.sql` pas reapplique
- navigateur qui garde une ancienne session/cache
- confirmation email activee sans flux mail bien gere

## 9. Lancement controle recommande

Je te recommande de faire :

1. une mise en ligne privee
2. quelques comptes de test
3. une courte phase de validation reelle
4. puis ouverture plus large

## 10. Apres mise en ligne

Les prochaines priorites produit les plus logiques :

- boucle post-tuto
- polissage final UI
- premieres fonctions sociales visibles
- suivi des erreurs reelles remontant des joueurs
