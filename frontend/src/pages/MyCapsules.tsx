import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Box,
    Card,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { CapsuleCard } from '../components/capsules/CapsuleCard';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { useCapsules } from '../hooks/useCapsules';
import { useCountdown } from '../hooks/useCountdown';

// TabPanel component to handle tab content
function TabPanel(props: {
    children: React.ReactNode;
    value: number;
    index: number;
}) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`capsule-tabpanel-${index}`}
            aria-labelledby={`capsule-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export function MyCapsules() {
    const [tabValue, setTabValue] = useState(0);
    const { useUserCapsules } = useCapsules();
    const { data: userCapsules, isLoading, error, refetch } = useUserCapsules();

    // Handle tab change
    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setTabValue(newValue);
    };

    // Filter capsules by locked/unlocked status
    const unlockedCapsules =
        userCapsules?.filter((capsule) => capsule.isUnlocked) || [];
    const lockedCapsules =
        userCapsules?.filter((capsule) => !capsule.isUnlocked) || [];

    // Calculate statistics
    const totalCapsules = userCapsules?.length || 0;
    const totalUnlocked = unlockedCapsules.length;
    const totalLocked = lockedCapsules.length;

    // Find the next capsule to be unlocked
    const nextUnlockCapsule =
        lockedCapsules.length > 0
            ? lockedCapsules.sort(
                  (a, b) =>
                      new Date(a.unlockDate).getTime() -
                      new Date(b.unlockDate).getTime()
              )[0]
            : null;

    const nextUnlockDate = nextUnlockCapsule
        ? new Date(nextUnlockCapsule.unlockDate)
        : null;

    const countdown = useCountdown(nextUnlockDate);

    // Handle countdown completion
    const handleCountdownComplete = () => {
        console.log('Countdown completed - refreshing capsules data');
        refetch();
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h6">
                    Error loading your capsules. Please try again later.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Time Capsules
            </Typography>

            {/* Stats Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
                    boxShadow:
                        '0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        background:
                            'radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)',
                    },
                }}
            >
                <Grid container spacing={3}>
                    {/* Total Stats */}
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        <Box color="white">
                            <Box display="flex" alignItems="center" mb={1}>
                                <CollectionsBookmarkIcon sx={{ mr: 1 }} />
                                <Typography variant="h5" fontWeight="bold">
                                    Your Capsule Collection
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                You have{' '}
                                <Box
                                    component="span"
                                    fontWeight="bold"
                                    fontSize={18}
                                >
                                    {totalCapsules}
                                </Box>{' '}
                                time{' '}
                                {totalCapsules === 1 ? 'capsule' : 'capsules'}{' '}
                                in total
                            </Typography>

                            {nextUnlockCapsule && (
                                <CountdownTimer
                                    years={countdown.years}
                                    days={countdown.days}
                                    hours={countdown.hours}
                                    minutes={countdown.minutes}
                                    seconds={countdown.seconds}
                                    title="Time until next unlock:"
                                    onComplete={handleCountdownComplete}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Locked/Unlocked Count */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={2}>
                            {/* Unlocked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <LockOpenIcon
                                        color="success"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalUnlocked}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Unlocked
                                    </Typography>
                                </Card>
                            </Grid>

                            {/* Locked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <LockClockIcon
                                        color="error"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalLocked}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Locked
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="capsule tabs"
                    variant="fullWidth"
                >
                    <Tab
                        label={`Unlock Capsule (${totalUnlocked})`}
                        icon={<LockOpenIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Lock Capsule (${totalLocked})`}
                        icon={<LockClockIcon />}
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {/* Unlocked Capsules Tab */}
            <TabPanel value={tabValue} index={0}>
                {unlockedCapsules.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            You don't have any unlocked capsules yet.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Your capsules will appear here once they're
                            unlocked.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {unlockedCapsules.map((capsule) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={capsule.id}
                            >
                                <CapsuleCard capsule={capsule} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Locked Capsules Tab */}
            <TabPanel value={tabValue} index={1}>
                {lockedCapsules.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            You don't have any locked capsules yet.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create a new capsule to get started!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {lockedCapsules.map((capsule) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={capsule.id}
                            >
                                <CapsuleCard capsule={capsule} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>
        </Container>
    );
}
