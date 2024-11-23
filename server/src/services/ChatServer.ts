import { WebSocketServer } from '../core/WebSocketServer';
import { ChatMessage, User } from '../types/socket.types';
import { Logger } from './Logger';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { Request, Response } from 'express';

export class ChatServer extends WebSocketServer {
    private connectedUsers: Map<string, User>;

    constructor() {
        super();
        this.connectedUsers = new Map();
    }

    protected setupRoutes(): void {
        this.app.get('/users', (_: Request, res: Response) => {
            res.json(Array.from(this.connectedUsers.values()));
        });
    }

    protected setupEventListeners(): void {
        this.eventEmitter.on('user:disconnected', (userId: string) => {
            this.handleUserDisconnect(userId);
        });
    }

    protected override handleConnection(socket: Socket): void {
        super.handleConnection(socket);

        socket.on('user:join', (user: User) => {
            this.connectedUsers.set(user.id, {
                ...user,
                isOnline: true,
                socketId: socket.id
            });

            socket.data.user = { ...user, socketId: socket.id };

            this.broadcastUserList();

            Logger.log(`User ${user.username} (${user.id}) joined`);
        });

        socket.on('message:send', (message: ChatMessage) => {

            const finalMessage = {
                ...message,
                id: uuidv4(),
                timestamp: Date.now()
            };

            if (message.recipientId) {
                this.handlePrivateMessage(finalMessage);
            } else {
                this.handlePublicMessage(finalMessage);
            }
        });

        socket.on('disconnect', () => {
            if (socket.data.user) {
                this.handleUserDisconnect(socket.data.user.id);
            }
        });

        socket.on('message:read', (messageId: string) => {
            const user = socket.data.user;
            if (!user) return;

            this.io.emit('message:status', {
                messageId,
                isRead: true,
                readBy: user.id
            });
        });

        socket.on('message:seen', (userId: string) => {
            const recipientSocket = this.connections.get(userId);
            if (recipientSocket) {
                recipientSocket.emit('messages:seen', socket.data.user?.id);
            }
        });
    }

    private handlePrivateMessage(message: ChatMessage): void {
        if (!message.recipientId || !message.userId) {
            Logger.log(`Invalid private message: missing recipient or sender ID`);
            return;
        }

        const finalMessage = {
            ...message,
            isPrivate: true,
            isRead: false,
        };

        const senderSocket = this.connections.get(message.userId);

        const recipient = this.connectedUsers.get(message.recipientId);
        if (!recipient) {
            senderSocket?.emit('message:error', {
                error: 'User not found',
                originalMessage: message
            });
            Logger.log(`Recipient ${message.recipientId} not found`);
            return;
        }

        const recipientSocket = this.connections.get(recipient.socketId);
        if (recipientSocket) {
            recipientSocket.emit('private:message', finalMessage);
        } else {
            Logger.log(`Recipient ${message.recipientId} is offline`);
        }

        if (senderSocket) {
            senderSocket.emit('private:message', {
                ...finalMessage,
                isRead: true
            });
        }
    }

    private handlePublicMessage(message: ChatMessage): void {
        this.io.emit('message:received', message);
    }

    private handleUserDisconnect(userId: string): void {
        this.connectedUsers.delete(userId);

        this.io.emit('user:left', userId);

        this.broadcastUserList();

        Logger.log(`User ${userId} disconnected`);
    }

    private broadcastUserList(): void {
        const users = Array.from(this.connectedUsers.values());
        this.io.emit('users:update', users);
    }


} 