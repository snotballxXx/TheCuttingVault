import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
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
import PasswordInput, { PasswordData } from '../PasswordInput';
import { DialogResult } from '../../store/dataTypes';

export default function LoginDialog() {
    const [open, setOpen] = useState(true);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(false);
    const [pending, setPending] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [newPasswordData, setNewPasswordData] = useState<PasswordData>({
        password: '',
        enterPressed: false,
    });    
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
    };

    useEffect(() => {
        if (newPasswordData.enterPressed && userName.length !== 0 && newPasswordData.password.length !== 0) {
          handleLogin();
      }
    }, [newPasswordData]);

    const handleLogin = async () => {
        try {
            setPending(true);
            const result = await login({ userName, password: newPasswordData.password });
            // Store the token in local storage and set the auth token
            setCookie('authToken', result.token, 7);
            setAuthToken(result.token);
            dispatch(logIn(result.user));
            if (keepLoggedIn) {
                setCookie('user', JSON.stringify(result.user));
            } else {
                removeCookie('user');
            }

            if (!result.user.changePassword) {
              setOpen(false);
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeepLoggedIn(event.target.checked);
    };

    const changePasswordClose =  (result: DialogResult) => {
      setChangePassword(false);
      if (result !== DialogResult.cancel)
        setOpen(false);
  }

    const newPasswordUpdate = (password: PasswordData) => {
        setNewPasswordData(password);
    };  

    return (
        <>
            {changePassword && (
                <NewPasswordDialog userName={userName} routeToHome={true} callback={changePasswordClose}/>
            )}
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
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <PasswordInput
                        passwordUpdateCallback={newPasswordUpdate}
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
