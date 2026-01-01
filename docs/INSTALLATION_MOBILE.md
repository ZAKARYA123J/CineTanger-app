# 📱 Manuel d'Installation Mobile - CinéTanger

## Guide Complet d'Installation de l'Application Mobile

---

## 📋 Table des Matières

1. [Prérequis](#-prérequis)
2. [Installation de l'Environnement](#-installation-de-lenvironnement)
3. [Configuration du Projet](#-configuration-du-projet)
4. [Lancement de l'Application](#-lancement-de-lapplication)
5. [Installation sur Appareil Physique](#-installation-sur-appareil-physique)
6. [Génération d'APK Android](#-génération-dapk-android)
7. [Build iOS](#-build-ios)
8. [Dépannage](#-dépannage)
9. [FAQ](#-faq)

---

## 🔧 Prérequis

### 1. Configuration Système Minimale

#### Pour Windows

- Windows 10 (64-bit) ou supérieur
- 8 GB RAM minimum (16 GB recommandé)
- 10 GB d'espace disque libre
- Processeur Intel i5 ou équivalent

#### Pour macOS

- macOS 10.15 (Catalina) ou supérieur
- 8 GB RAM minimum (16 GB recommandé)
- 10 GB d'espace disque libre
- Processeur Intel ou Apple Silicon

#### Pour Linux

- Ubuntu 20.04 LTS ou supérieur
- 8 GB RAM minimum (16 GB recommandé)
- 10 GB d'espace disque libre

### 2. Logiciels Requis

| Logiciel | Version          | Lien de Téléchargement         |
| -------- | ---------------- | ------------------------------ |
| Node.js  | 18.x ou 20.x     | https://nodejs.org/            |
| npm      | 9.x ou supérieur | Inclus avec Node.js            |
| Git      | 2.x              | https://git-scm.com/           |
| VS Code  | Latest           | https://code.visualstudio.com/ |

### 3. Pour Android (Optionnel)

- Android Studio (pour émulateur)
- JDK 11 ou supérieur
- Android SDK Platform 33

### 4. Pour iOS (macOS uniquement)

- Xcode 14 ou supérieur
- CocoaPods
- Compte développeur Apple (pour déploiement)

---

## 🚀 Installation de l'Environnement

### Étape 1: Installer Node.js et npm

#### Windows / macOS

```bash
# Télécharger depuis https://nodejs.org/
# Installer la version LTS recommandée

# Vérifier l'installation
node --version
# Devrait afficher: v18.x.x ou v20.x.x

npm --version
# Devrait afficher: 9.x.x ou supérieur
```

#### Linux (Ubuntu/Debian)

```bash
# Installer Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### Étape 2: Installer Git

#### Windows

```bash
# Télécharger depuis https://git-scm.com/
# Suivre l'assistant d'installation

# Vérifier
git --version
```

#### macOS

```bash
# Via Homebrew (recommandé)
brew install git

# Ou télécharger depuis https://git-scm.com/

# Vérifier
git --version
```

#### Linux

```bash
sudo apt-get update
sudo apt-get install git

# Vérifier
git --version
```

### Étape 3: Installer Expo CLI

```bash
# Installation globale d'Expo CLI
npm install -g expo-cli

# Vérifier l'installation
expo --version

# Alternative: utiliser npx (pas besoin d'installation globale)
npx expo --version
```

### Étape 4: Créer un Compte Expo (Optionnel mais Recommandé)

```bash
# Créer un compte sur https://expo.dev/signup
# Ou via la ligne de commande
npx expo register

# Se connecter
npx expo login
```

---

## 📦 Configuration du Projet

### Étape 1: Cloner le Projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-equipe/cinetanger.git

# Naviguer vers le dossier mobile
cd cinetanger/mobile

# Vérifier la structure
ls -la
```

### Étape 2: Installer les Dépendances

```bash
# Installer toutes les dépendances npm
npm install

# Ou avec yarn (si vous préférez)
yarn install

# Attendre la fin de l'installation (peut prendre 2-5 minutes)
```

### Étape 3: Configuration de l'API

#### Option A: Backend Local

```bash
# Créer le fichier de configuration
cd constant
nano Url.ts  # ou vim, ou ouvrir avec VS Code
```

Modifier `constant/Url.ts`:

```typescript
// Pour développement local
export const API_URL = "http://localhost:3000/api/v1/movies";

// Pour Android Emulator
// export const API_URL = "http://10.0.2.2:3000/api/v1/movies";

// Pour appareil physique (remplacer par votre IP)
// export const API_URL = "http://192.168.1.100:3000/api/v1/movies";
```

#### Option B: Backend en Production

```typescript
export const API_URL = "https://api.cinetanger.ma/api/v1/movies";
```

#### Trouver Votre Adresse IP Locale

**Windows:**

```bash
ipconfig
# Chercher "Adresse IPv4"
```

**macOS/Linux:**

```bash
ifconfig | grep inet
# Ou
ip addr show
```

### Étape 4: Vérifier les Fonts

```bash
# Les fonts doivent être dans le dossier fonts/
ls fonts/
# Devrait afficher:
# - Alkatra-VariableFont_wght.ttf
# - Knewave_400Regular.ttf (via @expo-google-fonts)
```

### Étape 5: Configuration des Variables d'Environnement (Optionnel)

Créer `.env` dans le dossier mobile:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1/movies
EXPO_PUBLIC_APP_NAME=CinéTanger
EXPO_PUBLIC_APP_VERSION=1.0.0
```

---

## ▶️ Lancement de l'Application

### Méthode 1: Expo Go (Recommandé pour Développement)

#### 1. Installer Expo Go sur Votre Téléphone

**Android:**

- Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

**iOS:**

- App Store: https://apps.apple.com/app/expo-go/id982107779

#### 2. Démarrer le Serveur de Développement

```bash
cd mobile

# Démarrer Expo
npx expo start

# Ou avec cache clear
npx expo start -c

# Ou avec tunnel (si problème de connexion)
npx expo start --tunnel
```

#### 3. Scanner le QR Code

**Android:**

- Ouvrir Expo Go
- Scanner le QR code affiché dans le terminal

**iOS:**

- Ouvrir l'appareil photo
- Scanner le QR code
- Toucher la notification pour ouvrir dans Expo Go

### Méthode 2: Émulateur Android

#### 1. Installer Android Studio

```bash
# Télécharger depuis https://developer.android.com/studio
# Installer Android Studio
# Installer Android SDK Platform 33
```

#### 2. Créer un AVD (Android Virtual Device)

```bash
# Ouvrir Android Studio
# Tools > Device Manager
# Create Device
# Sélectionner Pixel 5 ou similaire
# Télécharger System Image (API 33)
# Finish
```

#### 3. Lancer l'Émulateur

```bash
# Depuis le terminal
npx expo start

# Presser 'a' pour ouvrir sur Android Emulator
# Ou
npx expo start --android
```

### Méthode 3: Simulateur iOS (macOS uniquement)

```bash
# Installer Xcode depuis App Store
# Installer les Command Line Tools
xcode-select --install

# Lancer le projet
npx expo start

# Presser 'i' pour ouvrir sur iOS Simulator
# Ou
npx expo start --ios
```

---

## 📲 Installation sur Appareil Physique

### Option A: Via Expo Go (Plus Simple)

1. **Installer Expo Go** sur votre téléphone
2. **Démarrer le serveur**: `npx expo start`
3. **Scanner le QR code** avec Expo Go (Android) ou Camera (iOS)

### Option B: Installation Directe (APK/IPA)

Voir section [Génération d'APK](#-génération-dapk-android)

---

## 📦 Génération d'APK Android

### Prérequis EAS Build

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Vérifier
eas whoami
```

### Étape 1: Configuration EAS

```bash
cd mobile

# Initialiser EAS
eas build:configure

# Cela crée le fichier eas.json
```

Vérifier `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Étape 2: Configuration app.json

Modifier `app.json`:

```json
{
  "expo": {
    "name": "CinéTanger",
    "slug": "cinetanger",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#121212"
    },
    "android": {
      "package": "com.cinetanger.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#121212"
      }
    },
    "ios": {
      "bundleIdentifier": "com.cinetanger.app",
      "buildNumber": "1.0.0"
    }
  }
}
```

### Étape 3: Build APK (Preview)

```bash
# Build APK de test
eas build --platform android --profile preview

# Suivre les instructions:
# 1. Choisir un nom de projet
# 2. Confirmer le build
# 3. Attendre 10-15 minutes
```

### Étape 4: Télécharger l'APK

```bash
# Une fois le build terminé, vous recevrez un lien
# Télécharger l'APK depuis le lien
# Ou depuis https://expo.dev/accounts/[username]/projects/cinetanger/builds

# Transférer sur téléphone et installer
```

### Étape 5: Build AAB (Production - Google Play)

```bash
# Build pour Google Play Store
eas build --platform android --profile production

# Cela génère un .aab (Android App Bundle)
# À uploader sur Google Play Console
```

---

## 🍎 Build iOS

### Prérequis

- macOS avec Xcode installé
- Compte développeur Apple
- Certificats et Provisioning Profiles

### Étape 1: Configuration

```bash
# Créer les credentials iOS
eas credentials

# Suivre les instructions pour:
# 1. Apple Developer Account
# 2. Distribution Certificate
# 3. Provisioning Profile
```

### Étape 2: Build

```bash
# Build pour TestFlight (preview)
eas build --platform ios --profile preview

# Build pour App Store (production)
eas build --platform ios --profile production
```

### Étape 3: Distribution

```bash
# Upload sur TestFlight
eas submit --platform ios

# Suivre les instructions
```

---

## 🔧 Dépannage

### Problème 1: "Module not found"

```bash
# Solution: Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache
npx expo start -c
```

### Problème 2: "Unable to resolve module"

```bash
# Solution: Clear Metro bundler cache
npx expo start -c

# Ou manuellement
rm -rf .expo
rm -rf node_modules
npm install
```

### Problème 3: Expo Go ne se connecte pas

```bash
# Solution 1: Vérifier que téléphone et PC sont sur le même réseau WiFi

# Solution 2: Utiliser le tunnel
npx expo start --tunnel

# Solution 3: Vérifier l'URL API
cat constant/Url.ts
# Utiliser l'IP locale au lieu de localhost
```

### Problème 4: "Network request failed"

```bash
# Vérifier que le backend est lancé
curl http://localhost:3000/api/v1/movies

# Pour Android Emulator, utiliser:
# http://10.0.2.2:3000/api/v1/movies

# Pour appareil physique, utiliser l'IP:
# http://192.168.1.XXX:3000/api/v1/movies
```

### Problème 5: Fonts ne se chargent pas

```bash
# Vérifier que les fonts existent
ls fonts/

# Ajouter le loading dans le composant
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'Alkatra-Regular': require('./fonts/Alkatra-VariableFont_wght.ttf'),
});

if (!fontsLoaded) {
  return null; // ou <LoadingScreen />
}
```

### Problème 6: Build EAS échoue

```bash
# Vérifier les credentials
eas credentials

# Vérifier le app.json
# S'assurer que package/bundleIdentifier est unique

# Voir les logs détaillés
eas build --platform android --profile preview --clear-cache
```

---

## ❓ FAQ

### Q1: Quelle est la différence entre Expo Go et APK Standalone?

**Expo Go:**

- Application de développement
- Permet de tester rapidement
- Limitée aux packages compatibles Expo
- Nécessite connexion au serveur de dev

**APK Standalone:**

- Application indépendante
- Peut être distribuée sur Play Store
- Supporte tous les packages natifs
- Fonctionne sans serveur de dev

### Q2: Comment mettre à jour l'application après modification?

#### En Développement (Expo Go):

```bash
# Les changements sont automatiquement rechargés
# Si besoin, recharger manuellement:
# - Android: Secouer le téléphone > Reload
# - iOS: Cmd+D (simulator) > Reload
```

#### En Production (APK):

```bash
# Rebuild l'APK
eas build --platform android --profile preview

# Redistribuer la nouvelle version
```

### Q3: Puis-je utiliser l'application sans backend?

Oui, mais avec fonctionnalités limitées:

```typescript
// Créer des données mock dans service/api.ts
export const getMovie = async () => {
  return { data: mockMovies };
};
```

### Q4: Comment changer l'icône et le splash screen?

```bash
# Remplacer les fichiers dans assets/
# - icon.png (1024x1024)
# - splash.png (1242x2436)
# - adaptive-icon.png (1024x1024) pour Android

# Rebuild l'app
eas build --platform android --profile preview
```

### Q5: Comment activer le mode debug?

```bash
# Démarrer en mode debug
npx expo start --dev

# Ouvrir les Developer Tools
# Android: Cmd+M ou Secouer
# iOS: Cmd+D

# Activer Remote Debugging
```

---

## 📞 Support

### En cas de problème:

1. **Vérifier la documentation Expo**: https://docs.expo.dev/
2. **Consulter les issues GitHub**: https://github.com/votre-equipe/cinetanger/issues
3. **Contacter l'équipe**:
   - Email: dev@cinetanger.ma
   - Slack: #cinetanger-mobile

### Ressources Utiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

## 📝 Checklist d'Installation

- [ ] Node.js installé (v18+)
- [ ] Git installé
- [ ] Expo CLI installé
- [ ] Projet cloné
- [ ] Dépendances installées (`npm install`)
- [ ] Configuration API mise à jour
- [ ] Backend lancé (si local)
- [ ] Expo Go installé sur téléphone
- [ ] Application testée sur émulateur/appareil
- [ ] APK généré (si besoin)

---

<div align="center">
  <p>✅ Installation Terminée avec Succès!</p>
  <p>🎬 Profitez de CinéTanger!</p>
</div>
