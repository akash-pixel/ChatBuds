"use client";
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { User, Message } from '../types/socket';

export const useSocketSetup = (socket: Socket | null, currentUser: User | null) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('message:received', (message: Message) => {


            setMessages(prev => {
                if (prev.length && isPreviousMessageSame(prev[prev.length - 1], message)) {
                    return prev;
                }
                console.log(`prev: ${JSON.stringify(prev[prev.length - 1])}, message: ${JSON.stringify(message)}`);
                return [...prev, message]
            });
        });
        socket.on('private:message', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message:received');
            socket.off('private:message');
        };
    }, [socket]);

    const isPreviousMessageSame = (prevMessage: Message, newMessage: Message) => {

        console.log(`prevMessage: ${JSON.stringify(prevMessage)}, newMessage: ${JSON.stringify(newMessage)}`);

        return prevMessage.userId === newMessage.userId
            && prevMessage.content === newMessage.content;
    }

    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleUsersUpdate = (users: User[]) => {
            const filteredUsers = users.filter(user =>
                user.isOnline && user.id !== currentUser.id
            );
            setConnectedUsers(filteredUsers);
        };

        socket.on('users:update', handleUsersUpdate);

        return () => {
            socket.off('users:update', handleUsersUpdate);
        };
    }, [socket, currentUser]);

    return { isConnected, messages, setMessages, connectedUsers };
}; 