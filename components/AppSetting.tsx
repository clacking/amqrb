import { useState } from 'react';

const PROXYTYPE = ['http'];

const AppSetting = () => {
    const [proxy, setProxy] = useState('');
    const [proxyType, setProxyType] = useState('');

    return (
        <div className="h-full w-full flex">
            <main className="h-full w-full p-4 flex flex-col">
                <h1 className="text-2xl">Setting</h1>
                <div>
                    <h2 className="text-xl">Proxy</h2>
                    <div className="w-full flex">
                        <span className="w-1/2 flex">Proxy URL</span>
                        <span className="w-1/2 flex">
                            <select className="mr-1 text-black">
                                { PROXYTYPE.map((t, k) => <option key={k} value={t}>{t.toUpperCase()}</option>) }
                            </select>
                            <input className="text-black w-full" type="text" placeholder="http://user:pw@addr:port" />
                        </span>
                    </div>
                    <div className="w-full flex">
                        <span className="w-1/2 flex">
                            Proxy direction
                        </span>
                        <span className="w-1/2 flex">
                            <span>Socket <input type="checkbox" /></span>
                            <span>CDN <input type="checkbox" /></span>
                        </span>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl">Cache</h2>
                    <div className="w-full flex">
                        <span className="w-1/2 flex">Folder Path</span>
                        <input className="text-black" type="text" />
                    </div>
                    <div className="w-full flex">
                        <span className="w-1/2 flex">Store cache (Use lots of storage.)</span>
                        <input type="checkbox" />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AppSetting;
