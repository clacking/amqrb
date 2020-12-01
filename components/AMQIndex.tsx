import { useState, useEffect } from 'react';
import AMQLogin from './AMQLogin';
import AMQGame from './AMQGame';

const AMQCore = () => {
    const [view, setView] = useState<'login' | 'index'>('login');

    useEffect(() => {
        const loggedIn = () => {
            console.log('Logged in')
            setView('index');
        }
        window.electron.on('amqLoggedIn', loggedIn);

        return () => {
            window.electron.removeListener('amqLoggedIn', loggedIn);
        }
    }, []);

    return view === 'login' ? <AMQLogin /> : <AMQGame />
}

export default AMQCore;
