import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                backgroundcolor:
                    'rgba(0, 0, 0, 0.5)' /* Black with 50% transparency */,
            }}
        >
            <CircularProgress size={75} thickness={5} color="secondary" />
        </Box>
    );
}
