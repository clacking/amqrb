import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserStatus {
    xpInfo: {
        xpPercent: number,
        xpForLevel: number,
        xpIntoLevel: number,
        lastGain: number,
    },
    level: number,
    self: string, // name
    malName: string,
    malLastUpdate: string,
    aniList: string,
    aniListLastUpdate: string,
    kitsu: string,
    kitsuLastUpdate: string,
    credits: number,
    tickets: number,
    rhythm: number,
    avatar: {
        avatar: {
            avatarId: number,
            colorId: number,
            characterId: number,
            active: number,
            avatarName: string,
            outfitName: string,
            colorName: string,
            backgroundFileName: string,
            colorActive: number,
            editor: any,
            sizeModifier: number,
            optionName: string,
            optionActive: true
        },
        background: {
            avatarName: string,
            outfitName: string,
            backgroundHori: string,
            backgroundVert: string,
            colorId: number,
            avatarId: number
        }
    },
    settings: {
        shareMal: number,
        shareScore: number,
        autoSubmit: number,
        voteSkipGuess: number,
        voteSkipReplay: number,
        disableEmojis: number,
        useRomajiNames: number,
        useWatched: number,
        useCompleted: number,
        useOnHold: number,
        useDropped: number,
        usePlanning: number,
        autoSwitchFavoritedAvatars: number,
        showTeamAnswersState:number
    }
}

export type UserStatusState = {
    state: UserStatus;
    loading: boolean;
    error: boolean;
}

export const initialState: UserStatusState = {
    state: {} as UserStatus,
    loading: true,
    error: false,
}

const currentUserStatusSlice = createSlice({
    name: 'userStatus',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<UserStatus>) => {
            return ({...state, loading: false, state: action.payload });
        },
    }
});

export default currentUserStatusSlice;
