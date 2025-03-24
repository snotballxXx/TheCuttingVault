// NotFoundPage.tsx
import React from 'react';
import { Box } from '@mui/material';
import construction from '../../assets/construction.png';

const ConstructionPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img
                src={construction}
                alt="In progress"
                style={{ maxWidth: '50%', height: 'auto' }}
            />
        </Box>
    );
};

export default ConstructionPage;
