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

// comments mean EvenType (Sending event)
export const AMQEventsCommand = {
    LoginComplete: 'login complete',
    PlayerCount: 'online player count change',
    ServerRestart: 'server restart',
    NewDonation: 'new donation',
    PopoutMessage: 'popout message',
    RankedScoreUpdate: 'ranked score update', // quiz?
    ForceLogOff: 'force logoff',
    UnknownError: 'unknown error',
    RankedGameStateChange: 'ranked game state change',
    SendGameChatMessage: 'game chat message', //lobby send chat
    GameChatMessage: 'Game Chat Message', //lobby
    GameChatUpdate: 'game chat update', //lobby
    GetRooms: 'get rooms', // roombrowser
    RoomChange: 'Room Change', // roombrowser
    HostGame: 'Host Game', // roombrowser
    HostRoom: 'host room', // roombrowser
    RemoveRoombrowserListeners: 'remove roombrowser listners', // roombrowser
    NewRoom: 'New Rooms',
    JoinGame: 'Join Game', // lobby
    HostSoloGame: 'host solo room', // lobby
    ChangeGameSetting: 'change game settings', // lobby
    StartGame: 'start game', // lobby
    RoomSettingChanged: 'Room Settings Changed', // lobby
    NewPlayer: 'New Player', // lobby
    PlayerLeft: 'Player Left', // lobby
    SpectatorChangeToPlayer: 'Spectator Change To Player', // lobby
    PlayerReadyChange: 'Player Ready Change', // lobby
    RoomClosed: 'game closed', // lobby
    GameStarting: 'Game Starting', // lobby
    PlayerChangedToSpectator: 'Player Changed To Spectator', // lobby
    AvatarChange: 'avatar change', // lobby
    HostPromotion: 'Host Promotion', // lobby
    SpectatorLeft: 'Spectator Left', // lobby
    PlayerNameChange: 'player name change', // lobby
    JoinTeam: 'join team', // lobby
    ShuffleTeams: 'shuffle teams', // lobby
    LeaveGame: 'leave game', // lobby
    GetAllSongName: 'get all song names', //quiz
    QuizNextVideoInfo: 'quiz next video info', //quiz
    QuizReady: 'quiz ready', //quiz
    QuizOver: 'quiz over', //quiz
    SendFeedback: 'send feedback', //quiz
    QuizWaitingBuffering: 'quiz waiting buffering',
    VideoReady: 'video ready', // quiz
    PlayNextSong: 'play next song',
    QuizAnswer: 'quiz answer', // quiz
    QuizXpCreditGain: 'quiz xp credit gain', //quiz
    RejoiningPlayer: 'Rejoining Player', // quiz ranked
    PlayerAnswered: 'player answered',
    QuizSkipMessage: 'quiz skip message', //quiz
    QuizOverlayMessage: 'quiz overlay message', //quiz
    QuizPauseTriggered: 'quiz pause triggered', //quiz
    ReturnLobbyVoteStart: 'return lobby vote start', //quiz
    SkipVote: 'skip vote', // quiz
    QuizUnpauseTriggered: 'quiz unpause triggered', //quiz
    QuizNoPlayers: 'quiz no players', //quiz
    QuizFatalError: 'quiz fatal error', //quiz
    GuessPhaseOver: 'guess phase over', //quiz
    PlayerAnswers: 'player answers', //quiz
    QuizEndResult: 'quiz end result', //quiz
    AnswerResults: 'answer results', //quiz
    TeamMemberAnswer: 'team member answer', //quiz
    StartReturnLobbyVote: 'start return lobby vote', // quiz
    ReturnLobbyVoteResult: 'return lobby vote result', //quiz
    JoinRankedGame: 'join ranked game', //roombrowser
    // Library
    ExpandLibrary: 'expandLibrary questions', // library
    ExpandLibraryClose: 'expandLibrary closed', // library
    // Social
    GetLeaderboard: 'get leaderboard level entries', // social
    StopLeaderboard: 'stop leaderboard listning', // social
}

