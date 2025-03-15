import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateTitle } from '../../store/actions';
import { RootState } from '../../store/store';
import NewPasswordDialog from '../Dialogs/NewPasswordDialog';

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
