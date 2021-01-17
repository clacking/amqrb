import { EventEmitter } from 'events';
import { QuizOver, SendFeedback, PlayerLeft, RejoiningPlayer,
    SpectatorLeft, QuizNextVideoInfo, PlayNextSong, PlayerAnswers,
    AnswerResults, QuizEndResult, QuizWaitingBuffering, QuizXpCreditGain,
    QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
    ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange,
    QuizPauseTriggered, QuizUnpauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

export function quizGame () {
    const { quiz } = AMQEventType;
    const io = getGameSocket();
    const quizEvents = [
        QuizOver, SendFeedback, PlayerLeft, RejoiningPlayer,
        SpectatorLeft, QuizNextVideoInfo, PlayNextSong, PlayerAnswers,
        AnswerResults, QuizEndResult, QuizWaitingBuffering, QuizXpCreditGain,
        QuizNoPlayers, PlayerAnswered, QuizOverlayMessage, QuizSkipMessage,
        ReturnLobbyVoteStart, GuessPhaseOver, QuizFatalError, PlayerNameChange,
        QuizPauseTriggered, QuizUnpauseTriggered, ReturnLobbyVoteResult, TeamMemberAnswer
    ];

    quizEvents.forEach(s => {
        addCommandHandler(s);
    });

}
