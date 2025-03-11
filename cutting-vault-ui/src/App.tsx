import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import AboutPage from './components/Pages/AboutPage';
import LoginPage from './components/Pages/LoginPage';
import { Provider } from 'react-redux';
import store from './store/store';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './components/Pages/NotFoundPage';
import { getCookie } from './utils/cookies';
import { setAuthToken } from './services/api-service';
import CustomerPage from './components/Pages/CustomerPage';
import { SnackbarProvider } from 'notistack';
import LoyaltyPage from './components/Pages/LoyaltyPage';
import NavigationInitializer from './components/NavigationInitializer';
import QuickCommentPage from './components/Pages/QuickComment';
import { ThemeProviderWrapper } from './Theme-Context';
import ProfilePage from './components/Pages/ProfilePage';

const App: React.FC = () => {
    setAuthToken(getCookie('authToken') ?? null);

    return (
        <Provider store={store}>
            <ThemeProviderWrapper>
                <Router>
                    <NavigationInitializer />
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{
                            vertical: 'top', // Position on the vertical axis (top, bottom)
                            horizontal: 'right', // Position on the horizontal axis (left, center, right)
                        }}
                    >
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route element={<PrivateRoute />}>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route
                                    path="/loyalty"
                                    element={<LoyaltyPage />}
                                />
                                <Route
                                    path="/comment"
                                    element={<QuickCommentPage />}
                                />
                                <Route
                                    path="/profile"
                                    element={<ProfilePage />}
                                />
                                <Route
                                    path="/customer"
                                    element={<CustomerPage />}
                                />
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </SnackbarProvider>
                </Router>
            </ThemeProviderWrapper>
        </Provider>
    );
};

export default App;
