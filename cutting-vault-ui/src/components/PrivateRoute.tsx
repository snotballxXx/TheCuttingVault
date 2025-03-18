// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import MainComponent from './MainComponent';
import { logIn } from '../store/userSlice';
import { readObjectFromLocalStorage } from '../utils/utils';

const PrivateRoute: React.FC = () => {
    const dispatch = useDispatch();
    try {
        const user = readObjectFromLocalStorage('user');
        if (user) {
            dispatch(logIn(user));
        }
    } catch (err) {
        debugger;
        console.log('error recreating user');
    }

    const user = useSelector((state: RootState) => state.user.value);
    const isAuthenticated = user !== null;

    return isAuthenticated ? <MainComponent /> : <Navigate to="/login" />;
};

export default PrivateRoute;
