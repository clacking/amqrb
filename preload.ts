import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld(
    "electron", {
        invoke: async (channel: string, ...args: any[]): Promise<any> => {
            return await ipcRenderer.invoke(channel, args);
        },
        send: (channel: string, ...args: any[]): void => {
            ipcRenderer.send(channel, args);
        },
        on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
            ipcRenderer.on(channel, listener);
        },
        once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => {
            ipcRenderer.once(channel, listener);
        },
        removeListener: (channel: string, listener: (...args: any[])=>void) => {
            ipcRenderer.removeListener(channel, listener);
        }
    }
);
