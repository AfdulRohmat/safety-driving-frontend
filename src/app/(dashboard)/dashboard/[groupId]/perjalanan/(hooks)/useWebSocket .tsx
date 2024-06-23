import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (namespace: any, eventHandlers: any) => {
    const [socket, setSocket] = useState<any>(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = io(`ws://localhost:2020${namespace}`, {
            port: 80
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket server:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        // Set up event handlers
        Object.keys(eventHandlers).forEach((event) => {
            socket.on(event, (data) => {
                eventHandlers[event](data, setMessages);
            });
        });

        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, [namespace, eventHandlers]);

    return { socket, messages };
};

export default useWebSocket;
