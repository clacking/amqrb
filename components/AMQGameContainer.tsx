import { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import { RoomSetting } from '../interface/AMQRoomSetting.interface';
import { AMQChatMesasge, AMQChatMessages, AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
import { GameChatUpdate, HostGame, SpectatorChangeToPlayer,
    PlayerChangedToSpectator, JoinGame, NewPlayer, PlayerLeft, PlayerReadyChange,
} from '../helper/AMQEvents';
import AMQQuizLobby from './AMQQuizLobby';
import AMQQuiz from './AMQQuiz';

/**
 * Container for chat and setting
 */
const AMQGameContainer = () => {
    const { view, changeView } = useContext(GameViewContext);
    const [chat, setChat] = useState<AMQChatMesasge[]>([]);

    const [setting, setSetting] = useState<RoomSetting>();
    const [gameID, setGameID] = useState<number>(0);
    const [not, setNOT] = useState<number>(0); // numberOfTeams
    const [spect, setSpect] = useState<AMQSpectator[]>([]);
    const [player, setPlayer] = useState<AMQRoomPlayer[]>([]);
    const [teamMap, setTeamMap] = useState<any>();

    useEffect(() => {
        const setup = (e: any, arg: any) => {
            const { gameId, settings, spectators, players, numberOfTeams, teamFullMap } = arg;
            setGameID(gameId);
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

    useEffect(() => {
        const changeToSpect = (e: any, arg: any) => {}
        const changeToPlayer = (e: any, arg: any) => {}
        window.electron.on(SpectatorChangeToPlayer, changeToPlayer);
        window.electron.on(PlayerChangedToSpectator, changeToSpect);

        const newPlayer = (e: any, arg: any) => {
            setPlayer([...player, arg]);
        }
        const leftPlayer = (e: any, arg: any) => {
            setPlayer(player.filter(p => p.name!==arg.player.name));
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
    }, [spect, player]);

    useEffect(() => {
        const msg = (e: any, d: AMQChatMessages) => {
            setChat([...chat, ...d.messages]);
        }

        window.electron.on(GameChatUpdate, msg);

        return () => {
            window.electron.removeAllListeners(GameChatUpdate);
        }
    }, [chat]);

    if (!setting) return <span>...</span>

    return (
        <>
            {
                (view === 'lobby') ?
                    <AMQQuizLobby chat={chat} player={player} /> :
                (view === 'quiz') ?
                    <AMQQuiz chat={chat} /> :
                <div>none</div>
            }
        </>
    )
}

export default AMQGameContainer;
