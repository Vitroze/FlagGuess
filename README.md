# FlagGuess

FlagGuess est un petit quiz de géographie autour des drapeaux et des pays. L'utilisateur choisit une région, répond à des questions à choix multiple et suit son score au fil de la partie.

## Fonctionnalités

- Choix de la région : tout, Europe, Afrique, Amériques, Asie ou Océanie.
- Affichage d'un drapeau avec 4 propositions de pays.
- Score affiché à l'écran avec sauvegarde locale.
- Paramètres pour changer la langue de l'interface.
- Réinitialisation du score et du cache des données.
- Interface responsive légère, avec alertes gérées via SweetAlert2.

## Technologies utilisées

- HTML
- CSS
- JavaScript
- SweetAlert2 via CDN
- Font Awesome via CDN
- API REST Countries

## Lancer le projet

1. Ouvrir le dossier du projet dans VS Code ou dans votre explorateur de fichiers.
2. Ouvrir le fichier `index.html` dans un navigateur.
3. Choisir une région pour démarrer la partie.

## Notes

- Une connexion Internet est nécessaire pour charger les données des pays depuis l'API.
- Le jeu utilise `localStorage` pour mémoriser la langue, le score et le cache des données.
- Si les données deviennent obsolètes, vous pouvez vider le cache depuis le menu des paramètres. Les données se retéléchargement automatiquement après 1 heure.
