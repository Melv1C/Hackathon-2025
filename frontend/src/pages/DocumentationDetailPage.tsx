import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import CodeIcon from '@mui/icons-material/Code';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import LanguageIcon from '@mui/icons-material/Language';
import {
    Box,
    Breadcrumbs,
    Container,
    Divider,
    Link as MuiLink,
    Paper,
    Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

// Interface for documentation section details
interface DocSection {
    id: string;
    title: string;
    icon: React.ReactElement;
    content: React.ReactNode; // Content can be JSX
}

// Define the detailed content for each section
// (This mirrors the structure and content generated above)
const documentationContent: Record<string, DocSection> = {
    introduction: {
        id: 'introduction',
        title: 'Introduction to Time Capsules',
        icon: <HistoryEduIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography variant="h5" component="h2" gutterBottom>
                    What is a Digital Time Capsule?
                </Typography>
                <Typography paragraph>
                    A digital time capsule serves as a secure vault for your
                    digital memories – messages, documents, photos, or other
                    files – intended for access only at a predetermined future
                    date. Similar to physical time capsules buried for later
                    generations, these digital counterparts utilize advanced
                    technologies to ensure the longevity and privacy of your
                    stored content.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    The Problem
                </Typography>
                <Typography paragraph>
                    In the digital age, ensuring that data remains accessible
                    and private over long periods is challenging. Centralized
                    servers can fail, companies can cease operations, and data
                    can be vulnerable to unauthorized access or loss.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Our Solution
                </Typography>
                <Typography paragraph>
                    The Decentralized Time Capsule addresses these challenges by
                    combining strong encryption with decentralized storage:
                    <ul>
                        <li>
                            <b>Security:</b> Your content is encrypted
                            <i>before</i> it leaves your control using the
                            robust AES-256 CBC algorithm.
                        </li>
                        <li>
                            <b>Longevity:</b> The encrypted content is stored on
                            the InterPlanetary File System (IPFS), a distributed
                            network designed for resilience and persistence,
                            independent of any single server.
                        </li>
                        <li>
                            <b>Integrity:</b> A cryptographic hash (SHA-256) of
                            your original content is stored, allowing
                            verification upon retrieval that the data hasn't
                            been altered.
                        </li>
                        <li>
                            <b>Controlled Access:</b> Capsules remain locked
                            until the specific date and time you set.
                        </li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    This system offers a reliable way to preserve important
                    digital artifacts for your future self or others, secured
                    against unauthorized access and the uncertainties of
                    long-term digital storage.
                </Typography>
            </>
        ),
    },
    'user-guide': {
        id: 'user-guide',
        title: 'User Guide',
        icon: <HelpOutlineIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    This guide walks you through using the Decentralized Digital
                    Time Capsule application.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    1. Registration and Login
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            Create an account using the 'Register' page,
                            providing a username, email, and a strong password.
                            Your password will be securely stored using hashing
                            and salting.
                        </li>
                        <li>
                            Log in using your credentials on the 'Login' page.
                            The system uses JWT (JSON Web Tokens) for secure
                            session management.
                        </li>
                    </ul>
                </Typography>
                {/* ... Add detailed steps for Creating, Viewing, Accessing Capsules, Profile ... */}
                <Typography variant="h6" component="h3" gutterBottom>
                    2. Creating a Time Capsule
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Navigate to the 'Create Capsule' page.</li>
                        <li>
                            Fill in the details: Title, Description (Optional),
                            Content Type (Text/File), Content, Unlock Date &
                            Time, Privacy (Private/Public), Recipients (Optional
                            for Private).
                        </li>
                        <li>
                            Click 'Create Capsule'. The application handles
                            hashing, encryption, IPFS upload, and database
                            storage.
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    3. Viewing Your Capsules ('My Capsules')
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Go to the 'My Capsules' section.</li>
                        <li>
                            Capsules are listed as 'Locked' (countdown shown) or
                            'Unlocked' (accessible content).
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    4. Accessing Unlocked Capsules
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Click an unlocked capsule.</li>
                        <li>
                            The app retrieves, decrypts, and verifies the
                            content.
                        </li>
                        <li>
                            Text is displayed, files are offered for download.
                        </li>
                        <li>
                            An AI summary option might be available for text
                            capsules.
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    5. Profile Management
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            Visit the 'Profile' page to view details or manage
                            settings.
                        </li>
                    </ul>
                </Typography>
            </>
        ),
    },
    security: {
        id: 'security',
        title: 'Security & Encryption',
        icon: <SecurityIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    Security and privacy are paramount in this system. Several
                    layers protect your data:
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    User Authentication
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            Passwords are hashed with unique salts (e.g.,
                            bcrypt, Argon2).
                        </li>
                        <li>
                            Sessions use digitally signed JWT (access and
                            refresh tokens).
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Content Encryption
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            Content encrypted *before* IPFS upload using AES-256
                            CBC.
                        </li>
                        <li>
                            A secret key is stored securely server-side
                            (HSM/secrets manager recommended for production).
                        </li>
                        <li>
                            A unique, random Initialization Vector (IV) is
                            generated per capsule and stored with metadata (not
                            secret, but must be unique).
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Data Integrity
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            SHA-256 hash of original content calculated before
                            encryption and stored.
                        </li>
                        <li>
                            Upon decryption, hash is recalculated and compared
                            to the stored hash to verify integrity.
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Transport Security
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            HTTPS (TLS/SSL) should secure all communication
                            between frontend and backend.
                        </li>
                    </ul>
                </Typography>
            </>
        ),
    },
    decentralization: {
        id: 'decentralization',
        title: 'Decentralized Storage',
        icon: <StorageIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    Instead of relying on a traditional central server to store
                    the actual capsule content, this application uses the
                    InterPlanetary File System (IPFS).
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    What is IPFS?
                </Typography>
                <Typography paragraph>
                    IPFS is a peer-to-peer network protocol and distributed file
                    system where data is addressed by its content (CID) rather
                    than location.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    How it's Used
                </Typography>
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            Encrypted capsule content is uploaded to an IPFS
                            node.
                        </li>
                        <li>IPFS returns a unique Content Identifier (CID).</li>
                        <li>
                            This CID is stored in the database; the encrypted
                            data lives on the IPFS network.
                        </li>
                    </ol>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Benefits
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            <b>Resilience & Longevity:</b> Data replicated
                            across nodes, less dependent on a single server.
                        </li>
                        <li>
                            <b>Content Addressing:</b> CID ensures the link
                            always points to the exact uploaded content.
                        </li>
                        <li>
                            <b>Censorship Resistance:</b> Harder to censor than
                            centralized services.
                        </li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Persistence (Pinning)
                </Typography>
                <Typography paragraph>
                    To prevent data from being removed during garbage collection
                    on IPFS nodes, the content CIDs are "pinned". Pinning
                    instructs nodes (or dedicated pinning services) to retain
                    the data indefinitely. This project relies on pinning for
                    long-term storage assurance.
                </Typography>
            </>
        ),
    },
    timelock: {
        id: 'timelock',
        title: 'Time-Lock Mechanism',
        icon: <AccessTimeIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    The core feature ensuring capsules are only accessible after
                    a specific time is the time-lock mechanism.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Setting the Lock
                </Typography>
                <Typography paragraph>
                    The `unlockDate` and time specified during creation is
                    stored securely in the database.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Enforcement
                </Typography>
                <Typography component="div" paragraph>
                    The backend server enforces the lock:
                    <ol>
                        <li>
                            Retrieves capsule metadata including `unlockDate`.
                        </li>
                        <li>Compares `unlockDate` with current server time.</li>
                        <li>
                            <b>Access Denied:</b> If{' '}
                            <code>CURRENT_TIME &lt; unlockDate</code>, content
                            is not served.
                        </li>
                        <li>
                            <b>Access Granted:</b> If{' '}
                            <code>CURRENT_TIME &gt;= unlockDate</code>,
                            retrieval/decryption proceeds.
                        </li>
                    </ol>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Frontend Display
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Locked capsules show a countdown.</li>
                        <li>Unlocked capsules allow access.</li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Background Task & Notifications
                </Typography>
                <Typography paragraph>
                    A periodic background task (APScheduler) checks for newly
                    unlocked capsules, updates their status, and sends email
                    notifications to recipients if specified.
                </Typography>
            </>
        ),
    },
    'future-access': {
        id: 'future-access',
        title: 'Future Access Instructions',
        icon: <LanguageIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    Should this service cease operation, retrieving content
                    independently requires specific information and tools. This
                    section provides theoretical guidance.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Information Required
                </Typography>
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            IPFS Content Identifier (CID) of the encrypted data.
                        </li>
                        <li>Encryption Algorithm: AES-256 CBC.</li>
                        <li>Initialization Vector (IV) used for encryption.</li>
                        <li>
                            <b>
                                The Secret Decryption Key (Critical &
                                Difficult).
                            </b>
                        </li>
                        <li>
                            Original Content Hash (SHA-256) for verification.
                        </li>
                        <li>Padding Scheme details (e.g., PKCS7).</li>
                    </ol>
                    <i>
                        Items 1, 3, 5 are stored in the database. Item 4 is the
                        server's secret key.
                    </i>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Retrieval and Decryption Steps (Theoretical)
                </Typography>
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            Obtain metadata (CID, IV, Hash) from a database
                            backup/archive.
                        </li>
                        <li>Fetch encrypted data from IPFS using the CID.</li>
                        <li>Obtain the Secret Key (the major challenge).</li>
                        <li>
                            Decrypt using a tool supporting AES-256 CBC with the
                            key and IV.
                        </li>
                        <li>
                            Verify integrity by comparing the SHA-256 hash of
                            decrypted data with the stored hash.
                        </li>
                    </ol>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Challenges
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            <b>Key Availability:</b> Long-term preservation of
                            the server's secret key.
                        </li>
                        <li>
                            <b>Metadata Availability:</b> Preservation of
                            database records.
                        </li>
                        <li>
                            <b>Software Obsolescence:</b> Future availability of
                            required tools/libraries.
                        </li>
                    </ul>
                </Typography>
                <Typography paragraph>
                    <i>
                        For true archival purposes, alternative key management
                        strategies might be needed.
                    </i>
                </Typography>
            </>
        ),
    },
    'technical-specs': {
        id: 'technical-specs',
        title: 'Technical Specifications',
        icon: <CodeIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    This project utilizes a modern web stack leveraging Python
                    for the backend and React/TypeScript for the frontend.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Backend (Flask/Python)
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Framework: Flask</li>
                        <li>Database: MongoDB (with Mongo Express for dev)</li>
                        <li>Authentication: PyJWT (JWT)</li>
                        <li>
                            Encryption: Python `cryptography` (AES-256 CBC,
                            SHA-256)
                        </li>
                        <li>
                            Decentralized Storage: IPFS HTTP API (upload,
                            retrieve, pin)
                        </li>
                        <li>
                            AI Integration: OpenAI library (via OpenRouter API)
                        </li>
                        <li>Background Tasks: APScheduler</li>
                        <li>Email: Python `smtplib`, `email.message`</li>
                        <li>Environment: `python-dotenv`</li>
                        <li>API: Flask-CORS</li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Frontend (React/TypeScript)
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>Framework/Build: React with Vite</li>
                        <li>Language: TypeScript</li>
                        <li>UI Library: Material UI (MUI)</li>
                        <li>State Management: Jotai</li>
                        <li>Data Fetching: TanStack Query (React Query)</li>
                        <li>Routing: React Router DOM</li>
                        <li>Forms: React Hook Form</li>
                        <li>Schema Validation: Zod</li>
                        <li>API Client: Axios</li>
                        <li>Date/Time: Day.js, MUI X Date Pickers</li>
                    </ul>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Services
                </Typography>
                <Typography component="div" paragraph>
                    <ul>
                        <li>
                            Database Hosting: Docker Compose (local dev),
                            Managed Service (prod)
                        </li>
                        <li>
                            Decentralized Storage: IPFS Node/Gateway/Pinning
                            Service
                        </li>
                        <li>AI Service: OpenRouter.ai (or compatible)</li>
                    </ul>
                </Typography>
            </>
        ),
    },
    architecture: {
        id: 'architecture',
        title: 'System Architecture',
        icon: <ArchitectureIcon fontSize="large" color="primary" />,
        content: (
            <>
                <Typography paragraph>
                    The system follows a client-server architecture augmented
                    with decentralized storage.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Core Components
                </Typography>
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            <b>Frontend (Client - React):</b> UI, user
                            interaction, API requests.
                        </li>
                        <li>
                            <b>Backend (Server - Flask):</b> API, business
                            logic, encryption, IPFS interaction, DB operations,
                            background tasks.
                        </li>
                        <li>
                            <b>Database (MongoDB):</b> Stores metadata (user
                            info, capsule details, CID, IV, hash), not content
                            or encryption keys.
                        </li>
                        <li>
                            <b>Decentralized Storage (IPFS):</b> Stores
                            encrypted content blobs, accessed via CID,
                            persistence via pinning.
                        </li>
                        <li>
                            <b>External Services:</b> Email (SMTP), AI
                            (OpenRouter).
                        </li>
                    </ol>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Data Flow Example (Creation)
                </Typography>
                {/* Add simplified data flow description */}
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            User submits form (Frontend) -&gt; API call
                            (Backend).
                        </li>
                        <li>
                            Backend auths user, hashes content, encrypts content
                            (AES + IV), uploads encrypted blob to IPFS (gets
                            CID), pins CID.
                        </li>
                        <li>
                            Backend saves metadata (CID, IV, hash, etc.) to
                            MongoDB.
                        </li>
                        <li>
                            Backend confirms (Frontend), sends emails
                            (optional).
                        </li>
                    </ol>
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                    Data Flow Example (Retrieval)
                </Typography>
                {/* Add simplified data flow description */}
                <Typography component="div" paragraph>
                    <ol>
                        <li>
                            User requests capsule (Frontend) -&gt; API call
                            (Backend).
                        </li>
                        <li>
                            Backend auths user, gets metadata (CID, IV, hash,
                            unlockDate) from MongoDB.
                        </li>
                        <li>
                            Backend checks time lock (`CURRENT_TIME &gt;=
                            unlockDate`).
                        </li>
                        <li>
                            Backend fetches encrypted blob from IPFS (using
                            CID).
                        </li>
                        <li>
                            Backend decrypts blob (using key + IV), calculates
                            hash, verifies against stored hash.
                        </li>
                        <li>Backend sends decrypted content to Frontend.</li>
                    </ol>
                </Typography>
            </>
        ),
    },
    // Add other sections similarly...
};

export function DocumentationDetailPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const section = sectionId ? documentationContent[sectionId] : undefined;

    if (!section) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <MuiLink
                            component={RouterLink}
                            underline="hover"
                            color="inherit"
                            to="/"
                        >
                            Home
                        </MuiLink>
                        <MuiLink
                            component={RouterLink}
                            underline="hover"
                            color="inherit"
                            to="/documentation"
                        >
                            Documentation
                        </MuiLink>
                        <Typography color="text.primary">Not Found</Typography>
                    </Breadcrumbs>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Documentation Section Not Found
                    </Typography>
                    <Typography>
                        The documentation section you requested could not be
                        found. Please return to the main documentation page.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <MuiLink component={RouterLink} to="/documentation">
                            Back to Documentation
                        </MuiLink>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <MuiLink
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to="/"
                    >
                        Home
                    </MuiLink>
                    <MuiLink
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to="/documentation"
                    >
                        Documentation
                    </MuiLink>
                    <Typography color="text.primary">
                        {section.title}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>{section.icon}</Box>
                    <Typography variant="h3" component="h1">
                        {section.title}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Render the detailed content for the section */}
                {section.content}

                <Divider sx={{ my: 3 }} />
                <MuiLink component={RouterLink} to="/documentation">
                    ← Back to Documentation Overview
                </MuiLink>
            </Paper>
        </Container>
    );
}
