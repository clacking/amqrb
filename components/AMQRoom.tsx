import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { RoomSetting, PublicRoomSettings, RoomChangeType } from '../interface/AMQRoomSetting.interface';
import { AMQAvater } from '../interface/AMQAvater.interface';
import { AMQChat } from '../interface/AMQChat.interface';
import { Tooltip } from "@chakra-ui/react"
import { GameViewContext } from './AMQGame';
import { roombrowser, NewRoom, RoomChange, RemoveRoombrowserListeners } from '../helper/AMQEvents';
import { getAvatar } from '../helper/AvatarImage';

const RoomBox = (roomSettings: PublicRoomSettings) => {
    const {
        id, host, hostAvatar, players, numberOfPlayers,
        numberOfSpectators, settings, inLobby,
    } = roomSettings;
    const join = (type: 'spect' | 'join') => {
        if (settings.privateRoom) {
            //
        }
    }

    return (
        <div className="bg-gray-800 border-gray-700 border-opacity-80 bg-opacity-80 rounded border p-2 m-2 w-40 h-60 text-center flex flex-col">
            <div className="flex justify-between">
                <span>{id}</span>
                <span className="select-none">{settings.privateRoom ? '🔒' : '🚪'}</span>
            </div>
            <Tooltip label={ settings.roomName || 'no name' }>
                <h3 className="truncate">{ settings.roomName || 'no name' }</h3>
            </Tooltip>
            <div className="h-32 mx-auto">
                <img className="h-32" loading="lazy" src={getAvatar(hostAvatar)} />
            </div>
            <p className="truncate">{host}</p>
            <div className="w-full flex">
                <button className="w-1/2 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-900 select-none disabled:opacity-40"
                    onClick={_ => join('join')} disabled={inLobby}>Join</button>
                <button className="w-1/2 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-900 select-none"
                    onClick={_ => join('spect')}>Spect</button>
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
                    break;
                }
                case 'players': {
                    break;
                }
                case 'spectators': {
                    break;
                }
                case 'songsLeft': {
                    break;
                }
                case 'game start': {
                    break;
                }
                case 'game over': {
                    break;
                }
                case 'Room Closed': {
                    setRooms(rooms.filter(r => r.id !== d.roomId));
                    break;
                }
                default: {
                    break;
                } // Host room closed
            }
        }

        window.electron.on(NewRoom, room);
        window.electron.on(RoomChange, addNewRoom);

        return () => {
            window.electron.removeAllListeners(NewRoom);
            window.electron.removeAllListeners(RoomChange);
        }
    }, [rooms]);

    const backLobby = () => {
        window.electron.send('amqEmit', { command: RemoveRoombrowserListeners, type: roombrowser });
        changeView('default');
    }

    const publicRooms = rooms.filter(d => !d.settings.privateRoom ).length;
    const filteredRooms = rooms.filter(d => {
        const lkw = kw.toLowerCase();
        return (
            ( kw ? (d.settings.roomName.toLowerCase().includes(lkw) || d.host.toLowerCase().includes(lkw)) : true ) &&
            ( waitRoom ? d.inLobby : true ) &&
            ( publicRoom ? !d.settings.privateRoom : true )
            );
    });

    return (
        <div className="relative w-full h-full overflow-auto mb-2">
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
                        Waiting <input checked={waitRoom} onChange={e => setWaitRoom(e.target.checked)} type="checkbox" />
                    </span>
                    <span>
                        <input placeholder="Word filter" className="bg-gray-600 p-1 m-1" type="text"
                            value={kw} onChange={e => setKw(e.target.value)}
                        /> ({filteredRooms.length})
                    </span>
                </span>
            </header>
            <section className="flex flex-row flex-wrap justify-center pt-16 p-4 w-full h-full">
                {(filteredRooms.length === 0) ?
                    <p>No rooms.</p>
                    :
                    filteredRooms.map((r, i) => <RoomBox key={i} {...r} />)
                }
            </section>
        </div>
    )
}

export default AMQRoom;
