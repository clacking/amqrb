import { EventEmitter } from 'events';
import { AMQEventsCommand, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

export function initializeChat () {
    const { GameChatMessage, SendGameChatMessage } = AMQEventsCommand;
    const { lobby } = AMQEventType;
    const io = getGameSocket();

    addCommandHandler(GameChatMessage, (d: any) => {
        emitEvent(GameChatMessage, d);
    });

    coreEmitter.on(SendGameChatMessage, (d: any) => {
        io.emit('command',
            { command: SendGameChatMessage, data: { msg: '', teamMessage: false }, type: lobby
        });
    });

}
