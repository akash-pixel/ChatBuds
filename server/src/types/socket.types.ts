export interface User {
    id: string;
    username: string;
    isOnline: boolean;
    socketId: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: number;
    recipientId?: string;
    isPrivate?: boolean;
    isRead?: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    participants: string[];
}

export interface ServerToClientEvents {
    'message:received': (message: ChatMessage) => void;
    'private:message': (message: ChatMessage) => void;
    'message:error': (error: MessageError) => void;
    'message:status': (status: { messageId: string; isRead: boolean; readBy: string }) => void;
    'messages:seen': (userId: string) => void;
    'message:send': (message: ChatMessage) => void;
    'users:update': (users: User[]) => void;
    'user:joined': (user: User) => void;
    'user:left': (userId: string) => void;
    'error': (message: string) => void;
}

export interface ClientToServerEvents {
    'message:send': (message: ChatMessage) => void;
    'message:read': (messageId: string) => void;
    'message:seen': (userId: string) => void;
    'user:join': (user: User) => void;
    'disconnect': () => void;
}

export interface SocketData {
    user?: User;
}

export interface MessageError {
    error: string;
    originalMessage: ChatMessage;
} 