/// <reference types="next" />
/// <reference types="next/types/global" />

import Electron from 'electron';

declare global {
    interface Window {
        electron: {
            invoke (channel: string, ...args: any[]): Promise<any>;
            send (channel: string, ...args: any[]): void;
            on (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void);
            removeListener (channel: string, listener: (...listener: any[])=>void);
        }
    }
}
