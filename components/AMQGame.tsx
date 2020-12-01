import { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import userStatusSlice, { UserStatus } from '../store/userStatusSlice';
import AMQIntro from './AMQIntro';
import AMQStatus from './AMQStatus';
import AMQRoom from './AMQRoom';
import AMQQuiz from './AMQQuiz';
import AMQGameContainer from './AMQGameContainer';

const MainUI = styled.main`
    background: #0e1117;
    color: #fff;
`;

const GameContainer = styled.section`
    width: calc(100% - 200px);
`

type GameViews = 'default' | 'rooms' | 'lobby' | 'quiz' | 'br';
type GameViewType = {view: GameViews, changeView: (view: GameViews) => void };
export const GameViewContext =
    createContext<GameViewType>({} as GameViewType);

const AMQGame = () => {
    const dispatch = useDispatch();
    const [view, setView] = useState<GameViews>('default');

    const change = (view: GameViews) => setView(view);

    useEffect(() => {
        const updateUserInfo = (e:any, d: any) => {
            console.log(e,d);
            dispatch(userStatusSlice.actions.update({...d}));
        }
        window.electron.on('login complete', updateUserInfo);

        return () => {
            window.electron.removeListener('login complete', updateUserInfo);
        }
    }, [])

    return (
        <GameViewContext.Provider value={{view, changeView: change}}>
            <MainUI id="AMQGameUI" className="relative h-full w-full flex">
                <AMQStatus />
                <GameContainer>
                    {
                        (view === 'default')
                        ?   <AMQIntro />
                        : (view === 'rooms')
                        ?   <AMQRoom />
                        : (view === 'lobby' || view === 'quiz')
                        ?   <AMQGameContainer />
                        :   <div>br</div>
                    }
                </GameContainer>
            </MainUI>
        </GameViewContext.Provider>
    )
}

export default AMQGame;
