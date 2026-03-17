# Checklist Pre-Deploiement Online

Cette checklist sert a valider la V1 online avant une mise en ligne publique.

## 1. Configuration

- `Online version/supabase-config.js` pointe vers le bon projet Supabase
- `Online version/schema.sql` a ete reexecute integralement sur l'environnement cible
- les URLs autorisees Supabase Auth sont a jour
- le mode confirmation email est choisi en connaissance de cause
- le domaine local de test et le domaine de production sont renseignes

## 2. Authentification

- inscription avec `email + mot de passe + pseudo + date d'anniversaire`
- refus d'un pseudo deja pris
- refus d'un email invalide
- refus d'un mot de passe trop court
- connexion avec `pseudo + mot de passe`
- deconnexion depuis le jeu principal
- reconnexion apres fermeture/reouverture du navigateur

## 3. Onboarding

- premier ecran de bienvenue visible seulement sur un nouveau compte
- achat `CO2 II` fonctionne
- achat des 2 plantes fonctionne
- phase de plantation valide bien l'etape
- reglage lumiere a `4 h` valide l'etape
- achat du premier poisson fonctionne
- achat nourriture fonctionne
- premier nourrissage fonctionne
- premier cycle gratuit fonctionne
- baisse exceptionnelle du `pH` de `-1` appliquee pendant ce cycle tutoriel
- nettoyage valide l'etape
- achat `pH+` et `pH-` fonctionne
- premier `pH+` fixe exceptionnellement le pH a `7,1`
- recompense finale `200 coquillages + 10 perles`
- fermeture finale via la petite croix
- le tutoriel disparait ensuite definitivement

## 4. Cycle global joueur

- tous les aquariums partagent bien le meme cycle
- seules les `4 h` ou l'action `3 perles` font avancer le cycle
- les autres actions ne consomment que du temps
- changement d'aquarium n'altere pas le numero de cycle
- relog apres attente applique bien les cycles automatiques manques

## 5. Gestion du bac

- nourrir fonctionne
- nettoyer fonctionne
- temperature via curseur fonctionne
- lumiere via curseur fonctionne
- les curseurs coutent bien `5 min`
- si le temps est insuffisant, le curseur revient a la valeur precedente
- utilisation `pH+` et `pH-` depuis inventaire fonctionne
- la sante du bac s'actualise correctement apres action

## 6. Boutique et inventaire

- achat de poisson fonctionne
- achat de plante fonctionne
- achat de nourriture fonctionne
- achat `pH+` fonctionne
- achat `pH-` fonctionne
- achat des equipements `lampe`, `CO2`, `filtre` fonctionne
- le poisson achete arrive bien dans l'inventaire serveur ou le bac selon le flux prevu
- la plante achetee arrive bien en inventaire serveur
- les stocks d'inventaire s'actualisent sans refresh force

## 7. Placement et ventes

- placement d'un poisson depuis l'inventaire fonctionne
- vente d'un poisson du bac fonctionne
- vente d'un poisson de reserve fonctionne
- plantation d'une plante depuis l'inventaire fonctionne
- plusieurs plantations possibles sans recliquer sur le mode plantation
- deplacement d'une plante fonctionne
- retrait d'une plante vers l'inventaire fonctionne
- vente d'une plante plantee fonctionne
- vente d'une plante en reserve fonctionne
- rechargement de page conserve les positions serveur

## 8. Multi-aquariums

- achat d'un nouvel aquarium fonctionne
- renommage d'un aquarium fonctionne
- changement d'aquarium recharge bien l'etat serveur
- les preferences UI reviennent apres reload
- l'etat metier ne vient pas d'un vieux `localStorage`

## 9. Progression et recompenses

- recompense du jour fonctionne
- missions reclamables fonctionnent
- XP / niveau / coquillages / perles s'actualisent bien
- relog conserve les gains
- pas de perte de progression apres refresh

## 10. Robustesse online

- si le core state serveur n'est pas encore pret, les actions sont bloquees
- l'interface affiche `Sync serveur` / `Synchronisation serveur en cours...`
- pas d'ouverture sur un faux etat local metier
- `aquariow-legacy-save` n'est plus utilise comme verite metier en mode online
- `aquariow-online-ui-cache` ne sert qu'aux preferences d'interface

## 11. Tests multi-comptes

- compte A et compte B ont bien des saves separees
- aucun melange de progression entre comptes
- changement de compte apres deconnexion fonctionne
- le tutoriel n'apparait que sur le bon compte

## 12. Pre-lancement public

- page d'entree online propre et compréhensible
- jeu principal lisible sans gros chevauchement de texte
- aquarium non deforme
- pas de scroll excessif sur la page de gestion
- message d'erreur auth compréhensible
- pas d'erreur critique visible en console sur les parcours principaux

## Feu vert

Le deploiement public est raisonnable si :

- les blocs `1` a `10` sont valides
- les tests multi-comptes sont bons
- aucun cas de desynchro n'est observe sur `achat > placement > cycle > relog`
