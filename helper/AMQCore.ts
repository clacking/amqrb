/**
 * Custom AMQ Client state manager.
 */
import fetch from 'node-fetch';
import { AMQEventsCommand, AMQEventType } from './AMQEvents';
import { UserState } from './AMQ.interface';
import { addCommandHandler, initilizeGameSocket, emitEvent, coreEmitter, getGameSocket } from './AMQSocket';
import { Logger } from './Logger';
import { createGameRoom } from './AMQRoom';
import { browseRooms } from './AMQBrowser';
import { initializeChat } from './AMQChat';

const AMQ_ENDPOINT = 'https://animemusicquiz.com';

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

    const token = await fetch(`${AMQ_ENDPOINT}/socketToken`, {
        method: 'GET', headers: { cookie: cookie[0].split(';')[0] }
    });
    if (!token.ok) throw new Error('Failed to login.');

    return await token.json();
}


// Game states
let playerCount = 0;
let gameInfo: Partial<UserState> = {};

/**
 * Initial point of GAME client.
 * 
 * @param port WebSocket port
 * @param token Login token
 */
export function initializeAMQGame (port: number|string, token: string) {
    initilizeGameSocket(port, token);

    // Add game handlers
    const { LoginComplete, PlayerCount, ServerRestart, PopoutMessage } = AMQEventsCommand;
    addCommandHandler(LoginComplete, (d: any) => {
        gameInfo = d;
        Logger.info('Succsessfully logged in to Game.');
        emitEvent(LoginComplete, d);
    });
    addCommandHandler(PlayerCount, (d: {count: number}) => {
        playerCount = d.count;
        emitEvent(PlayerCount, playerCount);
    });
    addCommandHandler(ServerRestart, (d: {msg: string, time: number}) => {
        emitEvent(ServerRestart, d);
    });
    addCommandHandler(PopoutMessage, (d: any) => {
        emitEvent(PopoutMessage, d);
    });
    coreEmitter.on('userEvent', userEventHandler);
}

function userEventHandler(d: any) {
    const io = getGameSocket();
    const { GetRooms, HostRoom, HostSoloGame } = AMQEventsCommand;

    if (d.command === GetRooms) {
        browseRooms();
        io.emit('command', d);
    } else if (d.command === HostSoloGame || d.command === HostRoom) {
        createGameRoom(d.data);
        initializeChat();
    } else {
        io.emit('command', d);
    }
}

/*
export class AMQGame {
    client: SocketIOClient.Socket;
    commands: Map<string, Function> = new Map();
    userInfo: Partial<UserState> = {};
    playerCount: number = 0; // Game Player Count.
    roomState: AMQRoom;

    constructor (port: number|string, token: string) {
        this.client = io(`${AMQ_WSENDPOINT}:${port}`, {
            query: { token },
            reconnection: true,
            upgrade: true,
            transports: ['websocket'],
            transportOptions: { polling: { extraHeaders: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36' } } },
        });

        // Socket connections.
        this.client.on('connect', (d: any) => {
            console.log('Connected to game server.', d)
        });
        this.client.on('disconnect', (d: any) => {
            console.log('Disconnected from the server.', d);
        });
        this.client.on('reconnect', (d: any) => {
            console.log('Reconnected.', d);
        });

        // other states
        this.roomState = new AMQRoom(this.client);

        this.initializeGameHandlers();

        this.client.on('command', (d: any) => {
            this.commandHandler(d);
        });
    }

    // Inserting command handlers
    initializeGameHandlers () {
        const { LoginComplete, PlayerCount } = AMQEventsCommand;

        this.commands.set(LoginComplete, this.afterLogin.bind(this));
        this.commands.set(PlayerCount, this.updatePlayerCount.bind(this));
    }

    commandHandler (data: any) {
        const f = this.commands.get(data.command);
        if (f) f(data.data);
    }

    afterLogin(data: any) {
        this.userInfo = data;
        console.log(this.userInfo);
    }

    updatePlayerCount(data: any) {
        this.playerCount = data.count;
        console.log('Updated Player Count: ', this.playerCount);
    }
}
*/
