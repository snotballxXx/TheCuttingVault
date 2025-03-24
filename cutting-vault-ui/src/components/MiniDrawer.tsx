import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logOut } from '../store/userSlice';
import LoyaltyTwoToneIcon from '@mui/icons-material/LoyaltyTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import {
    readValueFromLocalStorage,
    removeUser,
    saveValueToLocalStorage,
} from '../utils/utils';
import ThemeToggleButton from './ThemeToggleButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect } from 'react';
import MiniDrawItem from './MiniDrawItem';

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
        var drawState = readValueFromLocalStorage('drawState');
        if (drawState) {
            setOpen(drawState === 'open');
        }
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
        saveValueToLocalStorage('drawState', 'open');
    };

    const handleDrawerClose = () => {
        setOpen(false);
        saveValueToLocalStorage('drawState', 'closed');
    };

    const handleLogOut = () => {
        dispatch(logOut());
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
                <MiniDrawItem
                    title="Home"
                    route="/"
                    isOpen={open}
                    getIcon={() => <HomeTwoToneIcon />}
                />
                <MiniDrawItem
                    title="Loyalty Program"
                    route="/loyalty"
                    isOpen={open}
                    getIcon={() => <LoyaltyTwoToneIcon />}
                />
                <MiniDrawItem
                    title="Customer Management"
                    route="/customer"
                    isOpen={open}
                    getIcon={() => <PeopleAltTwoToneIcon />}
                />
                <MiniDrawItem
                    title="Quick Comment"
                    route="/comment"
                    isOpen={open}
                    getIcon={() => <CommentTwoToneIcon />}
                />
                <MiniDrawItem
                    title="Inventory"
                    route="/construction"
                    isOpen={open}
                    getIcon={() => <InventoryTwoToneIcon />}
                />
                <MiniDrawItem
                    title="Dashboard"
                    route="/construction"
                    isOpen={open}
                    getIcon={() => <SpaceDashboardTwoToneIcon />}
                />
                {/* Spacer this forces logout down*/}
                <Box sx={{ flexGrow: 1 }} />
                <MiniDrawItem
                    title="Profile"
                    route="/profile"
                    isOpen={open}
                    getIcon={() => <AccountCircleIcon fontSize="large" />}
                />
                <Divider />
                <MiniDrawItem
                    title="Log Out"
                    onClick={() => handleLogOut()}
                    isOpen={open}
                    getIcon={() => <LogoutIcon />}
                />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
};

export default MiniDrawer;
