import { useState } from 'react';
import { AMQChatMesasge } from '../interface/AMQRoom.interface';
import { lobby, SendGameChatMessage } from '../helper/AMQEvents';

const AMQChat = ({chat, isTeam}: {chat: AMQChatMesasge[], isTeam?: boolean}) => {
    const [chatInput, setChatInput] = useState('');

    const sendChat = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (chatInput && e.key === 'Enter') {
            e.preventDefault();
            window.electron.send('amqEmit', {
                type: lobby, command: SendGameChatMessage, data: { msg: chatInput, teamMessage: false }
            });
            setChatInput('');
        }
    }

    return (
        <div className="flex flex-col">
            {chat.map(c => (
                <div key={c.messageId}>
                    <span className="">[{c.date.toLocaleTimeString()}]</span>
                    <span className="px-1">{c.sender}:</span>
                    <span className="">{c.message}</span>
                </div>
            ))}
            <input type="text" className="text-white bg-gray-800 p-1" placeholder="Chat"
                value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={sendChat}
            />
        </div>
    );
}

export default AMQChat;
