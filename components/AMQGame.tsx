import { useState, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import userStatusSlice, { UserStatus } from '../store/userStatusSlice';
import AMQIntro from './AMQIntro';
import AMQStatus from './AMQStatus';
import AMQRoom from './AMQRoom';
import AMQQuiz from './AMQQuiz';
import AMQGameContainer from './AMQGameContainer';
import { LoginComplete, ServerRestart, PopoutMessage } from '../helper/AMQEvents';

const MainUI = styled.main`
    background: #0e1117;
    color: #fff;
`;

const GameContainer = styled.section`
    width: calc(100% - 200px);
    display: flex;
`

type GameViews = 'default' | 'rooms' | 'lobby' | 'quiz' | 'br';
type GameViewType = {view: GameViews, changeView: (view: GameViews) => void };
export const GameViewContext =
    createContext<GameViewType>({} as GameViewType);

const AMQGame = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const [view, setView] = useState<GameViews>('default');

    const change = (view: GameViews) => setView(view);

    useEffect(() => {
        const showEvent = (e: any, d: any) => {
            toast({
                title: `Sever restart at ${d.time} min`,
                description: `${d.msg}`,
                status: 'warning',
                isClosable: true
            });
        }

        window.electron.on(ServerRestart, showEvent);

        return () => window.electron.removeAllListeners(ServerRestart);
    });

    useEffect(() => {
        const popup = (e: any, d: any) => {
            toast({
                title: `${d.header}`,
                description: `${d.message}`,
                status: 'info',
                isClosable: true
            });
        }

        window.electron.on(PopoutMessage, popup);
        
        return () => window.electron.removeAllListeners(PopoutMessage);
    });

    useEffect(() => {
        const updateUserInfo = (e:any, d: any) => {
            console.log(e,d);
            const data = ({xpInfo, level, self, malName, malLastUpdate, aniList, aniListLastUpdate, kitsu, kitsuLastUpdate, credits, tickets, rhythm, avatar, settings}: UserStatus) =>
                ({xpInfo, level, self, malName, malLastUpdate, aniList, aniListLastUpdate, kitsu, kitsuLastUpdate, credits, tickets, rhythm, avatar, settings});
            dispatch(userStatusSlice.actions.update({...data(d)}));
        }
        window.electron.once(LoginComplete, updateUserInfo);
    }, []);

    return (
        <GameViewContext.Provider value={{view, changeView: change}}>
            <MainUI id="AMQGameUI" className="h-full w-full flex">
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
