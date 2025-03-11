import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateTitle } from '../../store/actions';
import { RootState } from '../../store/store';

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.value);

    useEffect(() => {
        dispatch(updateTitle(`Profile - ${user?.userName}`));
    }, []);

    return (
        <Container>
            <Typography variant="h4"></Typography>
            <Typography variant="body1" gutterBottom>
            </Typography>
        </Container>
    );
};

export default ProfilePage;
