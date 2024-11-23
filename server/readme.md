# Chat Server Application

A real-time chat server built with Node.js, Express, and Socket.IO that supports both public and private messaging.

## Features

- Real-time bidirectional communication using WebSocket
- Public chat messaging
- Private messaging between users
- User presence tracking (online/offline status)
- Message read receipts
- Message seen status
- REST API endpoints for user management
- Configurable CORS settings
- Comprehensive logging system

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository
2. Navigate to the server directory:
```bash
cd server
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the server root directory with the following variables:
```env
PORT=3000
HOST=localhost
CORS_ORIGIN=*
CLIENT_URL=http://localhost:5173
```

## Project Structure

```
server/
├── src/
│ ├── config/ # Configuration files
│ ├── core/ # Core server functionality
│ ├── services/ # Business logic services
│ └── types/ # TypeScript type definitions
├── package.json
└── readme.md
```


## Key Components

### WebSocketServer (core/WebSocketServer.ts)
Base server class that handles:
- Express server setup
- Socket.IO initialization
- Connection management
- CORS configuration
- Basic event handling

### ChatServer (services/ChatServer.ts)
Main chat service that implements:
- User connection management
- Message routing (public/private)
- User status updates
- Message read receipts

### Logger (services/Logger.ts)
Utility service for consistent logging across the application.

## Available Events

### Client to Server
- `user:join` - User joins the chat
- `message:send` - Send a message (public or private)
- `message:read` - Mark a message as read
- `message:seen` - Mark messages as seen by recipient

### Server to Client
- `private:message` - Receive a private message
- `message:received` - Receive a public message
- `message:status` - Message read status update
- `messages:seen` - Messages seen status update
- `users:update` - Connected users list update
- `user:left` - User disconnection notification

## API Endpoints

- `GET /users` - Retrieve list of connected users

## Running the Server

Development mode:
```bash
npm start
```


Production build:
```bash
npm run build
```


## Error Handling

The server includes comprehensive error handling:
- Socket connection errors
- Invalid message format
- User not found scenarios
- Connection management errors

## Logging

All important events are logged with timestamps using the Logger service:
- User connections/disconnections
- Message delivery issues
- System errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details