import { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import { GameContext } from './AMQGameContainer';
import { getAvatar, getBackground } from '../helper/AvatarImage';
import { LeaveGame, StartGame, GetAllSongName, lobby, quiz } from '../helper/AMQEvents';
import { AMQChatMesasge, AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';

const PlayerBox = ({p, host}: {p: AMQRoomPlayer, host: boolean}) => {
    const { avatar, ready, level, name } = p;
    const img = getAvatar(avatar);

    return (
        <div className={`flex flex-col m-1 rounded-lg h-56 w-32 bg-gray-700 bg-opacity-70 border border-gray-600 border-opacity-80 ${ready ? 'shadow-xl' : ''}`}>
            <div className="flex h-40 bg-center bg-contain bg-no-repeat" style={{ backgroundImage: `url(${getBackground(avatar, 'vert')})` }}>
                <img className="mx-auto object-contain" src={img} />
            </div>
            <div className="p-1">
                <div className="flex justify-between px-2">
                    <span className="">{level}</span>
                    { host ?
                    <span className="select-none px-1">Host</span>
                    : ''}
                    <span className="text-green-400 select-none">{ready ? '✔' : ''}</span>
                </div>
                <div className="flex justify-center h-8 text-xl">
                    <span className="flex-grow text-center">{name}</span>
                </div>
            </div>
        </div>
    )
}

const AMQQuiz = () => {
    const { changeView } = useContext(GameViewContext);
    const { chat, player, hostName } = useContext(GameContext);

    const backLobby = () => {
        changeView('default');
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
    }

    const start = () => {
        window.electron.send('amqEmit', { command: StartGame, type: lobby });
        window.electron.send('amqEmit', { command: GetAllSongName, type: quiz });
    }

    const setting = () => {}

    return (
        <div className="relative w-full h-full">
            <header className="flex w-full p-2 justify-between">
                <div>
                    <button onClick={backLobby} className="px-4 py-1 border">Back</button>
                </div>
                <button onClick={start} className="bg-green-800 px-4 py-1">Start</button>
                <button onClick={setting} className="px-4 py-1 border">Setting</button>
            </header>
            <section className="flex flex-row flex-wrap w-full h-full p-4">
                <div className="w-full flex flex-row flex-wrap">
                    {player.map(p => <PlayerBox p={p} key={p.gamePlayerId} host={p.name===hostName} />)}
                </div>
                <div className="px-8 h-1/2 xl:h-full w-full xl:w-1/3">
                    {chat.map(c => (
                        <p key={c.messageId}>[{c.date.toLocaleTimeString()}] {c.sender}: {c.message}</p>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default AMQQuiz;
