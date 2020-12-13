import { addRxPlugin, createRxDatabase, RxDatabase, RxDocument, RxJsonSchema, RxCollection } from 'rxdb';
import pdb from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';
import { STORE_PATH } from './AppSettings';

addRxPlugin(pdb);

type SongType = {
    animeNameEnglish: string;
    animeNameRomaji: string;
    artist: string;
    songName: string;
    url: { res: number; url: string; }[];
    annId: number;
}

const SongScheme: RxJsonSchema<SongType> = {
    title: 'song',
    version: 0,
    type: 'object',
    properties: {
        animeNameEnglish: { type: 'string' },
        animeNameRomaji: { type: 'string' },
        artist: { type: 'string' },
        songName: { type: 'string' },
        url: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    res: { type: 'integer' },
                    url: { type: 'string' }
                }
            }
        },
        annId: { type: 'integer' },
    }
}

type SongDocument = RxCollection<SongType>;

type AMQCollections = {
    song: SongDocument,
}

let database: RxDatabase<AMQCollections> | null;
export async function getDatabase () {
    if (!database) {
        const db = await createRxDatabase<AMQCollections>({
            name: STORE_PATH,
            adapter: leveldown,
        });
        await db.addCollections({
            song: {
                schema: SongScheme
            },
        });
        database = db;
    }
    return database;
}
