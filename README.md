# Aquariow Legacy

Prototype de jeu navigateur inspire de la boucle de soin, de collection et de communaute d'un jeu d'aquariums virtuels.

## Ce que contient le MVP

- un aquarium principal avec simulation en temps reel
- des poissons a adopter, nourrir, faire grandir et vendre
- une boutique avec ressources et decorations
- des missions quotidiennes et une recompense journaliere
- un port communautaire avec visites, mur d'activite et ambiance sociale
- une sauvegarde locale via `localStorage`

## Lancer le prototype

Ouvre simplement [index.html](C:\Users\lesci\Documents\Aquariow\index.html) dans un navigateur moderne.

Le jeu ne depend d'aucun package externe: tout est dans `index.html`, `styles.css` et `app.js`.

## Structure

- [index.html](C:\Users\lesci\Documents\Aquariow\index.html): structure de l'interface
- [content.js](C:\Users\lesci\Documents\Aquariow\content.js): catalogue de contenu du jeu
- [styles.css](C:\Users\lesci\Documents\Aquariow\styles.css): direction artistique, layout responsive, animations
- [app.js](C:\Users\lesci\Documents\Aquariow\app.js): simulation, economie, missions, communaute et persistance
- [CONTENT_GUIDE.md](C:\Users\lesci\Documents\Aquariow\CONTENT_GUIDE.md): guide pour enrichir le contenu sans casser le moteur

## Contenu industrialise

- catalogue d'especes enrichi avec raretes, biomes et niveaux de debloquage
- pool de missions quotidiennes avec rotation automatique de 3 missions par jour
- evenements saisonniers plus varis
- base de decors et de profils communautaires plus large

## Evolutions naturelles vers une vraie version multijoueur

- remplacer `localStorage` par une API serveur autoritaire
- persister les comptes, aquariums, echanges et chats dans une base de donnees
- brancher des notifications temps reel pour visites, cadeaux et marche
- ajouter plusieurs aquariums, elevage avance, clans et evenements saisonniers
