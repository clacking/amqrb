import { useState } from 'react';

const Login = () => {
    const [logged, setLogged] = useState(false);
    const [token, setToken] = useState('');

    const submitLogin = async () => {
        window.electron.send('windowLoaded', token);
    }

    const startLogin = () => {
        window.electron.send('startLogin');
        setLogged(true);
    }

    return (
        !logged ? (
            <div className="midCenter w-full">
                <p>ログイントークンを取得してください</p>
                <p><button className="border px-4 py-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => startLogin()}>取得</button></p>
            </div>
        ) : (
            <div className="midCenter w-full">
                <p>トークンを入れてください</p>
                <input className="border-solid border-4 border-gray-600" type="text" value={token} onChange={e => setToken(e.target.value)} />
                <p>
                    <button className="border px-4 py-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => startLogin()}>取得</button>
                    <button className="border px-4 py-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => submitLogin()}>ログイン</button>
                </p>
            </div>
        )
    )
}

export default Login;
