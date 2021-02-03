import { EventEmitter } from 'events';
import { QuizOver, SendFeedback, PlayerLeft, RejoiningPlayer,
    SpectatorLeft, QuizNextVideoInfo, PlayNextSong, PlayerAnswers,
    AnswerResults, QuizEndResult, QuizWaitingBuffering, QuizXpCreditGain,
    QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
    ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange,
    QuizPauseTriggered, QuizUnpauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, AMQEventType,
    GameStarting, VideoReady,
} from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';
import { NextVideoInfo } from '../interface/AMQQuiz.interface';
import { fetchSong } from './AMQSongFetcher';
import { CookieJar } from './AMQCore';

export function quizGame () {
    const { quiz } = AMQEventType;
    const io = getGameSocket();

    // quiz injections
    coreEmitter.on(GameStarting, () => {
    });

    // load songs
    const loaded = async (d: NextVideoInfo) => {
        if (!CookieJar) throw new Error('No cookie.');
        const songId = d.videoInfo.id;
        const { videoMap } = d.videoInfo;
        const video = videoMap.catbox?.[720] || videoMap.catbox?.[480] || videoMap.catbox?.[0];

        // db/cache

        const song = await fetchSong(video!, CookieJar);
        io.emit('command', { type: quiz, command: VideoReady, data: { songId } });
        emitEvent('amqVideo', { id: songId, url: `amq://${song}` });
    };
    coreEmitter.on(QuizNextVideoInfo, loaded);
}
