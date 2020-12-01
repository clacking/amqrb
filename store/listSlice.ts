import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AniListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

export interface AniListDate {
    name: string;
    id: number;
    change: AniListStatus;
}

export interface BackupStore {
    name: string;
    date: Date;
    list: AniListDate[]
}

export type CurrentListState = {
    list: AniListDate[];
    loading: boolean;
    error: boolean;
    errorMessage: string;
}

export const initialState: CurrentListState = {
    list: [],
    loading: false,
    error: false,
    errorMessage: ''
}

const currentListSlice = createSlice({
    name: 'currentList',
    initialState,
    reducers: {
        addList: (state, action: PayloadAction<AniListDate>) => {
            const d = state.list.filter(d => d.id === action.payload.id);
            if (d.length!==0) return {...state, list: state.list.map(el => el.id===action.payload.id ? action.payload : el) }
            return {...state, list: [...state.list, action.payload]}
        },
        clearList: (state) => ({...state, list: []})
    }
})

export default currentListSlice;
