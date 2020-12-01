import { ipcMain } from 'electron';
import { AMQLoginToken, initializeAMQGame } from './AMQCore';
import { coreEmitter } from './AMQSocket';
import { Logger } from './Logger';

// Initial point of EE/Sockets.
export function bootstrapAMQGame () {
    // create listner login
    ipcMain.on('amqLogin', async (e, d) => {
        const { username, password } = d[0];
        try {
            const { token, port } = await AMQLoginToken(username, password);
            console.log('LOGGED IN', port);
            initializeAMQGame(port, token);

            coreEmitter.on('core', d => {
                e.sender.send(d.event, d.data);
            });
            e.reply('amqLoggedIn');
        } catch (err) {
            console.log(err);
            e.reply('amgLoginError', 'Failed to login.');
        }
    });

    ipcMain.on('amqEmit', async (e, d) => {
        console.log(d);
        const data = d[0];
        coreEmitter.emit('userEvent', data);
    });
}

function initialUserHandler () {

}
