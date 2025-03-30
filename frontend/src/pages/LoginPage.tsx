import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginUserSchema, LoginUserType } from '../schemas/authSchemas';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser, error, loginStatus, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserType>({
        resolver: zodResolver(LoginUserSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginUserType) => {
        try {
            console.log('Login data:', data); // Log the data being sent
            await loginUser(data);
            navigate('/');
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Login failed', error);
        }
    };

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const isLoading = loginStatus === 'pending';

    // Get the intended destination from location state, or default to homepage
    const from = location.state?.from?.pathname || '/';

    // Redirect to intended destination if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        textAlign="center"
                    >
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <Stack spacing={3}>
                            <TextField
                                label="Email Address"
                                fullWidth
                                autoComplete="email"
                                autoFocus
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Password"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                                aria-label={
                                                    showPassword
                                                        ? 'hide password'
                                                        : 'show password'
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                loading={isLoading}
                            >
                                Log In
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Don't have an account?{' '}
                                    <Button
                                        component={Link}
                                        to="/register"
                                        color="primary"
                                    >
                                        Register
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
