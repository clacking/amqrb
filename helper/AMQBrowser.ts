import { EventEmitter } from 'events';
import { AMQEventsCommand, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

export function browseRooms () {
    const { NewRoom, RoomChange, RemoveRoombrowserListeners } = AMQEventsCommand;
    const { roombrowser } = AMQEventType;

    const io = getGameSocket();

    addCommandHandler(NewRoom, (d: any) => {
        emitEvent(NewRoom, d);
    });
    addCommandHandler(RoomChange, (d: any) => {
        emitEvent(RoomChange, d);
    });

    coreEmitter.on(RemoveRoombrowserListeners, () => {
        io.emit('command', { type: roombrowser, command: RemoveRoombrowserListeners });
    });
}
