// actions.ts
import { createAction } from '@reduxjs/toolkit';

export const updateTitle = createAction<string>('UPDATE_TITLE');
