import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { RoomSetting, PublicRoomSettings, RoomChangeType } from '../interface/AMQRoomSetting.interface';
import { AMQAvater } from '../interface/AMQAvater.interface';
import { AMQChat } from '../interface/AMQChat.interface';
import { GameViewContext } from './AMQGame';
import { AMQEventType, AMQEventsCommand } from '../helper/AMQEvents';
const { NewRoom, RoomChange, RemoveRoombrowserListeners } = AMQEventsCommand;
const { roombrowser } = AMQEventType;



const RoomBox = ({ id, host, hostAvatar, players, numberOfPlayers, numberOfSpectators, settings }: PublicRoomSettings) => {
    const join = () => {
        if (settings.privateRoom) {
            //
        }
    }

    return (
        <div className="p-2 m-2 w-40 h-32 text-center">
            <h3>{ settings.roomName || 'no name' }</h3>
            <p>Host: {host}</p>
            <div>
                <span className="w-1/2">{settings.privateRoom ? '🔒' : '🚪'} Join</span>
                <span className="w-1/2">Spect</span>
            </div>
        </div>
    )
}

const AMQRoom = () => {
    const [rooms, setRooms] = useState<PublicRoomSettings[]>([]);
    const { changeView } = useContext(GameViewContext);

    useEffect(() => {
        const room = (e: any, d: PublicRoomSettings[]) => {
            console.log('change', rooms.length, d.length)
            setRooms([...rooms, ...d]);
        }

        const addNewRoom = (e: any, d: any) => {
            switch (d.changeType as RoomChangeType) {
                case 'settings': {
                    //setRooms(rooms.map(r => r.id===d.roomId ? {...r, ...r} : r ) );
                }
                case 'players': {}
                case 'spectators': {}
                case 'songsLeft': {}
                case 'game start': {}
                case 'game over': {}
                default: {} // Host room closed
            }
        }

        window.electron.on(NewRoom, room);
        // window.electron.on(RoomChange, addNewRoom);
        return () => {
            window.electron.removeListener(NewRoom, room);
            // window.electron.removeListener(RoomChange, addNewRoom);
        }
    });

    const backLobby = () => {
        window.electron.send('amqEmit', { command: RemoveRoombrowserListeners, type: roombrowser });
        changeView('default');
    }

    return (
        <div className="relative w-full h-full overflow-auto">
            <header className="fixed p-2 m-2 border cursor-pointer" onClick={backLobby}>back</header>
            <section className="flex flex-row flex-wrap pt-16 p-4 w-full h-full">
                {(rooms.length === 0) ?
                    <p>No rooms.</p>
                    :
                    rooms.map((r, i) => <RoomBox key={i} {...r} />)
                }
            </section>
        </div>
    )
}

export default AMQRoom;
