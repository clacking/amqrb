import { useState, useEffect } from 'react';

const SavedDatas = () => {
    const [loaded, setLoaded] = useState(false);
    const [list, setList] = useState([]);

    window.electron.on('dataLoad', (e, args) => {
        setLoaded(true);
    })

    useEffect(() => {
        const load = async () => {
            const d = await window.electron.invoke('pageLoaded');
            setLoaded(true);
            setList(d);
        }
        load()
    }, [])

    if (!loaded) return <div className="DataList SideHeight midCenter">Loading</div>

    return (
        <div className="SideHeight text-center text-white">
            <h2>保存済みリスト</h2>
            {
                (list.length === 0) ? <p>保存されたリストはありません。</p> : //@ts-ignore
                        ( list.map(d => <p></p>) )

            }
        </div>
    )
}

export default SavedDatas
