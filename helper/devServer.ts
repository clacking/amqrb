import { createServer } from 'vite';

const DEV_PORT = 3000;

export async function devServer () {
    const devServer = await createServer({
        configFile: 'vite.config.ts',
        server: { port: DEV_PORT },
        root: './src'
    });
    await devServer.listen();
    return `http://localhost:${DEV_PORT}`;
}
