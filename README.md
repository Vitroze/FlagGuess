# FlagGuess

FlagGuess est un petit quiz de géographie autour des drapeaux et des pays. L'utilisateur choisit une région, répond à des questions à choix multiple et suit son score au fil de la partie.

## Fonctionnalités

- Choix de la région : tout, Europe, Afrique, Amériques, Asie ou Océanie.
- Affichage d'un drapeau avec 4 propositions de pays.
- Score affiché à l'écran avec sauvegarde locale.
- Paramètres pour changer la langue de l'interface.
- Réinitialisation du score et du cache des données.
- Interface responsive légère, avec alertes gérées via SweetAlert2.
- Langages disponibles :
  - Français
  - Anglais

## Technologies utilisées

- HTML
- CSS
- JavaScript
- SweetAlert2 via CDN
- Font Awesome via CDN
- API REST Countries

## Guide d'installation

### Pour un utilisateur (tester rapidement le site)

1. Ouvrir le site publié via GitHub Pages : [FlagGuess](https://vitroze.github.io/FlagGuess/).
2. Si la page n'est pas encore disponible (publication en cours), patienter quelques minutes puis actualiser.
3. Choisir une région pour commencer la partie.

## Notes

- Une connexion Internet est nécessaire pour charger les données des pays depuis l'API.
- Le jeu utilise `localStorage` pour mémoriser la langue, le score et le cache des données.
- Si les données deviennent obsolètes, vous pouvez vider le cache depuis le menu des paramètres. Les données se retéléchargement automatiquement après 1 heure.

## Visuel

### Page d'accueil

<img width="1859" height="921" alt="image" src="https://github.com/user-attachments/assets/98818106-bbef-4f78-a844-ec56c5554697" />

### Paramètres

<img width="1858" height="924" alt="image" src="https://github.com/user-attachments/assets/2f050bec-aaef-4822-aef1-c4ddb73394ff" />

### Jouer

<img width="1861" height="920" alt="image" src="https://github.com/user-attachments/assets/d546b332-c8d1-402d-af45-fb991b2fb16c" />
