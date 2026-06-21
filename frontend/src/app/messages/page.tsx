'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export default function MessagesPage() {
  const { user } = useStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    api.get('/messages/conversations').then(setConversations).catch(() => {});
  }, []);

  const openChat = async (userId: string) => {
    setSelectedChat(userId);
    const msgs = await api.get(`/messages/${userId}`);
    setMessages(msgs);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    const msg = await api.post(`/messages/${selectedChat}`, { content: newMessage });
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (!user) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Please login.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="grid md:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations list */}
        <div className="bg-white rounded-lg shadow overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">No conversations</p>
          ) : conversations.map((conv: any) => (
            <button key={conv._id} onClick={() => openChat(conv._id.replace(user.id, '').replace('_', ''))}
              className="w-full p-4 text-left border-b hover:bg-gray-50">
              <p className="font-medium text-sm">{conv.lastMessage?.content?.slice(0, 50)}</p>
              {conv.unread > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">{conv.unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg: any) => (
                  <div key={msg._id} className={`flex ${msg.sender?._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender?._id === user.id ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..." className="flex-1 border rounded-lg px-3 py-2" />
                <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Send</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}
