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

    addCommandHandler(QuizOver, (d: any) => {
        emitEvent(QuizOver, d); // room setting
    });
    addCommandHandler(SendFeedback, (d: any) => {});
    addCommandHandler(PlayerLeft, (d: any) => {
        emitEvent(PlayerLeft, d);
    });
    addCommandHandler(RejoiningPlayer, (d: any) => {
        emitEvent(RejoiningPlayer, d);
    });
    addCommandHandler(SpectatorLeft, (d: any) => {
        emitEvent(SpectatorLeft, d);
    });
    addCommandHandler(QuizNextVideoInfo, (d: any) => {
        emitEvent(QuizNextVideoInfo, d);
    });
    addCommandHandler(PlayNextSong, (d: any) => {
        emitEvent(PlayNextSong, d);
    });
    addCommandHandler(PlayerAnswers, (d: any) => {
        emitEvent(PlayerAnswers, d);
    });
    addCommandHandler(AnswerResults, (d: any) => {
        emitEvent(AnswerResults, d);
    });
    addCommandHandler(QuizEndResult, (d: any) => {
        emitEvent(QuizEndResult, d);
    });
    addCommandHandler(QuizWaitingBuffering, (d: any) => {
        emitEvent(QuizWaitingBuffering, d);
    });
    addCommandHandler(QuizXpCreditGain, (d: any) => {
        emitEvent(QuizXpCreditGain, d);
    });
    addCommandHandler(QuizNoPlayers, (d: any) => {
        emitEvent(QuizNoPlayers, d);
    });
    addCommandHandler(PlayerAnswered, (d: any) => {
        emitEvent(PlayerAnswered, d);
    });
    addCommandHandler(QuizOverlayMessage, (d: any) => {
        emitEvent(QuizOverlayMessage, d);
    });
    addCommandHandler(QuizSkipMessage, (d: any) => {
        emitEvent(QuizSkipMessage, d);
    });
    addCommandHandler(ReturnLobbyVoteStart, (d: any) => {
        emitEvent(ReturnLobbyVoteStart, d);
    });
    addCommandHandler(GuessPhaseOver, (d: any) => {
        emitEvent(GuessPhaseOver, d);
    });
    addCommandHandler(QuizFatalError, (d: any) => {
        emitEvent(QuizFatalError, d);
    });
    addCommandHandler(PlayerNameChange, (d: any) => {
        emitEvent(PlayerNameChange, d);
    });
    addCommandHandler(QuizUnpauseTriggered, (d: any) => {
        emitEvent(QuizUnpauseTriggered, d);
    });
    addCommandHandler(QuizPauseTriggered, (d: any) => {
        emitEvent(QuizPauseTriggered, d);
    });
    addCommandHandler(ReturnLobbyVoteResult, (d: any) => {
        emitEvent(ReturnLobbyVoteResult, d);
    });
    addCommandHandler(TeamMemberAnswer, (d: any) => {
        emitEvent(TeamMemberAnswer, d);
    });

}
