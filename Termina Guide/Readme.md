# Terminal Guide

Guide interactif de commandes terminal avec terminal simulé, exercices et système de progression.

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Causertragique/terminal.git
cd terminal
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp env.example.json env.json
# Éditer env.json avec vos vraies valeurs
```

4. **Lancer en développement**
```bash
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `env.json` basé sur `env.example.json` :

- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `FLOOT_DATABASE_URL` : URL de connexion PostgreSQL

## 📚 Fonctionnalités

- 📁 **Répertoire de commandes** - Base de données de commandes terminal
- 🎮 **Terminal simulé** - Interface pour pratiquer les commandes
- 📊 **Exercices avec niveaux** - Débutant, intermédiaire, avancé
- 📈 **Système de progression** - Suivi des progrès utilisateur
- 🔐 **Authentification Google** - Connexion simple

## 🌐 Déploiement

- **Frontend** : https://terminal-d7af0.web.app
- **Repository** : https://github.com/Causertragique/terminal.git

## 🛠️ Technologies

- **Frontend** : React + Vite + TypeScript
- **Backend** : Hono + PostgreSQL + Kysely
- **Déploiement** : Firebase Hosting
- **Authentification** : Google Auth
