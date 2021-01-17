import { EventEmitter } from 'events';
import { NewRoom, RoomChange, RemoveRoombrowserListeners, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

export function browseRooms () {
    const { roombrowser } = AMQEventType;

    const io = getGameSocket();
    const events = [NewRoom, RoomChange];
    events.forEach(s => addCommandHandler(s));

    coreEmitter.on(RemoveRoombrowserListeners, () => {
        io.emit('command', { type: roombrowser, command: RemoveRoombrowserListeners });
    });
}
