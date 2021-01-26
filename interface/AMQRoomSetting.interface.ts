import { AMQAvater } from './AMQAvater.interface';

export type RoomChangeType = 'settings' | 'players' |'spectators' | 'players' |
                            'songsLeft' | 'game start' | 'game over' | 'Room Closed'; // none==roomclose for Host

export type RoomSetting = {
    roomName: string,
    privateRoom: boolean,
    password: string,
    roomSize: number,
    numberOfSongs: number,
    teamSize: number,
    modifiers: {
        skipGuessing: boolean,
        skipReplay: boolean,
        duplicates: boolean,
        queueing: boolean,
        lootDropping: boolean
    },
    songSelection: {
        standardValue: number,
        advancedValue: {
            watched: number,
            unwatched: number,
            random: number
        }
    },
    songType: {
        standardValue: {
            openings: boolean,
            endings: boolean,
            inserts: boolean
        },
        advancedValue: {
            openings: number,
            endings: number,
            inserts: number,
            random: number
        }
    },
    guessTime: {
        randomOn: boolean,
        standardValue: number,
        randomValue: [
            number,
            number
        ]
    },
    scoreType: number,
    showSelection: number,
    inventorySize: {
        randomOn: boolean,
        standardValue: number,
        randomValue: [
            number,
            number
        ]
    },
    lootingTime: {
        randomOn: boolean,
        standardValue: number,
        randomValue: [
            number,
            number
        ]
    },
    lives: number,
    samplePoint: {
        randomOn: boolean,
        standardValue: number,
        randomValue: [
            number,
            number
        ]
    },
    playbackSpeed: {
        randomOn: boolean,
        standardValue: number,
        randomValue: [
            true,
            true,
            true,
            true
        ]
    },
    songDifficulity: {
        advancedOn: boolean,
        standardValue: {
            easy: true,
            medium: true,
            hard: true
        },
        advancedValue: [
            number,
            number
        ]
    },
    songPopularity: {
        advancedOn: boolean,
        standardValue: {
            disliked: boolean,
            mixed: boolean,
            liked: boolean
        },
        advancedValue: [
            number,
            number
        ]
    },
    playerScore: {
        advancedOn: boolean,
        standardValue: [
            number,
            number
        ],
        advancedValue: [
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean
        ]
    },
    animeScore: {
        advancedOn: boolean,
        standardValue: [
            number,
            number
        ],
        advancedValue: [
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean,
            boolean
        ]
    },
    vintage: {
        standardValue: {
            years: [
                number,
                number
            ],
            seasons: [
                number,
                number
            ]
        },
        advancedValueList: []
    },
    type: {
        tv: boolean,
        movie: boolean,
        ova: boolean,
        ona: boolean,
        special: boolean
    },
    genre: [],
    tags: [],
    gameMode: 'Solo' | 'Multiplayer'
}

export type PublicRoomSettings = {
    id: number;
    host: string; // Host username
    players: string[];
    numberOfPlayers: number;
    numberOfSpectators: number;
    inLobby: boolean;
    hostAvatar: AMQAvater;
    settings: RoomSetting;
    songLeft?: number;
    playerCount: number;
    spectatorCount: number;
}
