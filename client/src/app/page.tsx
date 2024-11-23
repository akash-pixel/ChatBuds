'use client';
import { useSocket } from "@/hooks/useSocket";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const {
    messages,
    sendMessage,
    currentUser,
    isConnected,
    connectedUsers,
    selectedUser,
    setSelectedUser,
    joinChat,
    isAuthenticated
  } = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const filteredMessages = messages.filter((message) => {
    if (!selectedUser) {
      return !message.recipientId;
    }
    return (
      (message.userId === selectedUser.id && message.recipientId === currentUser?.id) ||
      (message.userId === currentUser?.id && message.recipientId === selectedUser.id)
    );
  });

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnonymous || username.trim()) {
      joinChat(username, isAnonymous);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, selectedUser?.id);
      setNewMessage("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Join Chat
          </h1>
          <form onSubmit={handleJoinChat} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isAnonymous}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                placeholder="Enter your username"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Join as Anonymous
              </label>
            </div>
            <button
              type="submit"
              disabled={!isAnonymous && !username.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Chat App</h1>
          <div className="flex items-center gap-4">
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentUser?.username || 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Users Panel */}
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Chat Rooms
              </h2>

              {/* Public Chat Option */}
              <div
                onClick={() => setSelectedUser(null)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${!selectedUser ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">All</span>
                </div>
                <span className="text-sm font-medium">Public Chat</span>
              </div>

              <h2 className="text-lg font-semibold text-gray-800 dark:text-white my-4">
                Online Users ({connectedUsers.length})
              </h2>

              {/* Users List */}
              <div className="space-y-2">
                {connectedUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedUser ? `Chat with ${selectedUser.username}` : 'Public Chat'}
              </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2.5 ${message.userId === currentUser?.id ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div className={`flex flex-col gap-1 max-w-[320px] ${message.userId === currentUser?.id ? 'items-end' : 'items-start'
                    }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {message.userId === currentUser?.id ? 'You' : message.username}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`p-3 rounded-lg ${message.userId === currentUser?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}>
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Type a message... ${selectedUser ? `to ${selectedUser.username}` : '(Public)'}`}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none text-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
