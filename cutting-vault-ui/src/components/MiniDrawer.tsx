import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logOut } from '../store/userSlice';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import { removeUser } from '../utils/utils';
import ThemeToggleButton from './ThemeToggleButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookies';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            },
        },
    ],
}));

interface MiniDrawerProps {
    children: React.ReactNode;
}

const MiniDrawer: React.FC<MiniDrawerProps> = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const titleState = useSelector((state: RootState) => state.title);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      var drawState = getCookie('drawState');
      if (drawState) {
        setOpen((drawState === 'open') ? true : false);
      }

    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
        setCookie('drawState', 'open');
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setCookie('drawState', 'closed');
    };

    const handleLogOut = () => {
        dispatch(logOut());
        //localStorage.removeItem('token');
        removeUser();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                {' '}
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {titleState.title}
                    </Typography>
                    <ThemeToggleButton />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" noWrap component="div">
                        The Cutting Vault
                    </Typography>
                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem
                        key="Home"
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={Link}
                            to="/"
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Home"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        key="Loyalty"
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={Link}
                            to="/loyalty"
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <LoyaltyIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Loyalty Program"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        key="Customer"
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={Link}
                            to="/customer"
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Customer Management"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        key="quickComment"
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={Link}
                            to="/comment"
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Quick Comment"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                {/* Spacer this forces kogout down*/}
                <Box sx={{ flexGrow: 1 }} />
                <List>
                    <ListItem
                        key="profile"
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={Link}
                            to="/profile"
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <AccountCircleIcon fontSize="large" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Profile"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List sx={{ display: 'flex' }}>
                    <ListItem
                        key="LogOut"
                        disablePadding
                        sx={{ display: 'block', alignSelf: 'flex-end' }}
                    >
                        <ListItemButton
                            onClick={() => handleLogOut()}
                            sx={[
                                { minHeight: 48, px: 2.5 },
                                open
                                    ? { justifyContent: 'initial' }
                                    : { justifyContent: 'center' },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                ]}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Log Out"
                                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

export default MiniDrawer;
