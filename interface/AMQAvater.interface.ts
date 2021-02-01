
export type AMQAvater = {
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
        editor: null,
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
}

// send UseAvatar
export interface IAMQSetUseAvatar {
    avatar: {
        avatarId: number;
        colorId: number;
        optionActive: boolean;
    };
    background: {
        avatarId: number;
        colorId: number;
    };
}

// UseAvatar
export interface IAMQUseAvatar {
    currentAvatar: AMQAvater;
    succ: boolean;
}

// send UnlockAvatar
export interface IAMQSetUnlockAvatar {
    avatarId: number;
    colorId: number;
}

// UnlockAvatar
export interface IAMQUnlockAvatar {
    creditsLeft: number;
    rhythmLeft: number;
    succ: boolean;
    unlockedAvatars: {
        avatarId: number;
        characterId: number;
        colorId: number;
    }[];
}
