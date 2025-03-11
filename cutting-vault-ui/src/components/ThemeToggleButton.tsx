import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useThemeContext } from '../Theme-Context';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggleButton: React.FC = () => {
    const { isDarkMode, toggleTheme } = useThemeContext();

    return (
        <Tooltip title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}>
            <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggleButton;
