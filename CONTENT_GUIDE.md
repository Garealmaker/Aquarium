# Content Guide

Le contenu du jeu vit maintenant surtout dans [content.js](C:\Users\lesci\Documents\Aquariow\content.js).

## Catalogue actuel

- `species`: catalogue des poissons avec rarete, biome, niveau de debloquage, revenus et couleurs
- `shopItems`: ressources et decorations achetables
- `events`: rotation des evenements saisonniers
- `missionPool`: pool de missions quotidiennes a partir duquel le jeu en choisit 3 chaque jour
- `communityPlayers`: profils communautaires affiches dans le port
- `tips`, `fishNames`, `decorLabels`: contenu secondaire et aides d'affichage

## Regles de structure

- garder des `id` stables et uniques
- preferer des champs simples et lisibles
- ajouter de nouveaux contenus dans `content.js` avant de toucher a `app.js`
- quand une nouvelle mecanique apparait, lui donner un `tracker` dedie dans `missionTrackers`

## Pipeline de croissance recommande

1. Etendre les especes par biome et palier de niveau
2. Ajouter des familles de decors avec themes visuels clairs
3. Creer des saisons de 4 a 6 evenements qui font tourner la meta
4. Etendre le `missionPool` avec objectifs de collection, reproduction et social
5. Plus tard, deplacer ce catalogue vers du JSON ou une base de donnees serveur

## Prochaines extensions naturelles

- biomes d'aquarium complets avec bonus de set
- familles d'especes et album de collection
- objets saisonniers limites dans le temps
- quetes narratives hebdomadaires
- contenus communautaires rares declenches par evenements
