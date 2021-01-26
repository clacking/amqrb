import { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import { getAvatar } from '../helper/AvatarImage';
import { LeaveGame, StartGame, GetAllSongName, lobby, quiz } from '../helper/AMQEvents';
import { AMQChat } from '../interface/AMQChat.interface';
import { AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';

const PlayerBox = ({p}: {p: AMQRoomPlayer}) => {
    const img = getAvatar(p.avatar);
    return (
        <div className="flex h-16 w-full bg-gray-700">
            <div className={p.ready ? 'shadow-xl' : ''}>
                <img className="w-16 h-16 object-top mx-auto object-cover" src={img} />
            </div>
            <div>
                <div className="justify-center text-xl">
                    <span className="">{p.level}</span>
                    <span className="">{p.name}</span>
                </div>
            </div>
        </div>
    )
}

const AMQQuiz = ({chat, player}: {chat: AMQChat[], player: AMQRoomPlayer[]}) => {
    const { changeView } = useContext(GameViewContext);

    const backLobby = () => {
        changeView('default');
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
    }

    const start = () => {
        changeView('quiz');
        window.electron.send('amqEmit', { command: StartGame, type: lobby });
        window.electron.send('amqEmit', { command: GetAllSongName, type: quiz });
    }

    const setting = () => {}

    return (
        <div className="relative w-full h-full">
            <header className="flex w-full p-2 flex justify-between">
                <button onClick={backLobby} className="bg-gray-700 px-4 py-2 rounded">Back</button>
                <button onClick={start} className="bg-green-800 px-4 py-2 rounded">Start</button>
                <button onClick={setting} className="bg-gray-700 px-4 py-2 rounded">Setting</button>
            </header>
            <section className="flex flex-row flex-wrap w-full h-full p-4">
                <div className="w-full flex flex-row flex-wrap">
                    {player.map(p => <PlayerBox p={p} key={p.gamePlayerId} />)}
                </div>
                <div className="px-8 h-1/2 xl:h-full w-full xl:w-1/3">
                    {chat.map(c => (
                        <p>{c.sender}: {c.message}</p>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default AMQQuiz;
