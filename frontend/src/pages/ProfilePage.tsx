import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Mock data for time capsules - replace with actual API call
const mockCapsuleStats = {
    total: 12,
    locked: 8,
    unlocked: 4,
    nextUnlock: '2023-12-25',
};

export const ProfilePage = () => {
    const { user, logoutUser } = useAuth();
    const [capsuleStats] = useState(mockCapsuleStats);

    // Effect to fetch user's time capsule statistics
    useEffect(() => {
        // Replace with actual API call
        // const fetchCapsuleStats = async () => {
        //     try {
        //         const response = await fetch('/api/user/capsules/stats');
        //         const data = await response.json();
        //         setCapsuleStats(data);
        //     } catch (error) {
        //         console.error('Failed to fetch capsule stats:', error);
        //     }
        // };
        // fetchCapsuleStats();
    }, [user?.id]);

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #2a3eb1, #4364f7)',
                    color: 'white',
                    mb: 3,
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid size="auto">
                        <Avatar
                            alt={user?.name || 'User'}
                            sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid white',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            }}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </Grid>
                    <Grid size="grow">
                        <Typography variant="h4" fontWeight="bold">
                            {user?.name || 'User Profile'}
                        </Typography>
                        <Typography variant="subtitle1">
                            {user?.email || 'user@example.com'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Member since:{' '}
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : 'Unknown'}
                        </Typography>
                    </Grid>
                    <Grid size="auto">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => logoutUser()}
                            sx={{ borderRadius: 2 }}
                        >
                            Sign Out
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Time Capsule Statistics */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Your Time Capsules
            </Typography>
            <Grid container spacing={3}>
                {/* Total Capsules */}
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <CalendarTodayIcon
                                color="primary"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                                {capsuleStats.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Capsules
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Locked Capsules */}
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <LockClockIcon
                                color="error"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                                {capsuleStats.locked}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Locked
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Unlocked Capsules */}
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <LockOpenIcon
                                color="success"
                                sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography variant="h4" fontWeight="bold">
                                {capsuleStats.unlocked}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Unlocked
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Next Unlock */}
                <Grid size={{ xs: 6, md: 3 }}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Next Unlock
                            </Typography>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ textAlign: 'center' }}
                            >
                                {new Date(
                                    capsuleStats.nextUnlock
                                ).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* View All Button */}
                <Grid size={12} sx={{ mt: 2 }}>
                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 2 }}
                            href="/capsules"
                        >
                            View All Time Capsules
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
