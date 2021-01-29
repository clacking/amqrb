import React, { useState, useEffect, useContext } from 'react';
import { GameViewContext } from './AMQGame';
import {
    quiz, lobby, GameStarting, QuizOver, RejoiningPlayer, SpectatorLeft, QuizNextVideoInfo,
    PlayNextSong, PlayerAnswers, AnswerResults, QuizEndResult, QuizWaitingBuffering,
    QuizXpCreditGain, QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
    ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange, QuizUnpauseTriggered,
    QuizPauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, GetAllSongName, QuizAnswer, SkipVote, LeaveGame,

} from '../helper/AMQEvents';
import { GameContext } from './AMQGameContainer';
import { AMQInGamePlayer, AMQChatMesasge } from '../interface/AMQRoom.interface';
import { AllSong } from '../interface/AMQQuiz.interface';

const PlayerList = () => {}

const VideoPlayer = () => {}

const AnswerBox = ({songs}: {songs: string[]}) => {
    const [skip, setSkip] = useState(false);
    const [answer, setAnswer] = useState('');
    const [answerCheck, setAnswerCheck] = useState('');

    // Answer response
    useEffect(() => {
        const checkAnswer = (e:any, d: any) => {
            setAnswerCheck(d.answer);
        }
        window.electron.on(QuizAnswer, checkAnswer);

        return () => window.electron.removeListener(QuizAnswer, checkAnswer);
    });

    const submitAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.key === 'Enter') {
            window.electron.send('amqEmit', {
                command: QuizAnswer, type: quiz, data: { answer, isPlaying: true, volumeAtMax: false }
            });
        }
    }

    const submitSkip = () => {
        setSkip(!skip);
        window.electron.send('amqEmit', {
            command: SkipVote, data: {skipVote: skip}, type: quiz
        });
    }

    return (
        <div className="flex flex-row">
            <button onClick={submitSkip}>{skip?'✅':''} Skip</button>
            <input className="flex-grow" type="text" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyPress={submitAnswer} />
            <button>Copy</button>
        </div>
    );
}

const AMQQuiz = () => {
    const { changeView } = useContext(GameViewContext);
    const { chat, inGamePlayer } = useContext(GameContext);
    const [songs, setSongs] = useState<string[]>([]);
    const [anserable, setAnswerable] = useState(false);

    // Initialize song list
    useEffect(() => {
        const song = (e: any, arg: AllSong) => {
            setSongs(arg.names);
        }
        window.electron.once(GetAllSongName, song);
    }, []);

    useEffect(() => {
        const ans = (e: any, arg: any) => {}
        window.electron.on(AnswerResults, ans);

        const phasecheck = (e: any) => {
            setAnswerable(false);
        }
        window.electron.on(GuessPhaseOver, phasecheck);

        return () => {
            window.electron.removeAllListeners(AnswerResults);
            window.electron.removeAllListeners(GuessPhaseOver);
        }
    });

    const leave = () => {
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
    }

    return (
        <div className="relative w-full h-full">
            <main className="flex flex-col">
                <div className="flex flex-row">
                    <AnswerBox songs={songs} />
                </div>
                <div className="flex flex-row"></div>
            </main>
        </div>
    );
}

export default AMQQuiz;
