import { EventEmitter } from 'events';
import { GameChatUpdate, SendGameChatMessage, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

export function initializeChat () {
    const { lobby } = AMQEventType;
    const io = getGameSocket();

    addCommandHandler(GameChatUpdate);

    coreEmitter.on(SendGameChatMessage, (d: any) => {
        io.emit('command',
            { command: SendGameChatMessage, data: { msg: '', teamMessage: false }, type: lobby
        });
    });

}
