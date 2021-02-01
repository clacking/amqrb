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
import {
    AllSong, IAnswerResults, NextVideoInfo, IPlayerAnswers, IPlayerAnswer, IQuizAnswer
} from '../interface/AMQQuiz.interface';
import { count } from 'console';

type QuizPhases = 'pregame' | 'guess' | 'guessover' | 'result' | 'gameover';

const PlayerList = () => {}

const VideoPlayer = ({src, phase, startPoint, volume=0.5}:
    {src: string, phase: QuizPhases, startPoint: number, volume?: number}
) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current!.src = src;
    }, [src]);

    useEffect(() => {
        if (phase!=='pregame') {
            ref.current!.currentTime = startPoint;
            ref.current!.play();
        }
        else ref.current!.pause();
    }, [phase]);

    useEffect(() => {
        ref.current!.volume = volume;
    }, [volume]);

    return (
        <video className="w-full h-full absolute z-0" ref={ref} controls={false} />
    );
}

const VideoOverlay = ({playLength, phase}:
    {playLength: number, phase: QuizPhases}
) => {
    const [countdown, setCountdown] = useState(playLength);

    useEffect(() => {
        if (phase==='guess') {
            const timeout = setTimeout(() => {
                if (countdown>0) setCountdown(countdown-1);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [countdown, phase]);

    return (
        <div className={`w-full h-full absolute z-10 ${phase!=='result' && 'bg-gray-800'}`}>
            <div>{countdown}</div>
        </div>
    );
}

const Video = ({songId, phase, songCount}:
    {songId: number, phase: QuizPhases, songCount: number}
) => {
    // video infos
    const [videoSrc, setVideoSrc] = useState<Map<number, string>>(new Map());
    const [startPoint, setStartPoint] = useState(0);

    const [videos, setVideos] = useState<NextVideoInfo[]>([]);

    useEffect(() => {
        const setvideo = (e: any, d: any) => {
            setVideoSrc(new Map(videoSrc).set(d.id, d.url));
        }
        window.electron.on('amqVideo', setvideo);

        return () => window.electron.removeAllListeners('amqVideo');
    }, [videoSrc]);

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
    const currentSrc = videoSrc.get(video?.videoInfo.id || 0);

    if (!video || !currentSrc) return (
        <div className="relative" style={{width: '640px', height: '360px'}}>waiting buffer...</div>
    );

    return (
        <div className="relative" style={{width: '640px', height: '360px'}}>
            <VideoOverlay playLength={video.playLength} phase={phase} />
            <VideoPlayer src={currentSrc} phase={phase} startPoint={startPoint} />
        </div>
    );
}

const AnswerBox = ({songs, phase, songCount}:
    {songs: string[], phase: QuizPhases, songCount: number}
) => {
    const [skip, setSkip] = useState(false);
    const [answer, setAnswer] = useState(''); // Player answer
    const [answerCheck, setAnswerCheck] = useState(''); // Answer submit response

    // Answer response
    useEffect(() => {
        const checkAnswer = (e:any, d: IQuizAnswer) => {
            setAnswerCheck(d.answer);
        }
        window.electron.on(QuizAnswer, checkAnswer);

        return () => window.electron.removeListener(QuizAnswer, checkAnswer);
    });

    useEffect(() => {
        if (phase==='guess') {
            setAnswer('');
            setSkip(false);
        }
        if (phase==='guessover') {}
    }, [phase]);

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
        <div className="flex flex-row h-6">
            <button onClick={submitSkip}>{skip?'✔':''} Skip</button>
            <input className="flex flex-grow text-white border border-white border-opacity-30 bg-gray-800 p-1" type="text"
                value={answer} disabled={phase!=='guess'}
                onChange={e=>setAnswer(e.target.value)} onKeyPress={submitAnswer}
            />
            {
                answerCheck ? (
                    <div></div>
                ) : (
                    <div></div>
                )
            }
            <span>{(answer && answer===answerCheck) ? 'submitted' : ''}</span>
            <button onClick={copyAnswer}>Copy</button>
        </div>
    );
}

const AMQQuiz = () => {
    const { changeView } = useContext(GameViewContext);
    const { chat, inGamePlayer, setting } = useContext(GameContext);

    const [phase, setPhase] = useState<QuizPhases>('pregame');
    const [songCount, setSongCount] = useState(0);
    const [songs, setSongs] = useState<string[]>([]);
    const [playerAnswers, setPlayerAnswers] = useState<IPlayerAnswer[]>([]);
    const [waitingBuf, setWaitingBuf] = useState(false);

    // Initialize song list
    useEffect(() => {
        const song = (e: any, arg: AllSong) => setSongs(arg.names);
        window.electron.once(GetAllSongName, song);
    }, []);

    useEffect(() => {
        const ans = (e: any, d: IAnswerResults) => {
        }
        window.electron.on(AnswerResults, ans);

        const playerAnswers = (e: any, d: IPlayerAnswers) => {

        }
        window.electron.on(PlayerAnswers, playerAnswers);

        const guessphase = (e: any) => setPhase('guessover');
        window.electron.on(GuessPhaseOver, guessphase);

        const playnext = (e: any, d: any) => {
            setPhase('guess');
            setSongCount(d.songNumber);
        }
        window.electron.on(PlayNextSong, playnext);

        const buffer = (e: any, d: any) => {
            setWaitingBuf(true);
        }
        window.electron.on(QuizWaitingBuffering, buffer);

        return () => {
            window.electron.removeAllListeners(GuessPhaseOver);
            window.electron.removeAllListeners(PlayerAnswers);
            window.electron.removeAllListeners(AnswerResults);
            window.electron.removeAllListeners(PlayNextSong);
            window.electron.removeAllListeners(QuizWaitingBuffering);
        }
    });

    const leave = () => {
        window.electron.send('amqEmit', { command: LeaveGame, type: lobby });
        changeView('default');
    }

    const pauseVote = () => {}

    const lobbyVote = () => {}

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex w-full p-2 justify-between">
                <div>
                    <button onClick={leave} className="px-4 py-1 border">Leave</button>
                    <button onClick={pauseVote} className="px-4 py-1"><FaPause /></button>
                    <button onClick={lobbyVote} className="px-4 py-1"><FaLessThan /></button>
                </div>
                <div>
                    {songCount}
                </div>
            </header>
            <main className="w-full h-full flex flex-grow flex-col xl:flex-row">
                <div className="flex flex-col flex-grow">
                    <Video songId={songCount} phase={phase} songCount={songCount} />
                    <AnswerBox songs={songs} phase={phase} songCount={songCount} />
                </div>
                <div className="flex">
                    <AMQChat chat={chat} />
                </div>
            </main>
        </div>
    );
}

export default AMQQuiz;
