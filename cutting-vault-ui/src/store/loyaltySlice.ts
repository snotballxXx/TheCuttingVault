// src/store/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LoyaltyState {
    value: number;
}

const initialState: LoyaltyState = {
    value: 0,
};

const loyaltySlice = createSlice({
    name: 'loyaltyCount',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        set: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { increment, decrement, set } = loyaltySlice.actions;

export default loyaltySlice.reducer;
