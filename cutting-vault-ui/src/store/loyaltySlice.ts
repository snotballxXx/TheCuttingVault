// src/store/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LoyaltyState {
    value: number;
    x: number;
    y: number;
}

const initialState: LoyaltyState = {
    value: 0,
    x: 0,
    y: 0
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
        set: (state, action: PayloadAction<LoyaltyState>) => {
            state.value = action.payload.value;
            state.x = action.payload.x;
            state.y = action.payload.y
        },
    },
});

export const { increment, decrement, set } = loyaltySlice.actions;

export default loyaltySlice.reducer;
