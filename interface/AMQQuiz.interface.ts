import { AMQInGamePlayer } from './AMQRoom.interface';

/**
 * Util interfaces
 */

interface ProgressBarState {
    length: number;
    played: number;
}

interface GroupMap {
    [key: number]: number[];
}

interface QuizResultPlayer {
    correct: boolean;
    gamePlayerId: number;
    level: number;
    listStatus: number;
    pose: number;
    position: number;
    positionSlot: number;
    score: number;
    showScore: number;
}

interface SongInfo {
    animeNames: {
        english: string;
        romaji: string;
    };
    annId: number;
    artist: string;
    highRisk: number;
    songName: string;
    type: number;
    typeNumber: number;
    urlMap: {
        [key: string]: {
            0?: string;
            480?: string;
            720?: string;
        };
    };
}

/**
 * Event interfaces
 */

// GetAllSongName
export interface AllSong {
    names: string[];
    version: number;
}

// GameStarting
export interface IGameStarting {
    gameMode: string;
    showSelection: number;
    groupSlotMap: GroupMap;
    players: AMQInGamePlayer[];
}

// QuizNextVideoInfo
export interface NextVideoInfo {
    playLength: number;
    playbackSpeed: number;
    startPont: number;
    videoInfo: {
        id: number;
        videoMap: {
            catbox?: {
                0?: number;
                720?: number;
                480?: number;
            }
        };
        videoVolumeMap: {
            catbox?: {
                0?: number;
                720?: number;
                480?: number;
            }
        }
    }
}

// PlayNextSong
export interface NextSong {
    onLastSong: boolean;
    progressBarState: ProgressBarState;
    songNumber: number;
    time: number;
}

// QuizAnswer
export interface IQuizAnswer {
    answer: string;
    success: boolean;
}

export interface IPlayerAnswer {
    gamePlayerId: number;
    pose: number;
    answer: string;
}

// PlayerAnswers
export interface IPlayerAnswers {
    answers: IPlayerAnswer[];
    progressBarState: ProgressBarState | null;
}

// AnswerResults
export interface IAnswerResults {
    groupMap: GroupMap;
    players: QuizResultPlayer[];
    progressBarState: ProgressBarState;
    songInfo: SongInfo;
    watched: boolean;
}

// PlayerAnswered
export type PlayerAnswered = number[];

// QuizSkipMessage
export type QuizSkipMessage = string;

// QuizOver
export interface QuizOver {
    gameId: number;
    hostName: string;
    inLobby: boolean;
    inQueue: any[];
    numberOfTeams: number;
    players: {};
    settings: {};
    soloMode: boolean;
    spectators: [];
    teamFullMap: {};
}

// ReturnLobbyVoteStart
export interface IReturnLobbyVoteStart {
    invokingHost: string;
    voteDuration: number;
}

// ReturnLobbyVoteResult
export interface IReturnLobbyVoteResult {
    passed: boolean;
    timeout?: number;
}

// QuizWaitingBuffering
export interface IQuizWaitingBuffering {
    firstSong: boolean;
}

// QuizEndResult
export interface IQuizEndResult {
    progressBarState: ProgressBarState;
    resultStates: {
        endPosition: number;
        gamePlayerId: number;
        pose: number;
    }[];
}

// QuizOverlayMessage
export type IQuizOverlayMessage = string;
