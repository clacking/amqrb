/**
 * Game socket.io client.
 */
import { EventEmitter } from 'events';
import io = require('socket.io-client');
import { Logger } from './Logger';

const AMQ_WSENDPOINT = 'wss://socket.animemusicquiz.com';
export class AMQEventEmitter extends EventEmitter {}

let sio: SocketIOClient.Socket | null = null;
let commands: Map<string, Function> = new Map();

export const getGameSocket = (): SocketIOClient.Socket => {
    if (!sio) throw new Error('Game socket is not initialized.');
    return sio;
};

/**
 * event bus
 */
export const coreEmitter = new AMQEventEmitter();

export const emitEvent = (event: string, data: any) => {
    coreEmitter.emit('core', {event, data});
}

export const initilizeGameSocket = (port: string|number, token: string): SocketIOClient.Socket => {
    sio = io(`${AMQ_WSENDPOINT}:${port}`, {
        query: { token },
        reconnection: true,
        upgrade: true,
        transports: ['websocket'],
        transportOptions: { polling: { extraHeaders: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        }}},
    });

    sio.on('connect', () => {
        emitEvent('connect', {});
        Logger.info('Connected to game server.');
    });
    sio.on('disconnect', (d: any) => {
        emitEvent('disconnect', {});
        Logger.warn('Disconnected from the server. %o', d);
    });
    sio.on('reconnect', (d: any) => {
        emitEvent('reconnect', {});
        Logger.warn('Reconnected. %o', d);
    });

    sio.on('command', (d: any) => {
        const { command, data } = d;
        const logString = JSON.stringify(data) || '';
        Logger.info('command recived: %o %o', command, logString.length<200 ? logString : logString.slice(0,200));
        const handler = commands.get(command);
        if (handler) handler(data);
        else Logger.warn('Command handler is not registerd. %o', command);
    });

    return sio;
}

export const addCommandHandler = (event: string) => {
    if (commands.get(event)) Logger.info('Command %s already existed. Overriding.', event);
    commands.set(event, (data: any) => emitEvent(event, data));
}

export const addCustomCommandHandler = (event: string, cb: Function) => {
    if (commands.get(event)) Logger.info('Command %s already existed. Overriding.', event);
    commands.set(event, cb);
}

export const removeCommandHandler = (event: string) => {
    commands.delete(event);
}
