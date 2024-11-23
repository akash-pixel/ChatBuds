import { Socket } from "socket.io-client";

export interface User {
    id: string;
    username: string;
    isOnline: boolean;
}

export interface Message {
    id: string;
    content: string;
    userId: string;
    username: string;
    timestamp: Date;
    recipientId?: string;
    isPrivate: boolean;
}

export interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    messages: Message[];
    sendMessage: (content: string, recipientId?: string) => void;
    currentUser: User | null;
    connectedUsers: User[];
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
    joinChat: (username: string, isAnonymous: boolean) => void;
    isAuthenticated: boolean;
} 