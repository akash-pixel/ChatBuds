import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, ChatMessage } from '../../server/src/types/socket.types';

export class SocketClient {
    private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
    private userId: string;

    constructor(serverUrl: string, userId?: string) {
        this.userId = userId ?? '';

        this.socket = io(serverUrl, {
            auth: {
                userId
            }
        });


        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.socket.on('message:received', (message: ChatMessage) => {
            if (message.userId === this.userId)
                console.log('Received data:', message, this.userId);
            return;

            console.log('Received data:', message);
        });
    }
}
