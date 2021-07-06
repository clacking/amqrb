import Electron, { IpcRenderer, IpcRendererEvent } from 'electron';
import { AMQEventsCommand, QuizNextVideoInfo } from './helper/AMQEvents';
import { UserStatus } from './store/userStatusSlice';
import {
    AMQEventsCommand, AMQEventCommands, LoginComplete, PlayerCount, GetAllSongName,
    GuessPhaseOver,
} from './helper/AMQEvents';
import { AllSong, NextVideoInfo } from './interface/AMQQuiz.interface';
import { AMQChatMessages } from './interface/AMQRoom.interface';

declare global {
    interface Window {
        electron: {
            invoke (channel: string, ...args: any[]): Promise<any>;
            invoke (channel: string, ...args: any[]): Promise<any>;
            send (channel: string, ...args: any[]): void;
            on <E extends keyof AMQGameReciveEvents>(channel: E, callback: AMQGameReciveEvents[E]);
            on <E extends keyof AMQGameReciveEvents>(channel: E, ...args: Parameters<AMQGameReciveEvents[E]>);
            on (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void);
            once <E extends keyof AMQGameReciveEvents>(channel: E, callback: AMQGameReciveEvents[E]);
            once (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void);
            removeListener (channel: string, listener: (...listener: any[])=>void);
            removeAllListeners (channel: string);
        }
    }
}

interface AMQGameSendEvents {
    'amqEmit': (data: any) => void;
}

interface ElectronInvokeEvents {
    'updateConfig': () => Promise<void>;
    'loadConfig': () => Promise<void>;
}

interface AMQGameReciveEvents {
    [LoginComplete]: (e: IpcRendererEvent, data: UserStatus) => void;
    [PlayerCount]: (e: IpcRendererEvent, data: {count: number}) => void;
    [GetAllSongName]: (e: IpcRendererEvent, data: AllSong) => void;
    [PlayerReadyChange]: (e: IpcRendererEvent, data: {gamePlayerId: number, ready: boolean}) => void;
    [GameChatUpdate]: (e: IpcRendererEvent, data: AMQChatMessages) => void;
    [GuessPhaseOver]: (e: IpcRendererEvent) => void;
    [QuizNextVideoInfo]: (e: IpcRendererEvent, data: NextVideoInfo) => void;
}
