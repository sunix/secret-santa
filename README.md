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

## Publication sur Google Play Store 📱

L'application peut être publiée sur le Google Play Store en tant qu'application Android native grâce à la technologie Trusted Web Activity (TWA).

### 🚀 Démarrage rapide

**➡️ Commencez ici : [GETTING_STARTED.md](GETTING_STARTED.md)**

Ce guide vous accompagne pas à pas pour publier l'application sur Google Play Store.

### 📚 Documentation complète

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Guide de démarrage pour débutants
- **[QUICKSTART_PLAY_STORE.md](QUICKSTART_PLAY_STORE.md)** - Référence rapide
- **[GOOGLE_PLAY_GUIDE.md](GOOGLE_PLAY_GUIDE.md)** - Guide détaillé complet
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Index de toute la documentation

### Résumé rapide

1. **Installer les dépendances**:
   ```bash
   npm install
   ```

2. **Créer un keystore Android** (première fois seulement):
   ```bash
   keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
   ```

3. **Configurer Digital Asset Links**:
   - Obtenir l'empreinte SHA-256 de votre keystore
   - Mettre à jour `.well-known/assetlinks.json`
   - Déployer sur GitHub Pages

4. **Construire l'application Android**:
   ```bash
   npm run android:build
   ```

5. **Télécharger sur Play Console**:
   - Créer une application dans [Google Play Console](https://play.google.com/console)
   - Télécharger le fichier `app-release-bundle.aab`
   - Compléter les informations de la fiche Play Store
   - Soumettre pour révision

### Build automatisé avec GitHub Actions

Un workflow GitHub Actions (`.github/workflows/build-android.yml`) peut automatiser la construction de l'application Android. Configurez les secrets suivants dans votre repository :

- `KEYSTORE_BASE64` : Votre keystore encodé en base64
- `KEYSTORE_PASSWORD` : Mot de passe du keystore
- `KEY_PASSWORD` : Mot de passe de l'alias

Joyeuses fêtes ! 🎄🎁