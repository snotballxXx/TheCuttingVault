import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { changePassword } from '../../services/api-service';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isPasswordValid } from '../../utils/utils';
import { useSnackbar } from 'notistack';
import { DialogResult } from '../../store/dataTypes';
import PasswordInput, { PasswordData } from '../PasswordInput';

export type ChangePasswordDialogResult = (result: DialogResult) => void;

export type Props = {
    userName: string;
    routeToHome: boolean;
    callback?: ChangePasswordDialogResult;
    title?: string;
};

export default function NewPasswordDialog(props: Props) {
    const [open, setOpen] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(false);
    const [newPasswordData, setNewPasswordData] = useState<PasswordData>({
        password: '',
        enterPressed: false,
    });
    const [oldPasswordData, setOldPasswordData] = useState<PasswordData>({
        password: '',
        enterPressed: false,
    });
    const [confirmPasswordData, setConfirmPasswordData] =
        useState<PasswordData>({ password: '', enterPressed: false });
    const [errorMessage, setErrorMessage] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        setNewPassword(newPasswordData.password);
        if (newPasswordData.enterPressed) {
            setTimeout(() => checkPasswordChange(), 1);
        }
    }, [newPasswordData]);

    useEffect(() => {
        setOldPassword(oldPasswordData.password);
        if (oldPasswordData.enterPressed) {
          setTimeout(() => checkPasswordChange(), 1);
        }
    }, [oldPasswordData]);

    useEffect(() => {
        setConfirmPassword(confirmPasswordData.password);
        if (confirmPasswordData.enterPressed) {
          setTimeout(() => checkPasswordChange(), 1);
        }
    }, [confirmPasswordData]);

    const checkPasswordChange = () => {
        if (
            oldPassword.length !== 0 &&
            newPassword.length !== 0 &&
            confirmPassword.length !== 0
        ) {
            handlePasswordChange();
        }
    };
    const handleClose = (
        _: React.MouseEvent | {},
        reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpen(false);
        if (props.callback) props.callback(DialogResult.ok);
    };

    const closeDialog = () => {
        setOpen(false);
        if (props.callback) props.callback(DialogResult.cancel);
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
            if (props.callback) props.callback(DialogResult.ok);
            enqueueSnackbar('Successfully changed password', {
                variant: 'success',
            });

            if (props.routeToHome) navigate('/');
        } catch (err) {
            enqueueSnackbar(
                'Failed to change password, ensure the old password is correct.',
                {
                    variant: 'error',
                },
            );
        }
    };

    const newPasswordUpdate = (password: PasswordData) => {
        setNewPasswordData(password);
    };
    const oldPasswordUpdate = (password: PasswordData) => {
        setOldPasswordData(password);
    };
    const confirmPasswordUpdate = (password: PasswordData) => {
        setConfirmPasswordData(password);
    };

    return (
        <>
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
                <DialogTitle>
                    <Stack direction={'row'}>
                        <Typography variant="h4" component="h4" gutterBottom>
                            {props?.title ?? 'The Cutting Vault'}
                        </Typography>{' '}
                    </Stack>
                </DialogTitle>
                <DialogContent >
                    <PasswordInput
                        passwordUpdateCallback={oldPasswordUpdate}
                        displayLabel="Old Password"
                        autoFocus
                    />
                    <PasswordInput
                        passwordUpdateCallback={newPasswordUpdate}
                        displayLabel="New Password"
                    />
                    <PasswordInput
                        passwordUpdateCallback={confirmPasswordUpdate}
                        displayLabel="Confirm Password"
                    />
                </DialogContent>
                <DialogActions>
                    <Stack
                        direction={'column'}
                        sx={{ width: '100%', padding: '20px' }}
                    >
                        {error && (
                            <Alert sx={{ margin: '10px' }} severity="error">
                                {errorMessage}
                            </Alert>
                        )}
                        <Stack direction={'row'}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={closeDialog}
                            >
                                Cancel
                            </Button>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePasswordChange}
                            >
                                Update Password
                            </Button>
                        </Stack>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}
