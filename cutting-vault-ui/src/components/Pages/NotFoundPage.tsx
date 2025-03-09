// NotFoundPage.tsx
import React from 'react';
import { Box } from '@mui/material';
import notFoundImage from '../../assets/not-found.jpg';

const NotFoundPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <img
                src={notFoundImage}
                alt="Not Found"
                style={{ maxWidth: '50%', height: 'auto' }}
            />
        </Box>
    );
};

export default NotFoundPage;
