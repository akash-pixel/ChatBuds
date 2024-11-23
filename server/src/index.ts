import { ChatServer } from './services/ChatServer';
import { config } from './config/config';
import { Logger } from './services/Logger';

const chatServer = new ChatServer();
chatServer.start(config.PORT as number);
Logger.log(`Chat server started on port ${config.PORT}`);