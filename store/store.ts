import { Store, combineReducers } from 'redux';
import logger from 'redux-logger';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import currentListSlice, { initialState as CurrentListState } from './listSlice';
import userStatusSlice, { initialState as CurrentUserStatusState } from './userStatusSlice';

const rootReducer = combineReducers({
    currentList: currentListSlice.reducer,
    userStatus: userStatusSlice.reducer,
});

const preloadedState = () => {
    return {
        currentList: CurrentListState,
        userStatus: CurrentUserStatusState
    }
}

export type StoreState = ReturnType<typeof preloadedState>;
export type ReduxStore = Store<StoreState>;

const createStore = () => {
    const middlewareList = [...getDefaultMiddleware(), logger];

    return configureStore({
        reducer: rootReducer,
        middleware: middlewareList,
        devTools: process.env.APP_ENV !== 'production',
        preloadedState: preloadedState()
    })
}

export default createStore;
