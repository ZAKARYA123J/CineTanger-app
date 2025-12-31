# 🎬 CinéTanger - Système de Réservation de Billets de Cinéma

![CinéTanger Logo](https://img.shields.io/badge/CinéTanger-Premium%20Cinema-d41132?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Application mobile professionnelle pour la réservation de billets de cinéma à Tanger, développée par une équipe de 4 développeurs full-stack.

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Équipe](#-équipe)
- [Contribution](#-contribution)
- [License](#-license)

---

## 🎯 À Propos

CinéTanger est le nouveau complexe de cinéma premium situé au cœur de Tanger, Boulevard Mohammed VI, près de la Marina Bay. Notre application mobile permet aux cinéphiles de Tanger de découvrir et réserver leurs billets facilement.

### 🏢 CinéTanger en Chiffres

- 🎥 **6 salles** de projection modernes
- 🎬 **150-320 places** par salle
- 🍿 Films variés : Blockbusters, cinéma marocain, films d'auteur
- 💺 Confort premium : Sièges inclinables, son Dolby Atmos, projection 4K
- 🎭 Événements spéciaux : Avant-premières, festivals, soirées thématiques

---

## ✨ Fonctionnalités

### 🎬 Gestion des Films

- ✅ Consultation de la programmation complète
- ✅ Détails des films (synopsis, affiche, durée, genre)
- ✅ Filtrage par genre et recherche
- ✅ Galerie des acteurs

### 🎟️ Réservation de Billets

- ✅ Sélection des séances par cinéma
- ✅ Choix des sièges interactif
- ✅ Visualisation de la disponibilité en temps réel
- ✅ Confirmation avec code unique
- ✅ Historique des réservations

### 📱 Fonctionnalités Mobiles

- ✅ Interface moderne et intuitive
- ✅ Deep linking pour partage de films
- ✅ Mode offline avec cache local
- ✅ Notifications push (à venir)
- ✅ Support Android & iOS

### 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Validation des données
- ✅ Gestion sécurisée des transactions

---

## 🛠 Technologies

### Backend

```
Node.js v18+
Express.js v4.18
PostgreSQL v15
Sequelize ORM v6.35
JWT Authentication
```

### Frontend Mobile

```
React Native (Expo SDK 50)
TypeScript
React Query (TanStack Query)
Expo Router (File-based routing)
React Native Reanimated
```

### DevOps & Tools

```
Docker & Docker Compose
GitHub Actions (CI/CD)
Jest (Testing)
Supertest (API Testing)
EAS Build (APK Generation)
```

---

## 🏗 Architecture

```
cinetanger/
├── backend/                    # API REST Node.js
│   ├── src/
│   │   ├── config/            # Configuration DB
│   │   ├── models/            # Modèles Sequelize
│   │   ├── controllers/       # Logique métier
│   │   ├── routes/            # Routes API
│   │   ├── middlewares/       # Auth, validation
│   │   └── utils/             # Helpers
│   ├── tests/                 # Tests unitaires & intégration
│   ├── Dockerfile
│   └── package.json
│
├── mobile/                    # Application React Native
│   ├── app/                   # Expo Router (pages)
│   │   ├── (tabs)/           # Navigation tabs
│   │   ├── filmDetails.tsx   # Détails film
│   │   └── booking.tsx       # Réservation
│   ├── components/           # Composants réutilisables
│   ├── service/              # API calls
│   ├── constants/            # Constantes
│   ├── assets/               # Images, fonts
│   └── package.json
│
├── docker-compose.yml        # Orchestration services
├── .github/
│   └── workflows/
│       ├── backend-ci.yml    # CI Backend
│       └── mobile-ci.yml     # CI Mobile
└── README.md
```

### 📊 Schéma de Base de Données

```sql
Movies (Films)
├── id (PK)
├── title
├── genre
├── duration
├── releaseDate
├── photo
├── artist
└── description

Theaters (Cinémas)
├── id (PK)
├── title
├── name (location)
└── capacity

Showtimes (Séances)
├── id (PK)
├── movieId (FK)
├── theaterId (FK)
├── startTime
├── price
├── totalSeats
└── bookedSeats

Bookings (Réservations)
├── id (PK)
├── showtimeId (FK)
├── customerName
├── customerEmail
├── seatsBooked
├── totalPrice
├── bookingCode
└── status
```

---

## 🚀 Installation

### Prérequis

- Node.js v18+
- PostgreSQL v15+
- Docker & Docker Compose
- Expo CLI
- Git

### 1️⃣ Cloner le Projet

```bash
git clone https://github.com/votre-equipe/cinetanger.git
cd cinetanger
```

### 2️⃣ Installation Backend

```bash
cd backend
npm install
```

### 3️⃣ Installation Mobile

```bash
cd mobile
npm install
```

---

## ⚙️ Configuration

### Backend - Variables d'Environnement

Créer `.env` dans `backend/`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinetanger
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:8081
```

### Mobile - Configuration API

Modifier `mobile/constant/Url.ts`:

```typescript
export const API_URL = "http://localhost:3000/api/v1/movies";
// Production: https://api.cinetanger.ma/api/v1/movies
```

---

## 🎮 Utilisation

### Option 1: Avec Docker (Recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

Services disponibles:

- API Backend: http://localhost:3000
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050

### Option 2: Sans Docker

#### Backend

```bash
cd backend

# Créer la base de données
createdb cinetanger

# Lancer les migrations
npm run migrate

# Seed data (optionnel)
npm run seed

# Démarrer le serveur
npm run dev
```

#### Mobile

```bash
cd mobile

# Démarrer Expo
npx expo start

# Options:
# - Presser 'a' pour Android
# - Presser 'i' pour iOS
# - Scanner le QR code avec Expo Go
```

---

## 🧪 Tests

### Backend Tests

```bash
cd backend

# Tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests d'intégration
npm run test:integration
```

### Mobile Tests

```bash
cd mobile

# Tests unitaires
npm test

# Tests des composants
npm run test:components

# Tests E2E (si configuré)
npm run test:e2e
```

---

## 📦 Déploiement

### Backend

#### Avec Docker

```bash
# Build image production
docker build -t cinetanger-api:latest ./backend

# Run container
docker run -p 3000:3000 --env-file .env cinetanger-api:latest
```

#### Sans Docker

```bash
cd backend
npm run build
npm start
```

### Mobile

#### Génération APK Android

```bash
cd mobile

# Login EAS
eas login

# Configuration
eas build:configure

# Build APK
eas build --platform android --profile preview

# Build AAB (Google Play)
eas build --platform android --profile production
```

#### Build iOS

```bash
# Build iOS
eas build --platform ios --profile production
```

---

## 👥 Équipe

| Rôle                     | Responsabilités                                     | Technologies                           |
| ------------------------ | --------------------------------------------------- | -------------------------------------- |
| **Backend Lead**         | Architecture API, Base de données, Authentification | Node.js, PostgreSQL, Sequelize         |
| **Frontend Lead**        | Architecture Mobile, State Management, Navigation   | React Native, React Query, Expo Router |
| **DevOps Engineer**      | CI/CD, Docker, Tests, Déploiement                   | Docker, GitHub Actions, Jest           |
| **Full-Stack Developer** | Support Backend/Frontend, Tests, Documentation      | Node.js, React Native, Jest            |

### 🤝 Workflow Git

```bash
# Branches principales
main          # Production
develop       # Développement
feature/*     # Nouvelles fonctionnalités
bugfix/*      # Corrections de bugs
hotfix/*      # Corrections urgentes

# Exemple de workflow
git checkout develop
git checkout -b feature/add-payment
# ... développement ...
git add .
git commit -m "feat: add payment integration"
git push origin feature/add-payment
# Créer Pull Request sur GitHub
```

### 📋 Conventions de Commit

```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage, missing semi colons, etc
refactor: Refactoring du code
test: Ajout de tests
chore: Maintenance
```

---

## 🔄 CI/CD

### GitHub Actions

#### Backend CI

- ✅ Tests unitaires et d'intégration
- ✅ Linting et formatage
- ✅ Build Docker image
- ✅ Scan sécurité

#### Mobile CI

- ✅ Tests composants
- ✅ Linting TypeScript
- ✅ Build Expo
- ✅ Génération APK automatique

---

## 📚 Documentation API

### Endpoints Principaux

#### Films

```http
GET    /api/v1/movies           # Liste des films
GET    /api/v1/movies/:id       # Détails d'un film
POST   /api/v1/movies           # Créer un film (Admin)
PUT    /api/v1/movies/:id       # Modifier un film (Admin)
DELETE /api/v1/movies/:id       # Supprimer un film (Admin)
```

#### Séances

```http
GET    /api/v1/showtimes                    # Toutes les séances
GET    /api/v1/showtimes/movie/:movieId     # Séances par film
GET    /api/v1/showtimes/theater/:theaterId # Séances par cinéma
POST   /api/v1/showtimes                    # Créer une séance (Admin)
```

#### Réservations

```http
POST   /api/v1/bookings              # Créer une réservation
GET    /api/v1/bookings/:code        # Détails par code
GET    /api/v1/bookings/user/:email  # Réservations par email
PUT    /api/v1/bookings/:id/cancel   # Annuler une réservation
```

### Exemple de Requête

```javascript
// Créer une réservation
POST /api/v1/bookings
Content-Type: application/json

{
  "showtimeId": 1,
  "customerName": "Ahmed Benali",
  "customerEmail": "ahmed@email.com",
  "seatsBooked": 2,
  "totalPrice": 140
}

// Réponse
{
  "success": true,
  "data": {
    "id": 123,
    "bookingCode": "CINE-2025-ABC123",
    "status": "confirmed",
    "showtime": { ... }
  }
}
```

---

## 🐛 Troubleshooting

### Problèmes Communs

#### Backend ne démarre pas

```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier les ports
lsof -i :3000

# Réinstaller dépendances
rm -rf node_modules package-lock.json
npm install
```

#### Expo ne se connecte pas

```bash
# Nettoyer le cache
npx expo start -c

# Réinstaller Expo CLI
npm install -g expo-cli

# Vérifier l'URL API
cat mobile/constant/Url.ts
```

#### Docker issues

```bash
# Nettoyer tout
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up --build
```

---

## 📖 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Sequelize Docs](https://sequelize.org/)
- [Express.js Guide](https://expressjs.com/)
- [Docker Docs](https://docs.docker.com/)

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

Merci à CinéTanger pour leur confiance et leur collaboration tout au long du projet.

---

<div align="center">
  <p>Fait avec ❤️ par l'équipe CinéTanger</p>
  <p>© 2025 CinéTanger. Tous droits réservés.</p>
</div>
