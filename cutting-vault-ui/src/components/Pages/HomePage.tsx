import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateTitle } from '../../store/actions';

const HomePage: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateTitle('Home'));
    }, []);

    return (
        <Container>
            <Typography variant="h4">Welcome to The Cutting Vault</Typography>
            <Typography variant="body1" gutterBottom>
                <p>
                    <i>
                        "Our mission is to empower confidence and individuality
                        through exceptional hairstyling. We are committed to
                        creating a welcoming, inclusive space where creativity,
                        expertise, and premium services come together to help
                        clients express their unique beauty. By staying at the
                        forefront of innovation and trends, we aim to deliver
                        personalized experiences that inspire trust, loyalty,
                        and self-expression."
                    </i>
                </p>
            </Typography>
        </Container>
    );
};

export default HomePage;
