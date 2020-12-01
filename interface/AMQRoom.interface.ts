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
