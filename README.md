# Decentralized Digital Time Capsule

## Overview

This project is a web application that allows users to create secure, decentralized digital time capsules. Users can store text messages or files, encrypt them, and set a future date when the content becomes accessible. The application leverages IPFS for decentralized storage and robust encryption to ensure the privacy and longevity of the stored memories.

## Purpose

The primary goal is to provide a secure and reliable way for users to preserve digital artifacts (messages, documents, photos) for themselves or others in the future. By using encryption and decentralized storage, it aims to protect content from unauthorized access and ensure its availability long-term, independent of a central server's continued operation for the data itself.

## Core Features

1.  **User Authentication:** Secure user registration and login system using JWT (JSON Web Tokens) with access and refresh tokens. Passwords are securely hashed with salts.
2.  **Capsule Creation:**
    *   Users can create time capsules with a title, optional description, and content.
    *   Content can be either plain text or an uploaded file (images, PDFs, text files supported).
    *   Users set a specific future date and time (`unlockDate`) when the capsule's content becomes accessible.
3.  **Encryption:**
    *   All capsule content (text or file data) is encrypted using **AES-256 CBC** before being stored.
    *   A unique Initialization Vector (IV) is generated for each encryption process.
4.  **Decentralized Storage (IPFS):**
    *   The *encrypted* content is uploaded to the InterPlanetary File System (IPFS).
    *   The resulting IPFS Content Identifier (CID) is stored in the database, linking the capsule metadata to its secure, decentralized content.
    *   Content is pinned on IPFS to ensure persistence.
5.  **Integrity Check:**
    *   Before encryption, a SHA-256 hash of the original content is calculated and stored alongside the capsule metadata.
    *   Upon retrieval and decryption, this hash is re-calculated and compared to the stored hash to verify that the content has not been tampered with.
6.  **Time-Locking:** Capsules remain locked and their content inaccessible until the specified `unlockDate` is reached.
7.  **Capsule Access & Retrieval:**
    *   Users can view a list of their capsules ("My Capsules"), separated into 'Locked' and 'Unlocked' categories.
    *   Locked capsules display a countdown timer to their unlock date.
    *   Unlocked capsules allow viewing the decrypted text content or downloading the decrypted file.
    *   The backend handles retrieving the encrypted data from IPFS (using the CID), decrypting it, verifying the hash, and then serving it to the user.
8.  **Privacy & Sharing:**
    *   Capsules can be marked as public or private.
    *   Private capsules can have a list of recipient email addresses. Only the owner or listed recipients (once unlocked) can access private capsules. (Note: Access control logic seems primarily based on ownership/privacy flag, recipient check might be for notifications).
9.  **Email Notifications:**
    *   When a capsule is created with recipients, an initial notification email is sent.
    *   A periodic background task checks for capsules that have passed their unlock date and sends notification emails to recipients if specified.
10. **AI Content Analysis (Experimental):**
    *   For unlocked text-based capsules, users can request an AI-powered summary/analysis of the content using an external AI service (via OpenRouter).

## How It Works

1.  **Creation:** A user fills out the capsule details (title, content, unlock date, privacy).
2.  **Hashing:** The original content is hashed (SHA-256).
3.  **Encryption:** The original content is encrypted (AES-256).
4.  **IPFS Upload:** The *encrypted* content is uploaded to IPFS, yielding a CID.
5.  **Database Storage:** Capsule metadata (title, description, unlock date, owner, privacy settings, recipients, the IPFS CID, and the original content hash) is stored in MongoDB.
6.  **Locking:** The application prevents access to the content until `CURRENT_TIME >= unlockDate`.
7.  **Unlocking:** When the `unlockDate` arrives:
    *   The capsule is marked as 'unlocked'.
    *   The periodic task may trigger email notifications if recipients are set.
8.  **Retrieval:** When an authorized user views an unlocked capsule:
    *   The backend retrieves the IPFS CID from MongoDB.
    *   It downloads the *encrypted* content from IPFS using the CID.
    *   It decrypts the content using the stored IV and the server's secret key.
    *   It calculates the hash of the decrypted content and compares it to the hash stored in MongoDB to ensure integrity.
    *   The decrypted content (text or file) is sent to the frontend for display or download.

## Technology Stack

**Backend:**

*   **Framework:** Flask (Python)
*   **Database:** MongoDB
*   **Authentication:** PyJWT (JWT implementation)
*   **Encryption:** Python `cryptography` library (AES-256 CBC)
*   **Decentralized Storage:** IPFS (interacted via `IPFS-Toolkit` or similar HTTP API calls)
*   **AI Integration:** OpenAI library (configured for OpenRouter API)
*   **Background Tasks:** APScheduler
*   **Email:** Python `smtplib`, `email.message`
*   **Environment Variables:** `python-dotenv`
*   **API Communication:** Flask-CORS

**Frontend:**

*   **Framework:** React (with Vite)
*   **UI Library:** Material UI (MUI)
*   **State Management:** Jotai
*   **Data Fetching/Caching:** TanStack Query (React Query)
*   **Routing:** React Router DOM
*   **Forms:** React Hook Form
*   **Schema Validation:** Zod
*   **API Client:** Axios
*   **Date/Time:** Day.js, MUI X Date Pickers
*   **Language:** TypeScript

**Services:**

*   **Database Hosting:** Docker Compose setup for MongoDB & Mongo Express (for development/local deployment)
*   **Decentralized Storage:** IPFS Node (requires separate setup or public gateway)
*   **AI Service:** OpenRouter.ai (or compatible OpenAI API endpoint)

## Project Structure

*   `/backend`: Contains the Flask server application, including routes, services, database models, encryption logic, and utilities.
*   `/frontend`: Contains the React client application, including components, pages, hooks, API clients, state management, and styling.
*   `docker-compose.yml`: Defines the MongoDB and Mongo Express services for local development.