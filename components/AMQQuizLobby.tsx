import { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import { getAvatar } from '../helper/AvatarImage';
import { AMQEventsCommand, AMQEventType } from '../helper/AMQEvents';
import { AMQChat } from '../interface/AMQChat.interface';
import { AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
const { LeaveGame, StartGame, GetAllSongName } = AMQEventsCommand;
const { lobby, quiz } = AMQEventType;

const PlayerBox = ({p}: {p: AMQRoomPlayer}) => {
    const img = getAvatar(p.avatar);
    return (
        <div className="flex h-24 w-1/2 bg-gray-700">
            <div className={p.ready ? 'shadow-xl' : ''}>
                <img className="w-24 h-24 object-top rounded-full mx-auto object-cover" src={img} />
            </div>
            <div>
                <div className="h-1/3">{p.level}</div>
                <div className="h-1/3">{p.name}</div>
                <div className="h-1/3"></div>
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
            <header className="flex bg-gray-700 w-full p-2 flex justify-between">
                <button onClick={backLobby}>back</button>
                <button onClick={start} className="bg-green-800 px-2 rounded">Start</button>
                <button onClick={setting}>setting</button>
            </header>
            <section className="flex flex-row flex-wrap w-full h-full p-4">
                <div className="w-full xl:w-2/3 flex flex-wrap">
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
