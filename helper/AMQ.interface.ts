
export type Top5s = { name: string; amount: number; };

export type GenresInfo = { id: number; name: string; };

// LoginComplete
export type UserState = {
    xpInfo: {
        xpPercent: number;
        xpForLevel: number;
        xpIntoLevel: number;
        lastGain: number
    };
    level: number;
    friends: { name: string; online: boolean; }[];
    blockedPlayers: any[]; // TODO
    self: string;
    malName: string;
    malLastUpdate: string | Date;
    credits: number;
    tickets: number;
    rhythm: number;
    avatar: {
        avatar: {
            avatarId: number;
            colorId: number;
            characterId: number;
            active: number;
            avatarName: string;
            outfitName: string;
            colorName: string;
            backgroundFileName: string;
            colorActive: number;
            editor: null | any;
            optionName: string;
            optionActive: boolean;
        };
        background: {
            avatarName: string;
            outfitName: string;
            backgroundHori: string;
            backgroundVert: string;
            colorId: number;
            avatarId: number;
        };
    };
    tutorial: number;
    defaultAvatars: {
        characterId: number;
        avatars: {
            avatarId: number;
            outfitId: number;
            avatarName: string;
            outfitName: string;
            colorName: string;
            defaultColorId: number;
            backgroundVert: string;
            optionName: string;
            active: number;
            defaultAvatar: number;
            exclusive: number;
            limited: number;
            notePrice: number;
            realMoneyPrice: number;
            artist: string;
            world: string;
            lore: string;
            patreonTierToUnlock: null | any;
            colors: {
                name: string;
                price: number;
                colorId: number;
                active: number;
                defaultColor: number;
                backgroundVert: string;
                editor: null | any;
                limited: number;
                exclusive: number;
                tierId: null | any;
            }[];
            badgeFileName: string;
            badgeName: string;
            tierId: null | any;
        }[];
    }[];
    unlockedDesigns: any; // TODO
    characterUnlockCount: any; // TODO
    avatarUnlockCount: any; // TODO
    top5AvatarNominatios: { name: string; value: number; }[];
    top5AllTime: Top5s[];
    top5Montly: Top5s[];
    top5Weekly: Top5s[];
    recentDonations: { username: string; avatarName: string; amount: 5 }[];
    driveTotal: number;
    gameAdmin: boolean;
    patreonId: number | null | any;
    backerLevel: number;
    badgeLevel: number;
    patreonBadgeInfo: any;
    freeDonation: number;
    settings: {
        shareMal: number;
        shareScore: number;
        autoSubmit: number;
        voteSkipGuess: number;
        voteSkipReplay: number;
        disableEmojis: number;
        useRomajiNames: number;
        useWatched: number;
        useCompleted: number;
        useOnHold: number;
        useDropped: number;
        usePlanning: number;
        autoSwitchFavoritedAvatars: number;
    };
    aniList: string;
    aniListLastUpdate: string | Date;
    kitsu: string;
    kitsuLastUpdate: string | Date;
    useRomajiNames: number;
    genreInfo: GenresInfo[];
    tagInfo: GenresInfo[];
    customEmojis: any[];
    serverStatuses: { name: string; online: boolean; }[];
    savedQuizSettings: any[];
    expandCount: number;
    videoHostNames: 'animethemes' | 'catbox' | 'openingsmoe' | any;
    rankedState: number;
    rankedLeaderboards: any;
    rankedChampions: any;
    emoteGroups: any;
    unlockedEmoteIds: number[];
    patreonDesynced: null | any;
    guestAccount: number;
    saleTax: number;
    recentEmotes: { emoteId: number; emojiId: any; shortCode: any; }[];
    favoriteAvatars: any[];
}

// HostGame
export interface HostGameData {
  spectators?: (null)[] | null;
  inLobby: boolean;
  settings: Settings;
  soloMode: boolean;
  inQueue?: (null)[] | null;
  hostName: string;
  gameId: number;
  players?: (PlayersEntity)[] | null;
}
export interface Settings {
  roomName: string;
  privateRoom: boolean;
  password: string;
  roomSize: number;
  numberOfSongs: number;
  modifiers: Modifiers;
  songSelection: SongSelection;
  showSelection: AdvancedValueOrShowSelection;
  songType: SongType;
  guessTime: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  inventorySize: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  lootingTime: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  lives: number;
  samplePoint: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  playbackSpeed: PlaybackSpeed;
  songDifficulity: SongDifficulity;
  songPopularity: SongPopularity;
  playerScore: PlayerScoreOrAnimeScore;
  animeScore: PlayerScoreOrAnimeScore;
  vintage: Vintage;
  type: Type;
  genre?: (null)[] | null;
  tags?: (null)[] | null;
  gameMode: string;
}
export interface Modifiers {
  skipGuessing: boolean;
  skipReplay: boolean;
  duplicates: boolean;
  queueing: boolean;
  lootDropping: boolean;
}
export interface SongSelection {
  advancedOn: boolean;
  standardValue: number;
  advancedValue: AdvancedValueOrShowSelection;
}
export interface AdvancedValueOrShowSelection {
  watched: number;
  unwatched: number;
  random: number;
}
export interface SongType {
  advancedOn: boolean;
  standardValue: StandardValue;
  advancedValue: AdvancedValue;
}
export interface StandardValue {
  openings: boolean;
  endings: boolean;
  inserts: boolean;
}
export interface AdvancedValue {
  openings: number;
  endings: number;
  inserts: number;
  random: number;
}
export interface GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint {
  randomOn: boolean;
  standardValue: number;
  randomValue?: (number)[] | null;
}
export interface PlaybackSpeed {
  randomOn: boolean;
  standardValue: number;
  randomValue?: (boolean)[] | null;
}
export interface SongDifficulity {
  advancedOn: boolean;
  standardValue: StandardValue1;
  advancedValue?: (number)[] | null;
}
export interface StandardValue1 {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}
export interface SongPopularity {
  advancedOn: boolean;
  standardValue: StandardValue2;
  advancedValue?: (number)[] | null;
}
export interface StandardValue2 {
  disliked: boolean;
  mixed: boolean;
  liked: boolean;
}
export interface PlayerScoreOrAnimeScore {
  advancedOn: boolean;
  standardValue?: (number)[] | null;
  advancedValue?: (boolean)[] | null;
}
export interface Vintage {
  standardValue: StandardValue3;
  advancedValueList?: (null)[] | null;
}
export interface StandardValue3 {
  years?: (number)[] | null;
  seasons?: (number)[] | null;
}
export interface Type {
  tv: boolean;
  movie: boolean;
  ova: boolean;
  ona: boolean;
  special: boolean;
}
export interface PlayersEntity {
  name: string;
  gamePlayerId: number;
  level: number;
  avatar: Avatar;
  ready: boolean;
  inGame: boolean;
}
export interface Avatar {
  avatar: Avatar1;
  background: Background;
}
export interface Avatar1 {
  avatarId: number;
  colorId: number;
  characterId: number;
  active: number;
  avatarName: string;
  outfitName: string;
  colorName: string;
  backgroundFileName: string;
  colorActive: number;
  editor?: null;
  optionName: string;
  optionActive: boolean;
}
export interface Background {
  avatarName: string;
  outfitName: string;
  backgroundHori: string;
  backgroundVert: string;
  colorId: number;
  avatarId: number;
}

// NewRoom
export interface NewRooms {
    rooms?: (DataEntity)[] | null;
}

export interface DataEntity {
  id: number;
  host: string;
  hostAvatar: HostAvatar;
  settings: Settings;
  numberOfPlayers: number;
  numberOfSpectators: number;
  players?: (string)[] | null;
  inLobby: boolean;
  songLeft?: number | null;
}
export interface HostAvatar {
  avatar: Avatar;
  background: Background;
}
export interface Avatar {
  avatarId: number;
  colorId: number;
  characterId: number;
  active: number;
  avatarName: string;
  outfitName: string;
  colorName: string;
  backgroundFileName: string;
  colorActive: number;
  editor?: string | null;
  optionName: string;
  optionActive: boolean;
}
export interface Background {
  avatarName: string;
  outfitName: string;
  backgroundHori: string;
  backgroundVert: string;
  colorId: number;
  avatarId: number;
}
export interface Settings {
  roomName: string;
  privateRoom: boolean;
  roomSize: number;
  numberOfSongs: number;
  modifiers: Modifiers;
  songSelection: SongSelection;
  showSelection: AdvancedValueOrShowSelection;
  songType: SongType;
  guessTime: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  inventorySize: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  lootingTime: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  lives: number;
  samplePoint: GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint;
  playbackSpeed: PlaybackSpeed;
  songDifficulity: SongDifficulity;
  songPopularity: SongPopularity;
  playerScore: PlayerScoreOrAnimeScore;
  animeScore: PlayerScoreOrAnimeScore;
  vintage: Vintage;
  type: Type;
  genre?: (null)[] | null;
  gameMode: string;
}
export interface Modifiers {
  skipGuessing: boolean;
  skipReplay: boolean;
  duplicates: boolean;
  queueing: boolean;
  lootDropping: boolean;
}
export interface SongSelection {
  advancedOn: boolean;
  standardValue: number;
  advancedValue: AdvancedValueOrShowSelection;
}
export interface AdvancedValueOrShowSelection {
  watched: number;
  unwatched: number;
  random: number;
}
export interface SongType {
  advancedOn: boolean;
  standardValue: StandardValue;
  advancedValue: AdvancedValue;
}
export interface StandardValue {
  openings: boolean;
  endings: boolean;
  inserts: boolean;
}
export interface AdvancedValue {
  openings: number;
  endings: number;
  inserts: number;
  random: number;
}
export interface GuessTimeOrInventorySizeOrLootingTimeOrSamplePoint {
  randomOn: boolean;
  standardValue: number;
  randomValue?: (number)[] | null;
}
export interface PlaybackSpeed {
  randomOn: boolean;
  standardValue: number;
  randomValue?: (boolean)[] | null;
}
export interface SongDifficulity {
  advancedOn: boolean;
  standardValue: StandardValue1;
  advancedValue?: (number)[] | null;
}
export interface StandardValue1 {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}
export interface SongPopularity {
  advancedOn: boolean;
  standardValue: StandardValue2;
  advancedValue?: (number)[] | null;
}
export interface StandardValue2 {
  disliked: boolean;
  mixed: boolean;
  liked: boolean;
}
export interface PlayerScoreOrAnimeScore {
  advancedOn: boolean;
  standardValue?: (number)[] | null;
  advancedValue?: (boolean)[] | null;
}
export interface Vintage {
  standardValue: StandardValue3;
  advancedValueList?: (null)[] | null;
}
export interface StandardValue3 {
  years?: (number)[] | null;
  seasons?: (number)[] | null;
}
export interface Type {
  tv: boolean;
  movie: boolean;
  ova: boolean;
  ona: boolean;
  special: boolean;
}
export interface TagsEntity {
  id: number | string;
  state: number;
}
  
