import { createTheme } from '@mui/material/styles';

// Custom theme for the Decentralized Time Capsule application
export const theme = createTheme({
    palette: {
        primary: {
            main: '#2E3B55', // Deep blue for trust and security
            light: '#546280',
            dark: '#1A2238',
        },
        secondary: {
            main: '#F19953', // Orange for warmth and nostalgia
            light: '#FFBC80',
            dark: '#D07A2C',
        },
        background: {
            default: '#F5F5F7',
            paper: '#FFFFFF',
        },
        error: {
            main: '#D32F2F',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
});
