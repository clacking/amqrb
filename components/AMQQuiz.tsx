import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaPause, FaLessThan } from 'react-icons/fa';
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

const VideoPlayer = ({src, playControl, startTime, volume}:
    {src: string, playControl: boolean, startTime: number, volume: number}
) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current!.src = src;
    }, [src]);

    useEffect(() => {
        if (playControl) ref.current!.play();
        else ref.current!.pause();
    }, [playControl]);

    useEffect(() => {
        ref.current!.currentTime = startTime;
    }, [startTime]);

    useEffect(() => {
        ref.current!.volume = volume;
    }, [volume]);

    return (
        <video className="w-full h-full" ref={ref} />
    );
}

const VideoOverlay = () => {
    return (
        <div className="w-full h-full"></div>
    );
}

const Video = () => {}

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
        window.electron.send('amqEmit', {
            command: SkipVote, data: {skipVote: !skip}, type: quiz
        });
        setSkip(!skip);
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
        changeView('default');
    }

    const pause = () => {}

    const lobbyVote = () => {}

    return (
        <div className="relative w-full h-full">
            <header className="flex w-full p-2 justify-between">
                <div>
                    <button onClick={leave} className="px-4 py-1 border">Leave</button>
                    <button onClick={pause} className="px-4 py-1"><FaPause /></button>
                    <button onClick={lobbyVote} className="px-4 py-1"><FaLessThan /></button>
                </div>
            </header>
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
