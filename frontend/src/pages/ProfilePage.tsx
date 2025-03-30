import {
    Avatar,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
    const { user, logoutUser } = useAuth();

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
                    <Grid size={{ xs: 12, md: 4 }} textAlign="center">
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
                    <Grid size={{ xs: 12, md: 8 }} textAlign="left">
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
                    <Grid size={{ xs: 12, md: 12 }} textAlign="center" sx={{ mt: 3 }}>
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
        </Container>
    );
};
