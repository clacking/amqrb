import Discord, { Presence } from 'discord-rpc';
import { DISCORD_CLIENTID } from './AppSettings';
import { version } from '../package.json';

const scopes = ['rpc', 'rpc.api'];
export let client: Discord.Client | undefined;
let status: Presence = {
    details: `v${version}`,
    startTimestamp: new Date(),
    largeImageKey: 'amqredbook',
    largeImageText: 'AMQRB',
    instance: false
}

export async function initializeDiscord () {
    client = new Discord.Client({ transport: 'ipc' });
    client.on('ready', () => {
        client!.setActivity(status);
    });

    await client.login({ clientId: DISCORD_CLIENTID });
}

export async function setStatus(args: Presence) {
    status = {...status, ...args};
    await client?.setActivity(status);
}
