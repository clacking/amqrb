import { app } from 'electron';
import { join } from 'path';

const APP_NAME = 'anlstt';
export const SETTING_PATH = join(app.getPath('appData'), APP_NAME);
export const VIDEO_CACHE = join(SETTING_PATH, 'cache');
export const STORE_PATH = join(SETTING_PATH, 'store');
