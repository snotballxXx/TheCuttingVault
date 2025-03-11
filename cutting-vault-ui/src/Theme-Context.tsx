import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { getCookie, setCookie } from './utils/cookies';

interface ThemeContextProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = useMemo(
        () => (isDarkMode ? darkTheme : lightTheme),
        [isDarkMode],
    );

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
        setCookie('theme', isDarkMode ? 'Light' : 'Dark');
    };

    useEffect(() => {
        const theme = getCookie('theme');
        setIsDarkMode(theme !== undefined && theme === 'Dark');
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error(
            'useThemeContext must be used within a ThemeProviderWrapper',
        );
    }
    return context;
};
