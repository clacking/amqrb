import { AMQInGamePlayer } from './AMQRoom.interface';

/**
 * Util interfaces
 */

interface ProgressBarState {
    length: number;
    played: number;
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
export interface GameStart {
    gameMode: string;
    showSelection: number;
    groupSlotMap: {
        [key: string]: number[];
    };
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
    answers: IPlayerAnswers[];
    progressBarState: ProgressBarState | null;
}

// AnswerResults
export interface IAnswerResults {
    groupMap: {};
    players: {};
    progressBarState: ProgressBarState;
    songInfo: {};
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
export interface ReturnLobbyVoteStart {
    invokingHost: string;
    voteDuration: number;
}

// ReturnLobbyVoteResult
export interface ReturnLobbyVoteResult {
    passed: boolean;
    timeout?: number;
}

// QuizWaitingBuffering
export interface QuizWaitingBuffering {
    firstSong: boolean;
}
