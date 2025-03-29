# Hackathon-2025

### 📜 **Cahier des Charges – Capsule Temporelle Décentralisée**  

#### 🎯 **Description du Projet**  
Une application web permettant aux utilisateurs de créer des **capsules temporelles numériques** contenant un **message** qui ne pourra être ouvert qu'à une **date future définie**.  
Les capsules sont stockées de manière **décentralisée et sécurisée** grâce à **IPFS** pour la robustesse et à des **mécanismes cryptographiques** pour garantir que personne ne puisse les ouvrir avant l’heure.  

---

## 1️⃣ **Spécifications et Requirements**  

### 🏗 **Architecture**  
- **Frontend** : React + TypeScript  
- **Backend** : Python (FastAPI)  
- **Stockage** : IPFS (données persistantes et immuables)  
- **Base de Données** : MongoDB (métadonnées des capsules)  
- **Sécurité** : Chiffrement des messages et contrôle d’accès  

### 📌 **Fonctionnalités Principales**  

#### 🔹 **Création d’une capsule**  
- 📜 **Message** : Saisie du texte ou upload d’un fichier  
- 📅 **Date d’ouverture** : Définition d’une date future  
- 🔒 **Chiffrement des données** avant envoi sur IPFS  
- 🎟 **Génération d’un lien unique** pour accéder à la capsule  

#### 🔹 **Stockage et Sécurité**  
- 📦 **Stockage décentralisé** sur IPFS (hash CID stocké en base)  
- 🔑 **Chiffrement AES** avant stockage pour garantir la confidentialité  
- 🕰 **Verrouillage temporel** :
  - Option 1 : Chiffrement basé sur un secret partagé, remis à la date définie  
  - Option 2 : Utilisation d’une **Time-lock encryption** ou **blockchain oracle**  

#### 🔹 **Ouverture d’une capsule**  
- 📜 Déchiffrement automatique si la date est atteinte  
- 🔑 Vérification d’identité (mot de passe, clé privée)  
- 🖥️ Affichage du contenu de la capsule  

#### 🔹 **Gestion utilisateur**  
- 🔄 Liste des capsules créées  
- 🚀 Récupération des capsules via leur lien unique  
- ❌ Option de suppression (avant stockage définitif)  

---

## 2️⃣ **Détails Techniques**  

### 🌐 **Endpoints API**  

| **Méthode** | **Route** | **Description** |
|------------|----------|----------------|
| `POST` | `/capsules` | Création d’une capsule (stockage IPFS + métadonnées en DB) |
| `GET` | `/capsules/{id}` | Récupération d’une capsule (décryptage si la date est atteinte) |
| `GET` | `/user/capsules` | Liste des capsules d’un utilisateur |
| `DELETE` | `/capsules/{id}` | Suppression d’une capsule |

### 🔐 **Sécurité et Chiffrement**  
- **AES-256** pour chiffrer le contenu avant stockage IPFS  
- **Stockage du hash IPFS + métadonnées en base**  
- **Time-lock encryption / oracle blockchain** pour contrôler l’ouverture  

---

## 3️⃣ **Répartition des Tâches (Équipe de 4)**  

| **Rôle** | **Responsabilités** |
|---------|---------------------|
| 🏗 Backend Dev (Python) | API FastAPI, gestion IPFS, base de données, chiffrement |
| 🎨 Frontend Dev 1 | Formulaire création capsule, UI Tailwind |
| 🎨 Frontend Dev 2 | Page de récupération et affichage des capsules |
| 🔒 Sécurité & Infra | Implémentation Time-lock encryption, gestion des accès |

---

## 4️⃣ **Livrables du Hackathon**  
✅ **Prototype fonctionnel** (Créer et ouvrir une capsule à la date prévue)  
✅ **Démonstration technique (5 min)**  
✅ **Documentation (setup, API, fonctionnement, sécurité)**  

---

💡 **Ça vous semble bien ? Des ajustements ?** 🚀