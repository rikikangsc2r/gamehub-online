import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-display font-bold mb-2 text-gray-800 border-b border-gray-200 pb-2">Chat Room</h2>
      <div className="flex-grow overflow-y-auto pr-2">
        {messages.length === 0 ? (
           <div className="flex h-full items-center justify-center text-gray-400">
             Belum ada pesan.
           </div>
        ) : (
          messages.map((msg, index) => (
          <div key={index} className="mb-2 animate-slide-in-up">
            <span className="font-bold text-primary-500">{msg.from}: </span>
            <span className="text-gray-700 break-words">{msg.message}</span>
          </div>
        )))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-grow px-3 py-2 bg-gray-100 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white font-bold rounded-r-lg hover:bg-primary-600 focus:outline-none"
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default Chat;