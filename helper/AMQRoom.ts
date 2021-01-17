import { EventEmitter } from 'events';
import { HostSoloGame, HostGame, RoomClosed, RoomSettingChanged,
    NewPlayer, PlayerLeft, SpectatorChangeToPlayer, PlayerReadyChange,
    GameStarting, PlayerChangedToSpectator, AvatarChange,
    HostPromotion, SpectatorLeft, PlayerNameChange,
    JoinTeam, ShuffleTeams, HostRoom, LeaveGame, StartGame, AMQEventType } from './AMQEvents';
import { addCommandHandler, getGameSocket, coreEmitter, emitEvent } from './AMQSocket';
import { Logger } from './Logger';

let roomSetting = {};

function initializeGameRoomHandlers () {
    const { roombrowser, lobby } = AMQEventType;
    const roomEvents = [
        HostSoloGame, HostGame, RoomClosed, RoomSettingChanged,
        NewPlayer, PlayerLeft, SpectatorChangeToPlayer, PlayerReadyChange,
        GameStarting, PlayerChangedToSpectator, AvatarChange,
        HostPromotion, SpectatorLeft, PlayerNameChange,
        JoinTeam, ShuffleTeams, HostRoom, LeaveGame, StartGame
    ];

    roomEvents.forEach(s => addCommandHandler(s));
}

export function createGameRoom (setting: any, solo = false) {
    const { roombrowser, lobby } = AMQEventType;
    const io = getGameSocket();

    // add handlers for room.
    const roomEvents = [
        HostSoloGame, HostGame, RoomClosed, RoomSettingChanged,
        NewPlayer, PlayerLeft, SpectatorChangeToPlayer, PlayerReadyChange,
        GameStarting, PlayerChangedToSpectator, AvatarChange,
        HostPromotion, SpectatorLeft, PlayerNameChange,
        JoinTeam, ShuffleTeams, HostRoom, LeaveGame, StartGame
    ];

    roomEvents.forEach(s => addCommandHandler(s));

    // User event
    coreEmitter.on(LeaveGame, () => {
        if (!setting) {
            emitEvent('error', 'Not in lobby.');
            Logger.error('Not in lobby.');
        }
        io.emit('command', { type: lobby, command: LeaveGame });
        roomSetting = {};
    });

    coreEmitter.on(StartGame, () => {
        io.emit('command', { type: lobby, command: StartGame });
    });

    io.emit('command', { command: (solo ? HostSoloGame : HostRoom), type: roombrowser, data: setting });
}

export function joinGameRoom (roomid: string) {}

export function spectGameRoom (roomid: string) {}

/*
export class AMQRoom {
    client: SocketIOClient.Socket;

    constructor(client: SocketIOClient.Socket) {
        this.client = client;
    }

    // Create Game room
    createGameRoom() {
        const { HostSoloGame } = AMQEventsCommand;
        const { roombrowser } = AMQEventType;

        const setting = {
                "roomName": "Solo",
                "privateRoom": false,
                "password": "",
                "roomSize": 8,
                "numberOfSongs": 5,
                "teamSize": 1,
                "modifiers": {
                  "skipGuessing": true,
                  "skipReplay": true,
                  "duplicates": true,
                  "queueing": true,
                  "lootDropping": true
                },
                "songSelection": {
                  "standardValue": 3,
                  "advancedValue": {
                    "watched": 5,
                    "unwatched": 0,
                    "random": 0
                  }
                },
                "songType": {
                  "standardValue": {
                    "openings": true,
                    "endings": true,
                    "inserts": true
                  },
                  "advancedValue": {
                    "openings": 0,
                    "endings": 0,
                    "inserts": 0,
                    "random": 5
                  }
                },
                "guessTime": {
                  "randomOn": false,
                  "standardValue": 20,
                  "randomValue": [
                    5,
                    60
                  ]
                },
                "scoreType": 1,
                "showSelection": 1,
                "inventorySize": {
                  "randomOn": false,
                  "standardValue": 20,
                  "randomValue": [
                    1,
                    99
                  ]
                },
                "lootingTime": {
                  "randomOn": false,
                  "standardValue": 90,
                  "randomValue": [
                    10,
                    150
                  ]
                },
                "lives": 5,
                "samplePoint": {
                  "randomOn": true,
                  "standardValue": 1,
                  "randomValue": [
                    0,
                    100
                  ]
                },
                "playbackSpeed": {
                  "randomOn": false,
                  "standardValue": 1,
                  "randomValue": [
                    true,
                    true,
                    true,
                    true
                  ]
                },
                "songDifficulity": {
                  "advancedOn": false,
                  "standardValue": {
                    "easy": true,
                    "medium": true,
                    "hard": true
                  },
                  "advancedValue": [
                    0,
                    100
                  ]
                },
                "songPopularity": {
                  "advancedOn": false,
                  "standardValue": {
                    "disliked": true,
                    "mixed": true,
                    "liked": true
                  },
                  "advancedValue": [
                    0,
                    100
                  ]
                },
                "playerScore": {
                  "advancedOn": false,
                  "standardValue": [
                    1,
                    10
                  ],
                  "advancedValue": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true
                  ]
                },
                "animeScore": {
                  "advancedOn": false,
                  "standardValue": [
                    2,
                    10
                  ],
                  "advancedValue": [
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true
                  ]
                },
                "vintage": {
                  "standardValue": {
                    "years": [
                      1944,
                      2020
                    ],
                    "seasons": [
                      0,
                      3
                    ]
                  },
                  "advancedValueList": []
                },
                "type": {
                  "tv": true,
                  "movie": true,
                  "ova": true,
                  "ona": true,
                  "special": true
                },
                "genre": [],
                "tags": [],
                "gameMode": "Solo"
            }

        this.client.emit('command', { command: HostSoloGame, data: setting, type: roombrowser });
    }
}
*/