import CloudIcon from '@mui/icons-material/Cloud';
import LockClockIcon from '@mui/icons-material/LockClock';
import SecurityIcon from '@mui/icons-material/Security';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const HomePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const features = [
        {
            icon: <LockClockIcon fontSize="large" color="primary" />,
            title: 'Time-Locked Encryption',
            description:
                'Set a future date when your digital memories can be accessed. Until then, they remain securely encrypted.',
        },
        {
            icon: <SecurityIcon fontSize="large" color="primary" />,
            title: 'Military-Grade Security',
            description:
                'Using AES-256 encryption, your content is protected with the same technology trusted by security professionals.',
        },
        {
            icon: <CloudIcon fontSize="large" color="primary" />,
            title: 'Decentralized Storage',
            description:
                "Your capsules are stored on IPFS, ensuring they'll remain accessible long into the future.",
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    py: 10,
                    mb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                fontWeight="bold"
                            >
                                Digital Time Capsules
                            </Typography>
                            <Typography variant="h5" paragraph>
                                Preserve your memories, messages, and media for
                                future discovery.
                            </Typography>
                            <Box mt={4}>
                                <Button
                                    component={RouterLink}
                                    to="/create"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mr: 2,
                                        backgroundColor: 'white',
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(255,255,255,0.9)',
                                        },
                                    }}
                                >
                                    Create a Capsule
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/explore"
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor:
                                                'rgba(255,255,255,0.9)',
                                            backgroundColor:
                                                'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    Explore Capsules
                                </Button>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                component="img"
                                src="/src/assets/time-capsule-hero.svg"
                                alt="Digital Time Capsule Illustration"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    height: 'auto',
                                    display: { xs: 'none', md: 'block' },
                                    margin: '0 auto',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                >
                    Features
                </Typography>
                <Typography
                    variant="h6"
                    align="center"
                    color="textSecondary"
                    paragraph
                    sx={{ mb: 6 }}
                >
                    Our platform offers powerful tools to create meaningful time
                    capsules
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[8],
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{ flexGrow: 1, textAlign: 'center' }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works Section */}
            <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                    >
                        How It Works
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="textSecondary"
                        paragraph
                        sx={{ mb: 6 }}
                    >
                        Create your own time capsule in just a few simple steps
                    </Typography>

                    <Grid container spacing={isMobile ? 4 : 8}>
                        {[
                            {
                                number: '01',
                                title: 'Create',
                                description:
                                    'Upload photos, videos, messages, or any digital content to your capsule.',
                            },
                            {
                                number: '02',
                                title: 'Encrypt',
                                description:
                                    'Your content is securely encrypted with AES-256 and stored on IPFS.',
                            },
                            {
                                number: '03',
                                title: 'Set Timer',
                                description:
                                    'Choose when your capsule can be opened - days, months, or years from now.',
                            },
                            {
                                number: '04',
                                title: 'Share',
                                description:
                                    'Optionally share access with friends or family for a future surprise.',
                            },
                        ].map((step, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography
                                        variant="h2"
                                        component="div"
                                        color="primary"
                                        fontWeight="bold"
                                    >
                                        {step.number}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                    fontWeight="medium"
                                    align="center"
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    align="center"
                                >
                                    {step.description}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to="/register"
                        >
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};