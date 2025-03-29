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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterUserSchema, RegisterUserType } from '../schemas/authSchemas';

export function RegisterPage() {
    const navigate = useNavigate();
    const { registerUser, error, registerStatus } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterUserType>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });

    const onSubmit = async (data: RegisterUserType) => {
        try {
            await registerUser(data);
            navigate('/');
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Registration failed', error);
        }
    };

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () =>
        setShowConfirmPassword((prev) => !prev);

    const isLoading = registerStatus === 'pending';

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
                        Create an Account
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
                                label="Name"
                                fullWidth
                                autoComplete="name"
                                autoFocus
                                {...register('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Email Address"
                                fullWidth
                                autoComplete="email"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Password"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
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

                            <TextField
                                label="Confirm Password"
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={
                                                    toggleShowConfirmPassword
                                                }
                                                edge="end"
                                                aria-label={
                                                    showConfirmPassword
                                                        ? 'hide password'
                                                        : 'show password'
                                                }
                                            >
                                                {showConfirmPassword ? (
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
                                Register
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Already have an account?{' '}
                                    <Button
                                        component={Link}
                                        to="/login"
                                        color="primary"
                                    >
                                        Log in
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
