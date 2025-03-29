import { Box } from '@mui/material';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { MainLayout } from '../components/layouts/MainLayout';
import { CapsulePage } from '../pages/CapsulePage';
import { CreateCapsulePage } from '../pages/CreateCapsulePage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyCapsules } from '../pages/MyCapsules';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'capsules/create',
                element: (
                    <ProtectedRoute>
                        <CreateCapsulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-capsules',
                element: (
                    <ProtectedRoute>
                        <MyCapsules />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'capsule/:capsuleId',
                element: (
                    <ProtectedRoute>
                        <CapsulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: '*',
                element: (
                    <Box sx={{ p: 2 }}>
                        <h1>404 Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                    </Box>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
];
