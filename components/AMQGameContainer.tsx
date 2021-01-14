import { useState, useEffect, useContext, Fragment } from 'react';
import { GameViewContext } from './AMQGame';
import { AMQChat } from '../interface/AMQChat.interface';
import { RoomSetting } from '../interface/AMQRoomSetting.interface';
import { AMQRoomPlayer, AMQSpectator } from '../interface/AMQRoom.interface';
import { AMQEventsCommand } from '../helper/AMQEvents';
const { GameChatUpdate, HostGame, SpectatorChangeToPlayer,
    PlayerChangedToSpectator, JoinGame, NewPlayer, PlayerLeft }
= AMQEventsCommand;
import AMQQuizLobby from './AMQQuizLobby';
import AMQQuiz from './AMQQuiz';

/**
 * Container for chat and setting
 */
const AMQGameContainer = () => {
    const { view, changeView } = useContext(GameViewContext);
    const [chat, setChat] = useState<AMQChat[]>([]);

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
            window.electron.removeListener(HostGame, setup);
            window.electron.removeListener(JoinGame, setup);
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

        return () => {
            window.electron.removeListener(SpectatorChangeToPlayer, changeToPlayer);
            window.electron.removeListener(PlayerChangedToSpectator, changeToSpect);
            window.electron.removeListener(NewPlayer, newPlayer);
            window.electron.removeListener(PlayerLeft, leftPlayer);
        }
    }, [spect, player]);
    
    useEffect(() => {
        const msg = (e: any, args: any) => {
            setChat([...chat, args]);
        }

        window.electron.on(GameChatUpdate, msg);
        return () => {
            window.electron.removeListener(GameChatUpdate, msg);
        }
    }, [chat]);

    if (!setting) return <span>...</span>

    return (
        <Fragment>
            {
                (view === 'lobby') ?
                    <AMQQuizLobby chat={chat} player={player} /> :
                (view === 'quiz') ?
                    <AMQQuiz chat={chat} /> :
                <div>none</div>
            }
        </Fragment>
    )
}

export default AMQGameContainer;
