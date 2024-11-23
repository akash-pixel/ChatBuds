'use client';

import { createContext, useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContextType, User } from '../types/socket';
import { useSocketSetup } from '../hooks/useSocketSetup';
import { initializeSocket, createMessage, createTempUser } from '../utils/socketUtils';

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    messages: [],
    sendMessage: () => { },
    currentUser: null,
    connectedUsers: [],
    selectedUser: null,
    setSelectedUser: () => { },
    joinChat: () => { },
    isAuthenticated: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { isConnected, messages, setMessages, connectedUsers } = useSocketSetup(socket, currentUser);

    useEffect(() => {
        const socket = initializeSocket(process.env.NEXT_PUBLIC_SOCKET_URL || '');
        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = (content: string, recipientId?: string) => {
        if (socket && currentUser) {
            const message = createMessage(content, currentUser, recipientId);
            socket.emit('message:send', message);
            if (!recipientId || message.userId === currentUser.id) {
                setMessages(prev => [...prev, message]);
            }
        }
    };

    const joinChat = (username: string, isAnonymous: boolean) => {
        if (socket) {
            const tempUser = createTempUser(username, isAnonymous);
            setCurrentUser(tempUser);
            socket.emit('user:join', tempUser);
            setIsAuthenticated(true);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            messages,
            sendMessage,
            currentUser,
            connectedUsers,
            selectedUser,
            setSelectedUser,
            joinChat,
            isAuthenticated
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export { SocketContext }; 