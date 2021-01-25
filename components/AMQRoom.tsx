import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { RoomSetting, PublicRoomSettings, RoomChangeType } from '../interface/AMQRoomSetting.interface';
import { AMQAvater } from '../interface/AMQAvater.interface';
import { AMQChat } from '../interface/AMQChat.interface';
import { GameViewContext } from './AMQGame';
import { AMQEventType, NewRoom, RoomChange, RemoveRoombrowserListeners } from '../helper/AMQEvents';
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
            <div className="w-full flex">
                <span className="w-1/2">{settings.privateRoom ? '🔒' : '🚪'} Join</span>
                <span className="w-1/2">Spect</span>
            </div>
        </div>
    )
}

const AMQRoom = () => {
    const [rooms, setRooms] = useState<PublicRoomSettings[]>([]);
    const { changeView } = useContext(GameViewContext);
    // Filter states
    const [publicRoom, setPublicRoom] = useState(false);
    const [waitRoom, setWaitRoom] = useState(false);
    const [kw, setKw] = useState('');

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

        window.electron.once(NewRoom, room);
        // window.electron.once(RoomChange, addNewRoom);
    });

    const backLobby = () => {
        window.electron.send('amqEmit', { command: RemoveRoombrowserListeners, type: roombrowser });
        changeView('default');
    }

    const publicRooms = rooms.filter(d => !d.settings.privateRoom ).length;
    const filteredRooms = rooms.filter(d => {
        const lkw = kw.toLowerCase();
        return ( kw ? (d.settings.roomName.toLowerCase().includes(lkw) || d.host.toLowerCase().includes(lkw)) : true ) &&
            ( publicRoom ? !d.settings.privateRoom : true );
    });

    return (
        <div className="relative w-full h-full overflow-auto">
            <header className="fixed">
                <button className="p-2 m-2 border cursor-pointer" onClick={backLobby}>back</button>
                <span className="mx-2">
                    {rooms.length} rooms ({publicRooms} public, {rooms.length-publicRooms} private)
                </span>
                <span className="mx-2">
                    Filter:
                    <span className="mx-1">
                        Public <input checked={publicRoom} onChange={e => setPublicRoom(e.target.checked)} type="checkbox" />
                    </span>
                    <span className="mx-1">
                        Waiting <input type="checkbox" />
                    </span>
                    <span>
                        <input placeholder="Word filter" className="bg-gray-600 p-1 m-1" type="text"
                            value={kw} onChange={e => setKw(e.target.value)}
                        /> ({filteredRooms.length})
                    </span>
                </span>
            </header>
            <section className="flex flex-row flex-wrap pt-16 p-4 w-full h-full">
                {(rooms.length === 0) ?
                    <p>No rooms.</p>
                    :
                    filteredRooms.map((r, i) => <RoomBox key={i} {...r} />)
                }
            </section>
        </div>
    )
}

export default AMQRoom;
