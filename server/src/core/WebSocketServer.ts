import express, { Application } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { EventEmitter } from 'events';
import { ServerToClientEvents, ClientToServerEvents, SocketData } from '../types/socket.types';
import cors from 'cors';
import "dotenv"
import { config } from '../config/config';
import { Logger } from '../services/Logger';

export abstract class WebSocketServer {
    protected app: Application;
    protected server: HttpServer;
    protected io!: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
    protected connections: Map<string, Socket>;
    protected eventEmitter: EventEmitter;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.connections = new Map();
        this.eventEmitter = new EventEmitter();

        this.setupMiddleware();
        this.initializeSocket();
        this.setupRoutes();
        this.setupEventListeners();
    }

    private setupMiddleware(): void {
        this.app.use(cors({
            origin: config.CLIENT_URL,
            methods: ['GET', 'POST']
        }));
        this.app.use(express.json());
    }

    protected abstract setupRoutes(): void;
    protected abstract setupEventListeners(): void;

    private initializeSocket(): void {
        this.io = new Server(this.server, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', this.handleConnection.bind(this));
    }

    protected getSocket(userId: string): Socket | undefined {
        return this.connections.get(userId);
    }

    protected handleConnection(socket: Socket): void {
        const userId = socket.handshake.auth.userId || socket.id;
        this.connections.set(userId, socket);

        socket.on('disconnect', () => {
            Logger.log(`User ${userId} disconnected`);
            this.connections.delete(userId);
            this.eventEmitter.emit('user:disconnected', userId);
        });

        socket.on('error', (error) => {
            console.error(`Socket error for user ${userId}:`, error);
        });
    }

    public start(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
} 
