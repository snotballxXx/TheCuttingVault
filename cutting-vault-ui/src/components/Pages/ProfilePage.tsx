import React, { useEffect, useState } from 'react';
import { Button, Container, Paper, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateTitle } from '../../store/actions';
import { RootState } from '../../store/store';
import NewPasswordDialog from '../Dialogs/NewPasswordDialog';
import Grid from '@mui/material/Grid2';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.value);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        dispatch(updateTitle(`Profile - ${user?.userName}`));
    }, []);

    const changePasswordClose = () => {
        setChangePassword(false);
    };

    return (
        <Container>
            <Button onClick={() => setChangePassword(true)}>
                Change Password
            </Button>
            {changePassword && (
                <NewPasswordDialog
                    userName={user?.userName ?? ''}
                    routeToHome={false}
                    callback={changePasswordClose}
                    title="Change Password"
                />
            )}
        </Container>
    );
};

export default ProfilePage;
