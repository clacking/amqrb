import { app, ipcMain } from 'electron';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import os from 'os';
import { join } from 'path';
import { parse } from 'url';
import Store from 'electron-store';
import HttpsProxyAgent from 'https-proxy-agent';

const APP_NAME = 'anlstt';
export const DISCORD_CLIENTID = 774333319520452698;
export const SETTING_PATH = join(app.getPath('appData'), APP_NAME);
export const VIDEO_CACHE = join(SETTING_PATH, 'vcache');
export const STORE_PATH = join(SETTING_PATH, 'store');

type UserConfig = {
    savedList: string[];
    backups: any[];
    anilist_refresh_token: string;
    proxy: string;
    proxy_direction: {
        socket: boolean;
        cdn: boolean;
    };
}

export const userConfig = new Store<UserConfig>({
    defaults: {
        savedList: [],
        backups: [],
        anilist_refresh_token: '',
        proxy: '',
        proxy_direction: { socket: false, cdn: false }
    }
});

export const loadConfig = async () => {
    if (!existsSync(VIDEO_CACHE)) {
        try {
            await mkdir(VIDEO_CACHE);
        } catch (e) {
            throw new Error(e);
        }
    }

    // Config handlers
    ipcMain.handle('updateConfig', async (e, arg) => {});

    ipcMain.handle('loadConfig', async e => {
        const anilist_refresh_token = userConfig.get('anilist_refresh_token');
        const proxy = userConfig.get('proxy');
        const proxy_direction = userConfig.get('proxy_direction');
        return { anilist_refresh_token, proxy, proxy_direction };
    });
}

export const getUserProxyAgent = () => {
    const proxyUrl = userConfig.get('proxy');
    if (userConfig.get('proxy')) {
        return HttpsProxyAgent(parse(proxyUrl));
    }
}
