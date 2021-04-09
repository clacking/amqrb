import { useState, useEffect, useContext, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure } from '@chakra-ui/react';
import { GameViewContext } from './AMQGame';
import { GameContext } from './AMQGameContainer';
import { getAvatar, getBackground } from '../helper/AvatarImage';
import {
    LeaveGame, StartGame, GetAllSongName, lobby, quiz, SetReady
} from '../helper/AMQEvents';
import { AMQChatMesasge, AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
import AMQChat from './AMQChat';

const PlayerBox = ({p, host, team}: {p: AMQRoomPlayer, host: boolean, team: number}) => {
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
                    { team>1 && (
                    <span className="select-none px-1">{p.teamNumber}</span>
                    )}
                    <span className="text-green-400 select-none">
                        {host ? 'Host' : (ready ? '✔' : '')}
                    </span>
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
    const { chat, player, spectator, hostName, gameId, setting, isHost } = useContext(GameContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ready, setReady] = useState(false);

    const backLobby = () => {
        changeView('default');
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
    }

    const isStartable = player.filter(u => u.ready).length===player.length;
    const startGame = () => {
        if (isHost) {
            window.electron.send('amqEmit', { command: StartGame, type: lobby });
            window.electron.send('amqEmit', { command: GetAllSongName, type: quiz });
        } else {
            window.electron.send('amqEmit', { command: SetReady, data: { ready: true }, type: lobby });
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex w-full p-2 justify-between">
                <div>
                    <span className="font-extrabold text-lg pr-2">Lobby</span>
                    <button onClick={backLobby} className="px-4 py-1 border">Back</button>
                    <span className="mx-2">
                        <span>
                            #{gameId} {setting.roomName} ({player.length}/{setting.roomSize})
                        </span>
                        { setting.teamSize>1 &&
                        <span className="ml-2">
                            {`(TeamSize: ${setting.teamSize})`}
                        </span>
                        }
                    </span>
                </div>
                <div>
                    <button onClick={startGame} disabled={!isStartable}
                        className={`border-green-900 border px-4 py-1 mx-1 ${isStartable?'bg-green-800':'cursor-not-allowed'}`}
                    >
                        { isHost ? 'Start' : 'Ready'}
                    </button>
                    <button onClick={onOpen} className="border px-4 py-1 mx-1">Setting</button>
                    <button className="border px-4 py-1 mx-1">Spectators ({spectator.length})</button>
                </div>
            </header>
            <main className="flex flex-col xl:flex-row justify-between w-full h-full p-4">
                <div className="flex flex-grow flex-row">
                    {player.map(p =>
                        <PlayerBox p={p} key={p.gamePlayerId} host={p.name===hostName} team={setting.teamSize} />
                    )}
                </div>
                <div className="px-2 h-1/2 xl:h-full w-full xl:w-1/3">
                    <AMQChat chat={chat} />
                </div>
            </main>

            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Room setting</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {JSON.stringify(setting)}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AMQQuiz;
