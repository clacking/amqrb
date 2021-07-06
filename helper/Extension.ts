import { readdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const DEVTOOLS_PATH = join(homedir(), `AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi`);

// Dev tools path
export async function getDevtoolsPath () {
    const dirs = await readdir(DEVTOOLS_PATH);
    if (dirs[0]) {
        return join(DEVTOOLS_PATH, dirs[0]);
    } else {
        return null;
    }
}
