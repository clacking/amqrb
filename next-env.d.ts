/// <reference types="next" />
/// <reference types="next/types/global" />

import Electron from 'electron';
import { AMQEventsCommand } from './helper/AMQEvents';
import { UserStatus } from './store/userStatusSlice';

declare global {
    interface Window {
        electron: {
            invoke (channel: string, ...args: any[]): Promise<any>;
            send (channel: string, ...args: any[]): void;
            on <E extends keyof AMQGameEvents>(channel: E, ...args: Parameters<AMQGameEvents[E]>);
            on (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void);
            removeListener (channel: string, listener: (...listener: any[])=>void);
        }
    }
}

interface AMQGameEvents {
    'login complete': (e: IpcRendererEvent, data: UserStatus) => void;
}
