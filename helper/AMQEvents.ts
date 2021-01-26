/**
 * AMQ Game Socket events string.
 */

export const AMQEventType = {
    lobby: 'lobby',
    roombrowser: 'roombrowser',
    quiz: 'quiz',
    library: 'library',
    social: 'social',
}

// event types
export const lobby = 'lobby';
export const roombrowser = 'roombrowser';
export const quiz = 'quiz';
export const library = 'library';
export const social = 'social';

// comments mean EvenType (Sending event)
export const LoginComplete = 'login complete';
export const PlayerCount = 'online player count change';
export const ServerRestart = 'server restart';
export const NewDonation = 'new donation';
export const PopoutMessage = 'popout message';
export const RankedScoreUpdate = 'ranked score update'; // quiz?
export const ForceLogOff = 'force logoff';
export const UnknownError = 'unknown error';
export const RankedGameStateChange = 'ranked game state change';
export const SendGameChatMessage = 'game chat message'; //lobby send chat
export const GameChatMessage = 'Game Chat Message'; //lobby
export const GameChatUpdate = 'game chat update'; //lobby
export const GetRooms = 'get rooms'; // roombrowser
export const RoomChange = 'Room Change'; // roombrowser
export const HostGame = 'Host Game'; // roombrowser
export const HostRoom = 'host room'; // roombrowser
export const RemoveRoombrowserListeners = 'remove roombrowser listners'; // roombrowser
export const NewRoom = 'New Rooms';
export const JoinGame = 'Join Game'; // lobby
export const HostSoloGame = 'host solo room'; // lobby
export const ChangeGameSetting = 'change game settings'; // lobby
export const StartGame = 'start game'; // lobby
export const RoomSettingChanged = 'Room Settings Changed'; // lobby
export const NewPlayer = 'New Player'; // lobby
export const PlayerLeft = 'Player Left'; // lobby
export const SpectatorChangeToPlayer = 'Spectator Change To Player'; // lobby
export const PlayerReadyChange = 'Player Ready Change'; // lobby
export const RoomClosed = 'game closed'; // lobby
export const GameStarting = 'Game Starting'; // lobby
export const PlayerChangedToSpectator = 'Player Changed To Spectator'; // lobby
export const AvatarChange = 'avatar change'; // lobby
export const HostPromotion = 'Host Promotion'; // lobby
export const SpectatorLeft = 'Spectator Left'; // lobby
export const PlayerNameChange = 'player name change'; // lobby
export const JoinTeam = 'join team'; // lobby
export const ShuffleTeams = 'shuffle teams'; // lobby
export const LeaveGame = 'leave game'; // lobby
export const QuizNoSongs = 'Quiz no songs'; // quiz
export const GetAllSongName = 'get all song names'; //quiz
export const QuizNextVideoInfo = 'quiz next video info'; //quiz
export const QuizReady = 'quiz ready'; //quiz
export const QuizOver = 'quiz over'; //quiz
export const SendFeedback = 'send feedback'; //quiz
export const QuizWaitingBuffering = 'quiz waiting buffering';
export const VideoReady = 'video ready'; // quiz
export const PlayNextSong = 'play next song';
export const QuizAnswer = 'quiz answer'; // quiz
export const QuizXpCreditGain = 'quiz xp credit gain'; //quiz
export const RejoiningPlayer = 'Rejoining Player'; // quiz ranked
export const PlayerAnswered = 'player answered';
export const QuizSkipMessage = 'quiz skip message'; //quiz
export const QuizOverlayMessage = 'quiz overlay message'; //quiz
export const QuizPauseTriggered = 'quiz pause triggered'; //quiz
export const ReturnLobbyVoteStart = 'return lobby vote start'; //quiz
export const SkipVote = 'skip vote'; // quiz
export const QuizUnpauseTriggered = 'quiz unpause triggered'; //quiz
export const QuizNoPlayers = 'quiz no players'; //quiz
export const QuizFatalError = 'quiz fatal error'; //quiz
export const GuessPhaseOver = 'guess phase over'; //quiz
export const PlayerAnswers = 'player answers'; //quiz
export const QuizEndResult = 'quiz end result'; //quiz
export const AnswerResults = 'answer results'; //quiz
export const TeamMemberAnswer = 'team member answer'; //quiz
export const StartReturnLobbyVote = 'start return lobby vote'; // quiz
export const ReturnLobbyVoteResult = 'return lobby vote result'; //quiz
export const JoinRankedGame = 'join ranked game'; //roombrowser
export const ExpandLibrary = 'expandLibrary questions'; // library
export const ExpandLibraryClose = 'expandLibrary closed'; // library
export const GetLeaderboard = 'get leaderboard level entries'; // social
export const StopLeaderboard = 'stop leaderboard listning'; // social
export const EmoteUnlocked = 'emote unlocked';
export const UnlockAvatar = 'unlock avatar';
export const TicketRollResult = 'ticket roll result';
export const ForceLogoff = 'force logoff';
