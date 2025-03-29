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
import { useCapsules } from '../hooks/useCapsules';

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
    const { data: userCapsules, isLoading, error } = useUserCapsules();

    console.log('userCapsules', userCapsules);

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
    const nextUnlock =
        lockedCapsules.length > 0
            ? new Date(
                  lockedCapsules.sort(
                      (a, b) =>
                          new Date(a.unlockDate).getTime() -
                          new Date(b.unlockDate).getTime()
                  )[0].unlockDate
              ).toLocaleDateString()
            : 'None';

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
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
                }}
            >
                <Grid container spacing={3}>
                    {/* Total Stats */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box color="white">
                            <Typography variant="h5" fontWeight="bold">
                                Your Capsule Collection
                            </Typography>
                            <Typography variant="body1">
                                You have {totalCapsules} time{' '}
                                {totalCapsules === 1 ? 'capsule' : 'capsules'}{' '}
                                in total
                            </Typography>
                            {nextUnlock !== 'None' && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Next unlock: {nextUnlock}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Locked/Unlocked Count */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={2}>
                            {/* Unlocked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                    }}
                                >
                                    <LockOpenIcon
                                        color="success"
                                        sx={{ fontSize: 32, mr: 1 }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {totalUnlocked}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Unlocked
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Locked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                    }}
                                >
                                    <LockClockIcon
                                        color="error"
                                        sx={{ fontSize: 32, mr: 1 }}
                                    />
                                    <Box>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {totalLocked}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Locked
                                        </Typography>
                                    </Box>
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
