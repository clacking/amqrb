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
import AMQChat from './AMQChat';
import { AllSong, NextVideoInfo } from '../interface/AMQQuiz.interface';
import { count } from 'console';

const PlayerList = () => {}

const VideoPlayer = ({src, playControl, startPoint, volume, visible}:
    {src: string, playControl: boolean, startPoint: number, volume: number, visible: boolean}
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
        ref.current!.currentTime = startPoint;
    }, [startPoint]);

    useEffect(() => {
        ref.current!.volume = volume;
    }, [volume]);

    return (
        <video className="w-full h-full absolute z-0" ref={ref} controls={false} />
    );
}

const VideoOverlay = ({playLength}:
    {playLength: number}
) => {
    const [countdown, setCountdown] = useState(playLength);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (countdown>0) setCountdown(countdown-1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [countdown]);

    return (
        <div className="w-full h-full absolute z-10">
            <div>{countdown}</div>
        </div>
    );
}

const Video = ({songId, videoBuf, songCount}:
    {songId: number, videoBuf: boolean, songCount: number}
) => {
    const [play, setPlay] = useState(false);
    // video infos
    const [videoSrc, setVideoSrc] = useState('');
    const [startPoint, setStartPoint] = useState(0);
    const [visible, setVisible] = useState(false);

    // all video info
    // TODO: put it in main process
    const [vcount, setVcount] = useState(0);
    const [videos, setVideos] = useState<NextVideoInfo[]>([]);

    useEffect(() => {
        const nextVideo = (e: any, d: NextVideoInfo) => {
            setVideos([...videos, d]);
        }
        window.electron.on(QuizNextVideoInfo, nextVideo);

        return () => {
            window.electron.removeAllListeners(QuizNextVideoInfo);
        }
    }, [songId]);

    const video = videos[songCount-1];

    return (
        <div className="relative" style={{width: '720px', height: '1280px'}}>
            <VideoOverlay playLength={video.startPont} />
        </div>
    );
}

const AnswerBox = ({songs, answerable, songCount}:
    {songs: string[], answerable: boolean, songCount: number}
) => {
    const [skip, setSkip] = useState(false);
    const [answer, setAnswer] = useState(''); // Player answer
    const [answerCheck, setAnswerCheck] = useState(''); // Answer submit response

    // Answer response
    useEffect(() => {
        const checkAnswer = (e:any, d: any) => {
            setAnswerCheck(d.answer);
        }
        window.electron.on(QuizAnswer, checkAnswer);

        return () => window.electron.removeListener(QuizAnswer, checkAnswer);
    });

    // Reset
    useEffect(() => {
        setAnswer('');
        setSkip(false);
    }, [songCount]);

    const submitAnswer = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
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

    const copyAnswer = async () => {
        await navigator.clipboard.writeText(answer);
    }

    return (
        <div className="flex flex-row">
            <button onClick={submitSkip}>{skip?'✔':''} Skip</button>
            <input className="flex flex-grow text-white border border-white border-opacity-30 bg-gray-800 p-1" type="text" value={answer} disabled={!answerable}
                onChange={e=>setAnswer(e.target.value)} onKeyPress={submitAnswer}
            />
            {
                answerCheck ? (
                    <div></div>
                ) : (
                    <div></div>
                )
            }
            <button onClick={copyAnswer}>Copy</button>
        </div>
    );
}

const AMQQuiz = () => {
    const { changeView } = useContext(GameViewContext);
    const { chat, inGamePlayer } = useContext(GameContext);

    const [songCount, setSongCount] = useState(0);
    const [songs, setSongs] = useState<string[]>([]);
    const [playerAnswers, setPlayerAnswers] = useState([]);
    const [quizReady, setQuizReady] = useState(false);
    const [answerable, setAnswerable] = useState(false);
    const [waitingBuf, setWaitingBuf] = useState(false);

    // Initialize song list
    useEffect(() => {
        const song = (e: any, arg: AllSong) => {
            setSongs(arg.names);
        }
        window.electron.once(GetAllSongName, song);
    }, []);

    useEffect(() => {
        const ans = (e: any, d: any) => {}
        window.electron.on(AnswerResults, ans);

        const phasecheck = (e: any) => {
            setAnswerable(false);
        }
        window.electron.on(GuessPhaseOver, phasecheck);

        const playnext = (e: any, d: any) => {
            setAnswerable(true);
            setSongCount(d.songNumber);
        }
        window.electron.on(PlayNextSong, playnext);

        return () => {
            window.electron.removeAllListeners(GuessPhaseOver);
            window.electron.removeAllListeners(AnswerResults);
        }
    });

    useEffect(() => {
        const buffer = (e: any, d: any) => {
            setWaitingBuf(true);
        }
        window.electron.on(QuizWaitingBuffering, buffer);

        return () => {
            window.electron.removeAllListeners(QuizWaitingBuffering);
        }
    }, [waitingBuf]);

    const leave = () => {
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
        changeView('default');
    }

    const pause = () => {}

    const lobbyVote = () => {}

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex w-full p-2 justify-between">
                <div>
                    <button onClick={leave} className="px-4 py-1 border">Leave</button>
                    <button onClick={pause} className="px-4 py-1"><FaPause /></button>
                    <button onClick={lobbyVote} className="px-4 py-1"><FaLessThan /></button>
                </div>
            </header>
            <main className="flex flex-col xl:flex-row">
                <div className="flex flex-row">
                    <AnswerBox songs={songs} answerable={answerable} songCount={songCount} />
                </div>
                <div className="flex">
                    <AMQChat chat={chat} />
                </div>
            </main>
        </div>
    );
}

export default AMQQuiz;
