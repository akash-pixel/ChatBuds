import { io } from 'socket.io-client';
import { Message, User } from '../types/socket';

export const initializeSocket = (socketUrl: string) => {
    return io(socketUrl, {
        transports: ['websocket'],
    });
};

export const createMessage = (content: string, currentUser: User, recipientId?: string): Message => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        content,
        userId: currentUser.id,
        username: currentUser.username,
        timestamp: new Date(),
        recipientId,
        isPrivate: !!recipientId
    };
};

export const createTempUser = (username: string, isAnonymous: boolean): User => {
    return {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        username: isAnonymous ? 'Anonymous' : username,
        isOnline: true
    };
}; 