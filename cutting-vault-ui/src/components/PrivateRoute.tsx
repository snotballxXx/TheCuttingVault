// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import MainComponent from './MainComponent';
import { getCookie } from '../utils/cookies';
import { logIn } from '../store/userSlice';

const PrivateRoute: React.FC = () => {
    const dispatch = useDispatch();
    try {
        const userString = getCookie('user');
        if (userString) {
            const user = JSON.parse(userString);
            dispatch(logIn(user));
        }
    } catch (err) {
        console.log('error recreating user');
    }

    const user = useSelector((state: RootState) => state.user.value);
    const isAuthenticated = user !== null;

    return isAuthenticated ? <MainComponent /> : <Navigate to="/login" />;
};

export default PrivateRoute;
