import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateTitle } from '../../store/actions';
import ParticlesBackground from '../ParticlesBackground';
import LoginDialog from '../Dialogs/LoginDialog';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateTitle('Login'));
    }, []);

    return (
        <Container>
            <ParticlesBackground />
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <LoginDialog />
            </Container>
        </Container>
    );
};

export default LoginPage;
