# Secret Santa 🎅

Une application web progressive (PWA) pour organiser un Secret Santa avec vos amis !

## Fonctionnalités

- 🎲 **Ajout de participants** : Saisissez facilement les noms de tous les participants
- 🎁 **Tirage séquentiel** : Tirez un premier candidat, puis celui à qui il offre un cadeau, et ainsi de suite
- 💑 **Gestion des couples** : Indiquez les couples qui ne doivent pas se tirer entre eux
- 🔄 **Retirage** : Possibilité de refaire un tirage si nécessaire
- 📱 **PWA** : Installez l'application sur votre appareil mobile ou ordinateur
- 🎨 **Interface festive** : Design aux couleurs de Noël

## Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Ajoutez les participants un par un
3. (Optionnel) Ajoutez des couples qui ne doivent pas se tirer entre eux
4. Cliquez sur "Commencer le tirage"
5. Révélez progressivement qui offre à qui en cliquant sur "Tirer le suivant"
6. Consultez le résumé final de tous les échanges

## Installation locale

Servez simplement les fichiers via un serveur HTTP local :

```bash
python3 -m http.server 8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

## Structure du projet

- `index.html` : Structure HTML de l'application
- `styles.css` : Styles CSS avec thème festif
- `app.js` : Logique JavaScript de l'application
- `manifest.json` : Manifest PWA pour l'installation
- `sw.js` : Service Worker pour le fonctionnement hors ligne
- `icon-*.png` : Icônes pour la PWA

## Technologies

- HTML5
- CSS3 (avec animations et design responsive)
- JavaScript Vanilla (ES6+)
- PWA (Progressive Web App)

Joyeuses fêtes ! 🎄🎁