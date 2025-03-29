import { Box } from '@mui/material';
import { Navigate, RouteObject } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { HomePage } from '../pages/HomePage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <HomePage />
                ),
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
