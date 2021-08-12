import { useState, useEffect } from 'react';
import { AMQChatMesasge } from '../interface/AMQRoom.interface';
import { lobby, SendGameChatMessage } from '../helper/AMQEvents';
import AMQChat from './AMQChat';

// Chat for header button
function ChatBox ({chat, isTeam}: {chat: AMQChatMesasge[], isTeam?: boolean}) {
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        setUnread(unread+1);
    }, [chat]);

    const clearUnread = () => setUnread(0);

    return (
        <span className="dropdown dropdown-end">
            <span className="indicator">
                <button className="border px-4 py-1 mx-1" onClick={clearUnread}>Chat</button>
                { (unread > 0) && <div className="indicator-item badge badge-secondary indicator-bottom indicator-center">{unread}</div> }
            </span>
            <div className="dropdown-content w-56 h-60">
                <AMQChat chat={chat} />
            </div>
        </span>
    )
}

export default ChatBox;
