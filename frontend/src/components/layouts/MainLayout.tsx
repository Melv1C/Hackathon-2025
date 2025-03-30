import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Navigation links for the header
const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Create Capsule', path: '/capsules/create' },
    { text: 'My Capsules', path: '/my-capsules' },
    { text: 'Documentation', path: '/documentation' },
];

export function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, user, logoutUser } = useAuth();

    // Account menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAccountMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logoutUser();
        handleCloseAccountMenu();
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
                {isAuthenticated ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText
                                    primary={`Hello, ${user?.name || 'User'}`}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={RouterLink}
                                to="/profile"
                                sx={{ textAlign: 'center' }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24 }} />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{ textAlign: 'center' }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/login"
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                )}
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

                                {isAuthenticated ? (
                                    <>
                                        <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleOpenAccountMenu}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={
                                                    open
                                                        ? 'account-menu'
                                                        : undefined
                                                }
                                                aria-haspopup="true"
                                                aria-expanded={
                                                    open ? 'true' : undefined
                                                }
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: 'primary.main',
                                                    }}
                                                >
                                                    {user?.name?.charAt(0) ||
                                                        'U'}
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleCloseAccountMenu}
                                            onClick={handleCloseAccountMenu}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                    mt: 1.5,
                                                    '& .MuiAvatar-root': {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{
                                                horizontal: 'right',
                                                vertical: 'top',
                                            }}
                                            anchorOrigin={{
                                                horizontal: 'right',
                                                vertical: 'bottom',
                                            }}
                                        >
                                            <MenuItem
                                                component={RouterLink}
                                                to="/profile"
                                            >
                                                <Avatar /> Profile
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <ListItemIcon>
                                                    <LogoutIcon fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    >
                                        Login
                                    </Button>
                                )}
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
