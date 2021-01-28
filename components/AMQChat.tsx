import { AMQChatMesasge } from '../interface/AMQRoom.interface';

const AMQChat = ({chat}: {chat: AMQChatMesasge[]}) => {
    return (
        <div className="flex flex-col">
            {chat.map(c => (
                <div key={c.messageId}>
                    <span className="">[{c.date.toLocaleTimeString()}]</span>
                    <span className="px-1">{c.sender}:</span>
                    <span className="">{c.message}</span>
                </div>
            ))}
        </div>
    );
}

export default AMQChat;
