import { useState, useEffect, useRef } from 'react';

export function useSSE(url: string) {
    const [data, setData] = useState<any[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const [isClose, setIsClose] = useState(false)

    useEffect(() => {
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data); // Parse incoming data
                setData(newData);
            } catch (error) {
                console.error('Failed to parse SSE data:', error);
            }
        };


        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            console.error('EventSource readyState:', eventSource.readyState);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    const closeConnection = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        setIsClose(true)
        console.log("closeConnection");

    };

    return { data, closeConnection, isClose };
}
