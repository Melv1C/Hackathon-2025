import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import CodeIcon from '@mui/icons-material/Code';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LanguageIcon from '@mui/icons-material/Language';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import {
    Box,
    Breadcrumbs,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Documentation sections
const documentationSections = [
    {
        id: 'introduction',
        title: 'Introduction to Time Capsules',
        description:
            'Learn what digital time capsules are and their purpose for preserving information across time.',
        icon: <HistoryEduIcon fontSize="large" color="primary" />,
    },
    {
        id: 'user-guide',
        title: 'User Guide',
        description:
            'Step-by-step instructions on creating, accessing and managing your time capsules.',
        icon: <HelpOutlineIcon fontSize="large" color="primary" />,
    },
    {
        id: 'security',
        title: 'Security & Encryption',
        description:
            'Understanding how your capsule content is secured using AES-256 CBC encryption.',
        icon: <SecurityIcon fontSize="large" color="primary" />,
    },
    {
        id: 'decentralization',
        title: 'Decentralized Storage',
        description:
            'How IPFS ensures your capsules persist through distributed storage technology.',
        icon: <StorageIcon fontSize="large" color="primary" />,
    },
    {
        id: 'timelock',
        title: 'Time-Lock Mechanism',
        description:
            'The technology behind capsule release dates and how unlock times are enforced.',
        icon: <AccessTimeIcon fontSize="large" color="primary" />,
    },
    {
        id: 'future-access',
        title: 'Future Access Instructions',
        description:
            'Guidelines for future civilizations on how to access and interpret time capsule data.',
        icon: <LanguageIcon fontSize="large" color="primary" />,
    },
    {
        id: 'technical-specs',
        title: 'Technical Specifications',
        description:
            'Technical details about the infrastructure and protocols used in the system.',
        icon: <CodeIcon fontSize="large" color="primary" />,
    },
    {
        id: 'architecture',
        title: 'System Architecture',
        description:
            'The overall design and components of the Decentralized Time Capsule system.',
        icon: <ArchitectureIcon fontSize="large" color="primary" />,
    },
];

export function DocumentationPage() {
    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <RouterLink
                        to="/"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        Home
                    </RouterLink>
                    <Typography color="text.primary">Documentation</Typography>
                </Breadcrumbs>

                <Typography variant="h3" component="h1" gutterBottom>
                    Time Capsule Documentation
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    paragraph
                >
                    Comprehensive guide for current users and future
                    civilizations on preserving and accessing digital time
                    capsules
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        What is a Digital Time Capsule?
                    </Typography>

                    <Typography paragraph>
                        A digital time capsule is a secure container for storing
                        encrypted messages, files, and media intended to be
                        accessed at a specific future date. Like physical time
                        capsules buried for future discovery, these digital
                        versions leverage modern cryptography and decentralized
                        storage to ensure your content survives technological
                        changes and remains private until its intended unlock
                        date.
                    </Typography>

                    <Typography paragraph>
                        Our Decentralized Time Capsule system combines AES-256
                        encryption with IPFS (InterPlanetary File System)
                        storage to create tamper-resistant, permanent records
                        that can withstand the test of time.
                    </Typography>
                </Box>

                <Typography variant="h5" component="h2" gutterBottom>
                    Documentation Sections
                </Typography>

                <Grid container spacing={3}>
                    {documentationSections.map((section) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardActionArea
                                    component={RouterLink}
                                    to={`/documentation/${section.id}`}
                                    sx={{ height: '100%' }}
                                >
                                    <CardContent
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            {section.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            align="center"
                                        >
                                            {section.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            align="center"
                                        >
                                            {section.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
}
