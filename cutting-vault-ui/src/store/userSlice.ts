// src/store/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from './dataTypes';

interface UserState {
    value: User | null;
}

const initialState: UserState = {
    value: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut: (state) => {
            state.value = null;
        },
        logIn: (state, action: PayloadAction<User | null>) => {
            state.value = action.payload;
        },
    },
});

export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
