import { join } from 'path';
import path from 'path';
import os from 'os';
import { app, BrowserWindow, ipcMain, shell, Menu, protocol } from 'electron';
import serve from 'electron-serve';
import { devServer } from './helper/devServer';
import { fetchAniListUserToken, fetchAniListAccsessToken, fetchUserByAccsess } from './helper/fetchAnilistUser';
import { bootstrapAMQGame } from './helper/AMQCore';
import { SETTING_PATH, VIDEO_CACHE, userConfig, loadConfig } from './helper/AppSettings';
import { getDatabase } from './helper/Database';
import { getDevtoolsPath } from './helper/Extension';
import { initializeDiscord } from './helper/Discord';

const DEV_SERVER = process.env.APP_ENV !== 'production';
const appServe = serve({directory: 'build'});

let mainWindow: BrowserWindow;

ipcMain.handle('minimize', () => {
    mainWindow.minimize();
});

ipcMain.handle('quit', () => {
    app.exit();
});

ipcMain.handle('pageLoaded', async e => {
    return await new Promise(resolve => {
        const saved = userConfig.get('savedList');
        resolve(saved);
    });
});

ipcMain.handle('addBackup', async (e, arg) => {
    if (!arg[0]) throw new Error('Invaled args');

    const backups = userConfig.get('backups');
    userConfig.set('backups', [...backups, arg[0]]);

    return;
});

ipcMain.on('openLink', (e, arg) => {
    shell.openExternal('');
})

ipcMain.on('startLogin', () => {
    shell.openExternal('https://anilist.co/api/v2/oauth/authorize?client_id=4043&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code');
});

// Initial config
ipcMain.on('windowLoaded', async (e, token: [string]) => {
    if (token[0] && userConfig.get('anilist_refresh_token')) return;
    const {accsess_token, refresh_token} = (token[0]) ?
        await fetchAniListUserToken(token[0]) : await fetchAniListAccsessToken(userConfig.get('anilist_refresh_token') as string);
    const { id } = await fetchUserByAccsess(accsess_token);
    userConfig.set('anilist_refresh_token', refresh_token);
    e.reply('reciveConfig', [accsess_token, id]);
});

async function main() {
    await app.whenReady();
    mainWindow = new BrowserWindow({
        width: 1060, height: 680, minHeight: 600, minWidth: 1060,frame: false, titleBarStyle: 'hidden',
        icon: __dirname + '/public/icon.png',
        webPreferences: { contextIsolation: true, enableRemoteModule: false, preload: join(__dirname, 'preload.js') }
    });

    // Media serve
    protocol.registerFileProtocol('amq', (r, c) => {
        const file = r.url.substr(6);
        c({ path: path.join(VIDEO_CACHE, file) });
    });

    // Load config
    await loadConfig();

    let webview_page: string;
    if (DEV_SERVER) {
        const devtool = await getDevtoolsPath();
        if (devtool) {
            await mainWindow.webContents.session.loadExtension(devtool);
        }
        mainWindow.webContents.once('did-frame-finish-load', () => {
            mainWindow.webContents.openDevTools();
        });
        webview_page = await devServer();
    } else {
        await appServe(mainWindow);
        webview_page = 'app://-';
    }

    const db = await getDatabase();
    await initializeDiscord();
    bootstrapAMQGame();
    await mainWindow.loadURL(webview_page);

}

main();
