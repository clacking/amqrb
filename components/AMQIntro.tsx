import styled from 'styled-components';
import { useState, useContext } from 'react';
import AMQRoomSetting from './AMQRoomSetting';
import { GameViewContext } from './AMQGame';
import { AMQEventType, GetRooms, JoinRankedGame } from '../helper/AMQEvents';
const { roombrowser } = AMQEventType;

const SelectUI = styled.section`
    z-index: 11;
`;

const GameButton = styled.button`
`;

const AMQIntro = () => {
    const { changeView } = useContext(GameViewContext);
    const [isOpen, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const browseRoom = () => {
        changeView('rooms');
        window.electron.send('amqEmit', {
            type: roombrowser, command: GetRooms
        });
    }

    const joinRanked = () => {
        changeView('quiz');
        window.electron.send('amqEmit', {
            type: roombrowser, command: JoinRankedGame
        });
    }

    return (
        <SelectUI id="GameUI" className="h-full w-full flex flex-row justify-center items-centers relative">
            <div className="m-auto z-20">
                <h1 className="text-2xl text-center font-thin">AMQ</h1>
                <GameButton onClick={browseRoom} className="p-4 border rounded border-gray-400 m-4">
                    Browse Rooms
                </GameButton>
                <GameButton onClick={()=>setOpen(true)} className="p-4 border rounded border-gray-400 m-4">
                    Create Room
                </GameButton>
                <GameButton className="p-4 border rounded border-gray-400 m-4">
                    Play Ranked
                </GameButton>
            </div>
            <AMQRoomSetting isOpen={isOpen} onClose={()=>setOpen(!isOpen)} />
        </SelectUI>
    )
}

export default AMQIntro;
