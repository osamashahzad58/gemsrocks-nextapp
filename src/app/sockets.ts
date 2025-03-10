import { io } from "socket.io-client";
import { useEffect } from "react";
import { socket_api_url } from "./constants";

const SOCKET_URL = socket_api_url;

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const useSocketEvents = (events: any) => {
    useEffect(() => {
        const eventHandlers: any = [];
        events.forEach(({ eventName, handler }: any) => {
            socket.on(eventName, handler);
            eventHandlers.push({ eventName, handler });
        });
        return () => {
            eventHandlers.forEach(({ eventName, handler }: any) => {
                socket.off(eventName, handler);
            });
        };
    }, [socket, events]);
}

export default socket;
