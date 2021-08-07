/**
 * Custom AMQ Client state manager.
 */
import fetch from 'node-fetch';
import { ipcMain } from 'electron';
import { LoginComplete, PlayerCount, ServerRestart, PopoutMessage,
    GetRooms, HostRoom, HostSoloGame, AMQEventType } from './AMQEvents';
import { UserState } from './AMQ.interface';
import { addCommandHandler, initilizeGameSocket, emitEvent, coreEmitter, getGameSocket } from './AMQSocket';
import { Logger } from './Logger';
import { quizGame } from './AMQQuiz';

const AMQ_ENDPOINT = 'https://animemusicquiz.com';

// Shared states/vars
export let CookieJar: string | undefined;

/**
 * Fetch accsess token for Game Socket
 * 
 * @param username Username
 * @param password Password
 */
export async function AMQLoginToken (username: string, password: string): Promise<{ token: string, port: string }> {
    const res = await fetch(`${AMQ_ENDPOINT}/signIn`, {
        method: 'POST', body: JSON.stringify({ username, password }),
        headers: { 'content-type': 'application/json', 'accept': 'application/json' }
    });
    if (!res.ok) {
        const body = await res.text();
        Logger.error('Login error. %s', body);
        throw new Error('Failed to login.');
    }
    const cookie = res.headers.raw()['set-cookie'];
    
    if ( cookie.length<0 || !cookie[0].includes('connect.sid') ) throw new Error('Failed to login. Invalid response.')

    CookieJar = cookie[0].split(';')[0];
    const token = await fetch(`${AMQ_ENDPOINT}/socketToken`, {
        method: 'GET', headers: { cookie: CookieJar }
    });
    if (!token.ok) throw new Error('Failed to login.');

    return await token.json();
}

/**
 * Initial point of GAME client.
 * 
 * @param port WebSocket port
 * @param token Login token
 */
export function initializeAMQGame (port: number|string, token: string) {
    initilizeGameSocket(port, token);

    // add event hooks
    quizGame();

    coreEmitter.on(LoginComplete, () => Logger.info('Logged in to AMQ game.'));
    coreEmitter.on('userEvent', userEventHandler);
}

function userEventHandler(d: any) {
    const io = getGameSocket();

    io.emit('command', d);
}

// Initial point of EE/Sockets.
export function bootstrapAMQGame () {
    // create listner login
    ipcMain.on('amqLogin', async (e, d) => {
        const { username, password } = d[0];
        try {
            const { token, port } = await AMQLoginToken(username, password);
            console.log('LOGGED IN', port);
            initializeAMQGame(port, token);

            coreEmitter.on('ipcBridge', d => {
                e.sender.send(d.event, d.data);
            });
            e.reply('amqLoggedIn');
        } catch (err) {
            console.log(err);
            e.reply('amgLoginError', 'Failed to login.');
        }
    });

    ipcMain.on('amqEmit', async (e, d) => {
        Logger.info('User emit: %o', d);
        const data = d[0];
        coreEmitter.emit('userEvent', data);
    });
}
