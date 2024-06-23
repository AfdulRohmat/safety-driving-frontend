import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const useCustomWebSocket = (url: string, eventHandlers: any) => {
    const [messages, setMessages] = useState<any[]>([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(url);

    useEffect(() => {
        if (lastMessage !== null) {
            const message = JSON.parse(lastMessage.data);
            const { event: eventType, data } = message;
            if (eventHandlers[eventType]) {
                eventHandlers[eventType](data, setMessages);
                console.log('====================================');
                console.log(`event: ${eventType}`);
                console.log('====================================');
            } else {
                console.warn(`No handler for event: ${eventType}`);
            }
        }
    }, [lastMessage, eventHandlers]);

    return { sendMessage, messages, readyState };
};

export default useCustomWebSocket;
