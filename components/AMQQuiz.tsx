import { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import { AMQChat } from '../interface/AMQChat.interface';
import { AMQEventsCommand } from '../helper/AMQEvents';
const { GameStarting, QuizOver, RejoiningPlayer, SpectatorLeft, QuizNextVideoInfo,
        PlayNextSong, PlayerAnswers, AnswerResults, QuizEndResult, QuizWaitingBuffering,
        QuizXpCreditGain, QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
        ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange, QuizUnpauseTriggered,
        QuizPauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, GetAllSongName
} = AMQEventsCommand;
import { AMQInGamePlayer } from '../interface/AMQRoom.interface';

const AMQQuiz = ({chat}: {chat: AMQChat[]}) => {
    const { changeView } = useContext(GameViewContext);
    const [songs, setSongs] = useState<string[]>([]);
    const [player, setPlayer] = useState<AMQInGamePlayer[]>([]);

    useEffect(() => {
        const setup = (e: any, arg: any) => {
            setPlayer(arg.players);
        }
        window.electron.on(GameStarting, setup);

        return () => window.electron.removeListener(GameStarting, setup);
    }, []);

    useEffect(() => {
        const song = (e: any, arg: any) => {
            setSongs(arg);
        }
        window.electron.on(GetAllSongName, song);

        return () => window.electron.removeListener(GetAllSongName, song);
    }, [songs]);

    useEffect(() => {
        const ans = (e: any, arg: any) => {}
        window.electron.on(AnswerResults, ans);

        return () => window.electron.removeListener(AnswerResults, ans);
    });

    return (
        <div className="relative w-full h-full">
        </div>
    )
}

export default AMQQuiz;
