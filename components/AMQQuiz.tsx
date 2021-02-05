import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, ModalHeader, useDisclosure } from '@chakra-ui/react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { GameViewContext } from './AMQGame';
import {
    quiz, lobby, GameStarting, QuizOver, RejoiningPlayer, SpectatorLeft, QuizNextVideoInfo,
    PlayNextSong, PlayerAnswers, AnswerResults, QuizEndResult, QuizWaitingBuffering,
    QuizXpCreditGain, QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
    ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange, QuizUnpauseTriggered,
    QuizPauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, GetAllSongName, QuizAnswer, SkipVote, LeaveGame,
    SongFeedback,

} from '../helper/AMQEvents';
import { GameContext } from './AMQGameContainer';
import AMQChat from './AMQChat';
import {
    AllSong, IAnswerResults, NextVideoInfo, IPlayerAnswers, IPlayerAnswer, IQuizAnswer, IQuizOverlayMessage, ISongInfo
} from '../interface/AMQQuiz.interface';

type QuizPhases = 'pregame' | 'guess' | 'guessover' | 'result' | 'gameover';

const AMQQuizContext = createContext({});

const PlayerStandingMap = () => {}

const PlayerList = () => {}

const QuizInfomationBox = ({phase, songCount, answer}: {phase: QuizPhases, songCount: number, answer?: ISongInfo}) => {
    return (
        <div className="w-full flex flex-row text-center h-14 my-1 bg-gray-800 text-white">
            <div className="w-16 grid place-content-center bg-purple-900 ">
                { songCount }
            </div>
            <div className="flex flex-col text-center w-full h-full">
                { (phase==='result' && answer) ?
                <>
                    <span className="text-2xl">
                        { answer.animeNames.romaji }
                    </span>
                    <span>
                        { answer.artist } - { answer.songName }
                        {' '}
                        ({answer.type} {answer.typeNumber}) {answer.annId}
                    </span>
                </>
                :
                <span className="grid place-content-center">
                    <span className="animate-spin select-none">🤔</span>
                </span>
                }
            </div>
        </div>
    )
}

const VideoPlayer = ({src, phase, startPoint, volume=0.5}:
    {src: string, phase: QuizPhases, startPoint: number, volume?: number}
) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        ref.current!.src = src;
    }, [src]);

    useEffect(() => {
        if (phase==='pregame') {
            ref.current!.pause();
        }
        if (phase==='guess' || phase==='result') {
            ref.current!.currentTime = startPoint;
            ref.current!.play();
        }
    }, [phase]);

    useEffect(() => {
        ref.current!.volume = volume;
    }, [volume]);

    const invisible = phase==='guess' || phase==='guessover';

    return (
        <video className={`w-full h-full absolute z-0 ${invisible&&'invisible'}`} ref={ref} autoPlay={true} controls={false}>
            <span>Sound Only</span>
        </video>
    );
}

const VideoOverlay = ({playLength, phase}:
    {playLength: number, phase: QuizPhases}
) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const overlay = (e: any, d: IQuizOverlayMessage) => setMessage(d);
        window.electron.on(QuizOverlayMessage, overlay);

        return () => window.electron.removeAllListeners(QuizOverlayMessage);
    });

    useEffect(() => {
        setMessage('');
    }, [phase]);

    const isGuess = phase==='guess' || phase==='guessover';

    return (
        <div className={`w-full h-full absolute z-10 ${phase!=='result' && 'bg-gray-800'}`}>
            { message && <span className="absolute p-2 bg-black bg-opacity-60">{message}</span> }
            { isGuess &&
            <div className="grid h-full place-content-center">
                <CountdownCircleTimer
                    isPlaying={isGuess} duration={playLength-1} colors={[['#5fa4d3', 1]]}
                >
                    { ({ remainingTime }) =>
                        <span className="text-5xl text-white">
                            {phase==='guessover' ? 'Result' : remainingTime}
                        </span>
                    }
                </CountdownCircleTimer>
            </div>
            }
        </div>
    );
}

const Video = ({songId, phase, songCount, volume}:
    {songId: number, phase: QuizPhases, songCount: number, volume: number}
) => {
    // video infos
    const [videoSrc, setVideoSrc] = useState<Map<number, string>>(new Map());

    const [videos, setVideos] = useState<NextVideoInfo[]>([]);

    useEffect(() => {
        const setvideo = (e: any, d: any) => {
            setVideoSrc(new Map(videoSrc).set(d.id, d.url));
        }
        window.electron.on('amqVideo', setvideo);

        return () => window.electron.removeAllListeners('amqVideo');
    }, [videoSrc]);

    useEffect(() => {
        const id = videos[songCount-1];
        if (id && songCount>0)  {
            window.electron.send('amqEmit', {
                command: SongFeedback, type: quiz, data: { feedbackType: 0, resolution: 720, host: "catbox", songId: id.videoInfo.id, adminReport: false }
            });
        }
    }, [songCount]);

    useEffect(() => {
        const nextVideo = (e: any, d: NextVideoInfo) => {
            setVideos([...videos, d]);
        }
        window.electron.on(QuizNextVideoInfo, nextVideo);

        return () => {
            window.electron.removeAllListeners(QuizNextVideoInfo);
        }
    });

    const video = videos[songCount-1];
    const currentSrc = videoSrc.get(video?.videoInfo.id || 0);

    if (!video) return (
        <div className="relative" style={{aspectRatio: '16 / 9'}}>waiting buffer...</div>
    );

    return (
        <div className="relative" style={{aspectRatio: '16 / 9'}}>
            <VideoOverlay playLength={video.playLength} phase={phase} />
            { (!video || !currentSrc) ?
            <div className="relative">waiting buffer...</div>
            :
            <VideoPlayer src={currentSrc} phase={phase} startPoint={video.startPont} volume={volume} />
            }
        </div>
    );
}

const AutoCompleter = (input: string, suggests: string[]) => {}

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
        if (phase==='result') {
            setSkip(false);
        }
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

    const copyAnswer = async () => await navigator.clipboard.writeText(answer);

    return (
        <div className={`flex flex-row h-8 my-1 transition duration-500 text-white border border-white border-opacity-30 ${phase==='guess' ? 'bg-gray-900' : 'bg-gray-800'} p-1`}>
            <button onClick={submitSkip}>{skip?'✔':''} Skip</button>
            <input className="flex flex-grow bg-transparent text-center" type="text"
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
            <span>{(answer && answer===answerCheck && phase==='guess') ? 'submitted' : ''}</span>
            <button onClick={copyAnswer}>Copy</button>
        </div>
    );
}

const AMQQuiz = () => {
    const { changeView } = useContext(GameViewContext);
    const { chat, quizInitial, setting, spectator, isHost } = useContext(GameContext);
    if (!quizInitial) return <div>waiting gamestart</div>;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [player, setPlayers] = useState(quizInitial.players);
    const [slotMap, setSlotMap] = useState(quizInitial.groupSlotMap);
    const [phase, setPhase] = useState<QuizPhases>('pregame');
    const [songCount, setSongCount] = useState(0);
    const [songs, setSongs] = useState<string[]>([]);
    const [playerAnswers, setPlayerAnswers] = useState<IPlayerAnswer[]>([]);
    const [result, setResult] = useState<IAnswerResults[]>([]);
    const [waitingBuf, setWaitingBuf] = useState(false);
    const [volume, setVolume] = useState(0.5);

    // Initialize song list
    useEffect(() => {
        const song = (e: any, arg: AllSong) => setSongs(arg.names);
        window.electron.once(GetAllSongName, song);
    }, []);

    useEffect(() => {
        const ans = (e: any, d: IAnswerResults) => {
            setPhase('result');
            setResult([...result, d]);
            setSlotMap(d.groupMap);
        }
        window.electron.on(AnswerResults, ans);

        const playerAnswers = (e: any, d: IPlayerAnswers) => {
            setPlayerAnswers([...d.answers]);
        }
        window.electron.on(PlayerAnswers, playerAnswers);

        const guessphase = (e: any) => {
            setPhase('guessover');
        }
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

        const gameover = (e: any, d: any) => {
            changeView('lobby');
        }
        window.electron.on(QuizOver, gameover);

        const endresult = (e: any, d: any) => {
            setPhase('gameover');
        }
        window.electron.on(QuizEndResult, endresult);

        return () => {
            window.electron.removeAllListeners(GuessPhaseOver);
            window.electron.removeAllListeners(PlayerAnswers);
            window.electron.removeAllListeners(AnswerResults);
            window.electron.removeAllListeners(PlayNextSong);
            window.electron.removeAllListeners(QuizWaitingBuffering);
            window.electron.removeAllListeners(QuizOver);
            window.electron.removeAllListeners(QuizEndResult);
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
                    <button onClick={leave} className="px-4 py-1 mr-2 border">Leave</button>
                    { isHost && (
                    <>
                    <button onClick={pauseVote} className="px-1 py-1 border">Pause</button>
                    <button onClick={lobbyVote} className="px-1 py-1 border">Lobby</button>
                    </>
                    )}
                </div>
                <div>
                    {songCount}
                </div>
                <div>
                    <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} />
                    <button className="border px-4 py-1 mx-1">History</button>
                    <button onClick={onOpen} className="border px-4 py-1 mx-1">Setting</button>
                    <button className="border px-4 py-1 mx-1">Spectators ({spectator.length})</button>
                </div>
            </header>
            <main className="w-full h-full flex flex-grow justify-between flex-col xl:flex-row p-4">
                <div className="flex flex-col flex-grow">
                    <QuizInfomationBox phase={phase} songCount={songCount} answer={result[songCount-1]?.songInfo} />
                    <Video songId={songCount} phase={phase} songCount={songCount} volume={volume} />
                    <AnswerBox songs={songs} phase={phase} songCount={songCount} />
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
    );
}

export default AMQQuiz;
