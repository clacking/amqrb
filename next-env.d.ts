/// <reference types="next" />
/// <reference types="next/types/global" />

import Electron from 'electron';
import { AMQEventsCommand } from './helper/AMQEvents';
import { UserStatus } from './store/userStatusSlice';
import { AMQEventsCommand, AMQEventCommands, LoginComplete } from './helper/AMQEvents';

declare global {
    interface Window {
        electron: {
            invoke (channel: string, ...args: any[]): Promise<any>;
            send (channel: string, ...args: any[]): void;
            on <E extends keyof AMQGameReciveEvents>(channel: E, callback: AMQGameReciveEvents[E]);
            on <E extends keyof AMQGameReciveEvents>(channel: E, ...args: Parameters<AMQGameReciveEvents[E]>);
            on (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void);
            removeListener (channel: string, listener: (...listener: any[])=>void);
        }
    }
}

interface AMQGameReciveEvents {
    [LoginComplete]: (e: IpcRendererEvent, data: UserStatus) => void;
}
