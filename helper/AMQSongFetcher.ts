import fetch from 'node-fetch';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { createHash } from 'crypto';
import { VIDEO_CACHE } from './AppSettings';
import { Logger } from './Logger';

const musicLink = (id: number | string) => `https://animemusicquiz.com/moeVideo.webm?id=${id}`;

/**
 * Fetch music link
 * @param id music id
 * @param jar session cookie
 * 
 * @return filename
 */
export async function fetchSong (id: number | string, jar: string): Promise<string> {
    try {
        const res = await fetch(musicLink(id), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
                'cookie': jar
            }
        });
        const originalUrl = res.url;
        const fileExt = extname(originalUrl);
        const file = await res.buffer();
        const urlHash = createHash('sha1').update(originalUrl).digest('hex');
        const filename = `${urlHash}${fileExt}`;

        const storePath = join(VIDEO_CACHE, filename);
        await writeFile(storePath, file);
        Logger.info(`Video loaded: %o`, { id, originalUrl, filename });
        return filename;
    } catch (e) {
        Logger.error(e);
        throw new Error('Failed to fetch music link.');
    }
}
