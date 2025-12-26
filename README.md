# Secret Santa 🎅

Une application web progressive (PWA) pour organiser un Secret Santa avec vos amis !

🎄 **[Accéder à l'application](https://sunix.github.io/secret-santa)** 🎄

## Fonctionnalités

- 🎲 **Ajout de participants** : Saisissez facilement les noms de tous les participants
- 🎁 **Tirage séquentiel** : Tirez un premier candidat, puis celui à qui il offre un cadeau, et ainsi de suite
- 💑 **Gestion des couples** : Indiquez les couples qui ne doivent pas se tirer entre eux
- 🔄 **Retirage** : Possibilité de refaire un tirage si nécessaire
- 📱 **PWA** : Installez l'application sur votre appareil mobile ou ordinateur
- 🎨 **Interface festive** : Design aux couleurs de Noël

## Utilisation

### En ligne

Visitez simplement [https://sunix.github.io/secret-santa](https://sunix.github.io/secret-santa)

### Installation locale

Pour tester localement, servez les fichiers via un serveur HTTP :

```bash
python3 -m http.server 8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

### Guide d'utilisation

1. Ajoutez les participants un par un
2. (Optionnel) Ajoutez des couples qui ne doivent pas se tirer entre eux
3. Cliquez sur "Commencer le tirage"
4. Révélez progressivement qui offre à qui en cliquant sur "Tirer le suivant"
5. Consultez le résumé final de tous les échanges

## Hébergement GitHub Pages

L'application est hébergée sur GitHub Pages et accessible à l'adresse :
**https://sunix.github.io/secret-santa**

Pour déployer les modifications :
1. Les commits sur la branche principale sont automatiquement déployés
2. Ou configurez GitHub Pages dans les paramètres du repository pour utiliser la branche de votre choix

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