import { readdir } from 'fs/promises';
import { join } from 'path';
import { homedir, platform } from 'os';

const DEVTOOLS_PATH_WIN = join(homedir(), `AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi`);
const DEVTOOLS_PATH_MAC = join(homedir(), `Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi`);

// Dev tools path
export async function getDevtoolsPath () {
    const osDir = (platform() === 'win32') ? DEVTOOLS_PATH_WIN : DEVTOOLS_PATH_MAC; // WIN OR MAC
    const dirs = await readdir(osDir);
    if (dirs[0]) {
        return join(osDir, dirs[0]);
    } else {
        return null;
    }
}
