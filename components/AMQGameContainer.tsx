import { useState, useEffect, useContext, createContext } from 'react';
import { GameViewContext } from './AMQGame';
import { RoomSetting } from '../interface/AMQRoomSetting.interface';
import { AMQChatMesasge, AMQChatMessages, AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
import { GameChatUpdate, HostGame, SpectatorChangeToPlayer,
    PlayerChangedToSpectator, JoinGame, NewPlayer, PlayerLeft, PlayerReadyChange,
} from '../helper/AMQEvents';
import AMQQuizLobby from './AMQQuizLobby';
import AMQQuiz from './AMQQuiz';

type GameContextStates = {
    setting: RoomSetting;
    chat: AMQChatMesasge[];
    not: number;
    gameId: number;
    spectator: AMQSpectator[];
    player: AMQRoomPlayer[];
    teamMap: any;
}

export const GameContext = createContext<GameContextStates>({} as GameContextStates);

/**
 * Container for chat and setting
 */
const AMQGameContainer = () => {
    const { view, changeView } = useContext(GameViewContext);
    const [chat, setChat] = useState<AMQChatMesasge[]>([]);

    const [hostname, setHostname] = useState('');
    const [setting, setSetting] = useState<RoomSetting>();
    const [gameId, setGameId] = useState(0);
    const [not, setNOT] = useState(0); // numberOfTeams
    const [spectator, setSpect] = useState<AMQSpectator[]>([]);
    const [player, setPlayer] = useState<AMQRoomPlayer[]>([]);
    const [teamMap, setTeamMap] = useState<any>();

    useEffect(() => {
        const setup = (e: any, d: any) => {
            const { gameId, settings, spectators, players, numberOfTeams, teamFullMap } = d;
            setGameId(gameId);
            setSetting(settings);
            setSpect(spectators);
            setPlayer(players);
            setNOT(numberOfTeams);
            setTeamMap(teamFullMap);
        }

        window.electron.on(HostGame, setup);
        window.electron.on(JoinGame, setup);

        return () => {
            window.electron.removeAllListeners(HostGame);
            window.electron.removeAllListeners(JoinGame);
        }
    }, []);

    // Player, Spectator
    useEffect(() => {
        const changeToSpect = (e: any, d: any) => {}
        const changeToPlayer = (e: any, d: any) => {}
        window.electron.on(SpectatorChangeToPlayer, changeToPlayer);
        window.electron.on(PlayerChangedToSpectator, changeToSpect);

        const newPlayer = (e: any, d: any) => {
            setPlayer([...player, d]);
        }
        const leftPlayer = (e: any, d: any) => {
            setPlayer(player.filter(p => p.name!==d.player.name));
        }
        window.electron.on(NewPlayer, newPlayer);
        window.electron.on(PlayerLeft, leftPlayer);

        const changeReady = (e: any, d: any) => {
            setPlayer(player.map(p => {
                return p.gamePlayerId===d.gamePlayerId ? {...p, ready: d.ready} : p
            }));
        }
        window.electron.on(PlayerReadyChange, changeReady);

        return () => {
            window.electron.removeAllListeners(SpectatorChangeToPlayer);
            window.electron.removeAllListeners(PlayerChangedToSpectator);
            window.electron.removeAllListeners(NewPlayer);
            window.electron.removeAllListeners(PlayerLeft);
            window.electron.removeAllListeners(PlayerReadyChange);
        }
    }, [spectator, player]);

    // Chat
    useEffect(() => {
        const msg = (e: any, d: AMQChatMessages) => {
            // put date
            setChat([...chat, ...d.messages.map(m => ({...m, date: new Date()}))]);
        }
        window.electron.on(GameChatUpdate, msg);

        return () => {
            window.electron.removeAllListeners(GameChatUpdate);
        }
    }, [chat]);

    if (!setting) return <span>...</span>

    return (
        <GameContext.Provider value={{
            setting, chat, not, gameId, spectator, player, teamMap
        }}>
            <>
            {
                (view === 'lobby') ?
                    <AMQQuizLobby /> :
                (view === 'quiz') ?
                    <AMQQuiz chat={chat} /> :
                <div>none</div>
            }
            </>
        </GameContext.Provider>
    )
}

export default AMQGameContainer;
