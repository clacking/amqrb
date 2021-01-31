import { useState, useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

const AMQLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logging, setLogging] = useState(false);
    const toast = useToast();

    const submitLogin = () => {
        setLogging(true);
        window.electron.send('amqLogin', { username, password });
    }

    useEffect(() => {
        const loginFail = (e: any, args: any) => {
            toast({
                title: 'Failed to login.', status: 'error', isClosable: true
            });
            setLogging(false);
        }
        window.electron.on('amgLoginError', loginFail);
        return () => window.electron.removeAllListeners('amgLoginError');
    }, [logging]);

    return (
        <div className="object-center w-full h-full flex flex-col justify-center items-center">
            <h1 className="align-left">AMQ Login</h1>
            <div className="m-2">
                <input type="text" placeholder="Username" value={username}
                    className="border m-2 p-2 rounded bg-gray-800 border-purple-500"
                    onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password}
                    className="border m-2 p-2 rounded bg-gray-800 border-purple-500"
                    onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="text-white px-4 py-2 bg-purple-400 rounded"
                onClick={() => submitLogin()} disabled={logging}>
                    { logging ? <Spinner /> : 'Login' }
            </button>
        </div>
    )
}

export default AMQLogin;
