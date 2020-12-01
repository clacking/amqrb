import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoggedUser {
    token: string;
}

export type LoginState = {
    state: LoggedUser;
    loading: boolean;
    error: boolean;
    errorMessage: string;
}

export const initialState: LoginState = {
    state: { token: '' },
    loading: false,
    error: false,
    errorMessage: ''
}

const currentLoginSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<LoggedUser>) => ({...state, token: action.payload.token})
    }
})

export default currentLoginSlice;

