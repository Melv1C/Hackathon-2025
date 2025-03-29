import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';

// Navigation links for the header
const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Create Capsule', path: '/capsules/create' },
    { text: 'My Capsules', path: '/my-capsules' },
];

export function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Mobile drawer component
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{ textDecoration: 'none', color: 'text.primary' }}
                >
                    Time Capsule
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="close drawer"
                    onClick={handleDrawerToggle}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton
                        component={RouterLink}
                        to="/login"
                        sx={{ textAlign: 'center' }}
                    >
                        <ListItemText primary="Login" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <AppBar
                position="static"
                color="default"
                elevation={1}
                sx={{ backgroundColor: 'background.paper' }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        disableGutters
                        sx={{ justifyContent: 'space-between' }}
                    >
                        {/* Logo */}
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src="/src/assets/time-capsule-hero.svg"
                                alt="Time Capsule Logo"
                                sx={{
                                    height: 32,
                                    width: 'auto',
                                    mr: 1,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            />
                            Time Capsule
                        </Typography>

                        {/* Navigation - Desktop */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.text}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{ mx: 1 }}
                                    >
                                        {item.text}
                                    </Button>
                                ))}
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="outlined"
                                    sx={{ ml: 2 }}
                                >
                                    Login
                                </Button>
                            </Box>
                        )}

                        {/* Mobile menu button */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Box>

            {/* Simplified Footer */}
            <Box
                component="footer"
                sx={{
                    py: 2,
                    mt: 'auto',
                    backgroundColor: theme.palette.grey[100],
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        © {new Date().getFullYear()} Decentralized Time Capsule
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
