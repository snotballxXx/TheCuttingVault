import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { changePassword } from '../../services/api-service';
import { Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import iconCutting from '../../assets/scissors.svg';
import iconVault from '../../assets/bank-safe.svg';
import { isPasswordValid } from '../../utils/utils';
import { useSnackbar } from 'notistack';

export type Props = {
    userName: string;
};

export default function NewPasswordDialog(props: Props) {
    const [open, setOpen] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleClose = (
        _: React.MouseEvent | {},
        reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpen(false);
    };

    const handlePasswordChange = async () => {
        if (!isPasswordValid(newPassword, oldPassword)) {
            setErrorMessage(
                'Your new password does not meet the correct criteria',
            );
            setError(true);
            return;
        }

        if (confirmPassword !== newPassword) {
            setErrorMessage('Your passwords are different');
            setError(true);
            return;
        }
        setError(false);

        try {
            await changePassword({
                userName: props.userName,
                newPassword,
                oldPassword,
            });
            setOpen(false);
            enqueueSnackbar('Successfully changed password', {
                variant: 'success',
            });
            navigate('/');
        } catch (err) {
            enqueueSnackbar(
                'Failed to change password, ensure the old password is correct.',
                {
                    variant: 'error',
                },
            );
            //setOpen(false);
            //navigate('/');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
            event.key === 'Enter' &&
            oldPassword.length !== 0 &&
            newPassword.length !== 0 &&
            confirmPassword.length !== 0
        ) {
            handlePasswordChange();
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown
                slotProps={{
                    backdrop: {
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
                    },
                    paper: {
                        component: 'form',
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant="h4" component="h4" gutterBottom>
                        The Cutting Vault
                    </Typography>{' '}
                    <img src={iconCutting} alt="Icon" width="24" height="24" />
                    <img src={iconVault} alt="Icon" width="24" height="24" />
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Old Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <TextField
                        label="New Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    {error && (
                        <Alert sx={{ margin: '10px' }} severity="error">
                            {errorMessage}
                        </Alert>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePasswordChange}
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
