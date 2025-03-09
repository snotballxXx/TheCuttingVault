// reducer.ts
import { createReducer } from '@reduxjs/toolkit';
import { updateTitle } from './actions';

interface titleState {
    title: string;
}

const initialTitleState: titleState = {
    title: '',
};

const titleReducer = createReducer(initialTitleState, (builder) => {
    builder.addCase(updateTitle, (state, action) => {
        state.title = action.payload;
    });
});

export default titleReducer;
