import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { login, setAuthToken } from '../../services/api-service';
import {
    Alert,
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
} from '@mui/material';
import { removeCookie, setCookie } from '../../utils/cookies';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../store/userSlice';
import NewPasswordDialog from './NewPasswordDialog';
import PasswordInput from '../PasswordInput';

export default function LoginDialog() {
    const [open, setOpen] = useState(true);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [pending, setPending] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);

    const handleClose = (
        _: React.MouseEvent | {},
        reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpen(false);
    };

    const handleLogin = async () => {
        try {
            setPending(true);
            const result = await login({ userName, password });
            // Store the token in local storage and set the auth token
            //localStorage.setItem('token', result.token);
            setCookie('authToken', result.token, 7);
            setAuthToken(result.token);
            setOpen(false);
            dispatch(logIn(result.user));
            if (keepLoggedIn) {
                setCookie('user', JSON.stringify(result.user), 7);
            } else {
                removeCookie('user');
            }

            if (!result.user.changePassword) {
                navigate('/');
            } else {
                setChangePassword(true);
            }
        } catch (err) {
            removeCookie('authToken');
            setAuthToken(null);
            setError(true);
        }
        setPending(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
            event.key === 'Enter' &&
            userName.length !== 0 &&
            password.length !== 0
        ) {
            handleLogin();
        }
    };

    const passwordUpdate = (password: string, enterPressed: boolean) => {
        setPassword(password);
        if (enterPressed && userName.length !== 0 && password.length !== 0) {
            handleLogin();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeepLoggedIn(event.target.checked);
    };

    return (
        <>
            {changePassword && <NewPasswordDialog userName={userName} />}
            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: 'rgba(0, 0, 0, 0.0)' },
                    },
                    paper: {
                        component: 'form',
                    },
                }}
            >
                <DialogTitle sx={{ width: '400px' }}>
                    <Typography variant="h4" component="h4" gutterBottom>
                        The Cutting Vault
                    </Typography>{' '}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="User Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={userName}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <PasswordInput
                        passwordUpdateCallback={passwordUpdate}
                        displayLabel="Password"
                    />
                </DialogContent>
                <DialogActions>
                    <Stack
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {error && (
                            <Alert sx={{ margin: '10px' }} severity="error">
                                Invalid username or password
                            </Alert>
                        )}
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={keepLoggedIn}
                                        onChange={handleChange}
                                        name="keepMeLoggedIn"
                                        color="primary"
                                    />
                                }
                                label="Keep me logged in"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                                disabled={pending}
                            >
                                Login
                            </Button>
                        </Box>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
