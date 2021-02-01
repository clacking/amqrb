import { app } from 'electron';
import { join } from 'path';

const APP_NAME = 'anlstt';
export const DISCORD_CLIENTID = 774333319520452698;
export const SETTING_PATH = join(app.getPath('appData'), APP_NAME);
export const VIDEO_CACHE = join(SETTING_PATH, 'vcache');
export const STORE_PATH = join(SETTING_PATH, 'store');
