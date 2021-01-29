import { RoomSetting } from './AMQRoomSetting.interface'
import { AMQAvater } from './AMQAvater.interface';

export type AMQRoomPlayer = {
    name: string;
    gamePlayerId: number;
    level: number;
    avatar: AMQAvater;
    ready: boolean;
    inGame: boolean;
    teamNumber: any;
}

export type AMQRoom = {
    spectators: any[];
    inLobby: boolean;
    settings: RoomSetting;
    inQueue: any[];
    hostName: string;
    players: AMQRoomPlayer[];
    numberOfTeams: number;
    teamFullMap: any;
}

// HostGame JoinGame
export type AMQRoomSetup = {
    gameId: number;
    hostName: string;
    inLobby: boolean;
    inQueue: any[];
    numberOfTeams: number;
    players: AMQRoomPlayer;
    settings: RoomSetting;
    soloMode: boolean;
    spectators: any[];
    teamFullMap: any;
}

export type AMQSpectator = {
    spectatorDescription: {
        name: string;
        gamePlayerId: number | null;
    },
    playerDescription: {
        name: string;
        gamePlayerId: number | null;
    },
    isHost: boolean;
}

export type AMQInGamePlayer = {
    gamePlayerId: number;
    pose: number;
    name: string;
    avatarInfo:  AMQAvater;
    inGame: boolean;
    score: number;
    level: number;
    host: boolean;
    position: number;
    positionSlot: number;
    teamCaptain: any;
    teamPlayer: any;
    teamNumber: number;
}

/*
 * GameChatUpdate
 */
export type AMQChatEmoji = {
    emotes: number[];
    customEmojis: any[];
}

export type AMQChatMesasge = {
    sender: string;
    message: string;
    teamMessage: boolean;
    messageId: number;
    emojis: AMQChatEmoji[];
    badges: {
        name: string;
        fileName: string;
    }[];
    atEveryone: boolean;
    date: Date;
}

// simple event log on chat
export type AMQChatEventLog = {
    sender: string;
    message: string;
}

export type AMQChatMessages = {
    bubles: {
        emoteIds: any[],
        shortCodes: string[]
    }[];
    messages: AMQChatMesasge[];
}

// PlayerLeft
export type AMQPlayerLeft = {
    newHost?: string;
    player: {
        name: string;
        gamePlayerId: number;
    }
}
