import { useState, useEffect, useContext, createContext } from 'react';
import { useUserStatus } from '../store/selectors';
import { GameViewContext } from './AMQGame';
import { RoomSetting } from '../interface/AMQRoomSetting.interface';
import { IGameStarting } from '../interface/AMQQuiz.interface';
import { AMQChatMesasge, AMQChatMessages, AMQInGamePlayer, AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
import {
    GameChatUpdate, HostGame, SpectatorChangeToPlayer,
    PlayerChangedToSpectator, JoinGame, NewPlayer, PlayerLeft, PlayerReadyChange,
    GameStarting, JoinTeam, NewSpectator, QuizOver,
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
    quizInitial?: IGameStarting;
    teamMap: any;
    hostName: string;
    isHost: boolean;
}

export const GameContext = createContext<GameContextStates>({} as GameContextStates);

/**
 * Container for chat and setting
 */
const AMQGameContainer = () => {
    const { view, changeView } = useContext(GameViewContext);
    const [chat, setChat] = useState<AMQChatMesasge[]>([]);
    const { state } = useUserStatus();

    // Game states
    const [hostname, setHostname] = useState('');
    const [setting, setSetting] = useState<RoomSetting>();
    const [gameId, setGameId] = useState(0);
    const [not, setNOT] = useState(0); // numberOfTeams
    const [spectator, setSpect] = useState<AMQSpectator[]>([]);
    const [player, setPlayer] = useState<AMQRoomPlayer[]>([]);
    const [quizInitial, setQuizInitial] = useState<IGameStarting>();
    const [teamMap, setTeamMap] = useState<any>();

    // Room setup for join/host
    useEffect(() => {
        const setup = (e: any, d: any) => {
            const { gameId, hostName, settings, spectators, players, numberOfTeams, teamFullMap } = d;
            setHostname(hostName);
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
        const changeToSpect = (e: any, d: any) => {
            setPlayer(player.filter(p=>p.gamePlayerId!==d.playerDescription.gamePlayerId));
            setSpect([...spectator, d.spectatorDescription]);
        }
        const changeToPlayer = (e: any, d: any) => {
            setPlayer([...player, d]);
            setSpect(spectator.filter(s => s.name!==d.name));
        }
        window.electron.on(PlayerChangedToSpectator, changeToSpect);
        window.electron.on(SpectatorChangeToPlayer, changeToPlayer);

        const newPlayer = (e: any, d: any) => {
            setPlayer([...player, d]);
        }
        const leftPlayer = (e: any, d: any) => {
            if (d.newHost) setHostname(d.newHost);
            setPlayer(player.filter(p => p.name!==d.player.name));
        }
        window.electron.on(NewPlayer, newPlayer);
        window.electron.on(PlayerLeft, leftPlayer);

        const newSpect = (e: any, d: any) => {
            setSpect([...spectator, d]);
        }
        window.electron.on(NewSpectator, newSpect);

        const changeReady = (e: any, d: any) => {
            setPlayer(player.map(p => {
                return p.gamePlayerId===d.gamePlayerId ? {...p, ready: d.ready} : p;
            }));
        }
        window.electron.on(PlayerReadyChange, changeReady);

        return () => {
            window.electron.removeAllListeners(SpectatorChangeToPlayer);
            window.electron.removeAllListeners(PlayerChangedToSpectator);
            window.electron.removeAllListeners(NewPlayer);
            window.electron.removeAllListeners(PlayerLeft);
            window.electron.removeAllListeners(PlayerReadyChange);
            window.electron.removeAllListeners(NewSpectator);
        }
    }, [spectator, player, chat]);

    // Team
    useEffect(() => {
        const changeTeam = (e: any, d: any) => {
            setPlayer(player.map(p => {
                return p.gamePlayerId===d.gamePlayerId ? {...p, teamNumber: d.newTeam} : p;
            }));
        }
        window.electron.on(JoinTeam, changeTeam);

        return () => {
            window.electron.removeAllListeners(JoinTeam);
        }
    }, [player]);

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

    // GameStarting
    useEffect(() => {
        const gameStart = (e: any, d: IGameStarting) => {
            setQuizInitial(d);
            changeView!('quiz');
        }
        window.electron.on(GameStarting, gameStart);

        return () => {
            window.electron.removeAllListeners(GameStarting);
        }
    });

    // QuizOver
    useEffect(() => {
        const quizOver = (e: any, d: any) => {
            changeView!('lobby');
        }
        window.electron.on(QuizOver, quizOver);

        return () => {
            window.electron.removeAllListeners(QuizOver);
        }
    });

    if (!setting) return <span>...</span>

    const isHost = hostname===state.self;

    return (
        <GameContext.Provider value={{
            setting, chat, not, gameId, spectator, player, teamMap, quizInitial,
            hostName: hostname, isHost
        }}>
            <>
            {
                (view === 'lobby') ?
                    <AMQQuizLobby /> :
                (view === 'quiz') ?
                    <AMQQuiz /> :
                <div>none</div>
            }
            </>
        </GameContext.Provider>
    )
}

export default AMQGameContainer;
