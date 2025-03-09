// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import loyaltyCounterReducer from './loyaltySlice';
import titleReducer from './reducer';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        loyaltyCount: loyaltyCounterReducer,
        title: titleReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
