import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const DEV_SERVER = process.env.NODE_ENV !== 'production';
const NEXT_PORT = 3000;
const app = next({ dev: DEV_SERVER });
const handle = app.getRequestHandler();

export async function nextServer () {
    await app.prepare().then(() => {
        createServer((req, res) => {
            if (!req.url) throw new Error('Invaled request.');
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        }).listen(NEXT_PORT, () => console.log('Listening next.js at 3000'));
    });
    return `http://localhost:${NEXT_PORT}`;
}
