import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { VIDEO_CACHE } from './AppSettings';

const musicLink = (id: number | string) => `https://animemusicquiz.com/moeVideo.webm?id=${id}`;

/**
 * Fetch music link
 * @param id music id
 * @param jar session cookie
 */
export async function fetchSong (id: number | string, jar: string): Promise<string> {
    try {
        const res = await fetch(musicLink(id), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
                'cookie': jar
            }
        });
        const file = await res.buffer();
        const storePath = join(VIDEO_CACHE, `${id}.webm`);
        await writeFile(storePath, file);

        return storePath;
    } catch (e) {
        console.error(e);
        throw new Error('Failed to fetch music link.');
    }
}
