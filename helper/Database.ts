import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import pdb from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';
import { STORE_PATH } from './AppSettings';

addRxPlugin(pdb);

const schema = {
    title: 'aa',
    version: 0,
    type: 'object',
    properties: {
        name: { type: 'string' }
    }
}

let database: null | RxDatabase;
export async function getDatabase () {
    if (!database) {
        const db = await createRxDatabase({
            name: STORE_PATH,
            adapter: leveldown,
        });
        await db.addCollections({
            aa: {
                schema
            }
        });
        database = db;
    }
    return database;
}
