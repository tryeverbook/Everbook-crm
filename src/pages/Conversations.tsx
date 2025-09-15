import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Video, MoreHorizontal, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  clientName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar?: string;
}

export const Conversations: React.FC = () => {
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      lastMessage: 'Thank you for the venue tour! We loved the garden area.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      unread: true,
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      lastMessage: 'Can we schedule a call to discuss catering options?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      unread: false,
    },
    {
      id: '3',
      clientName: 'Emily Rodriguez',
      lastMessage: 'The contract looks good. When can we sign?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      unread: true,
    },
    {
      id: '4',
      clientName: 'David Thompson',
      lastMessage: 'We need to change the date from June to July. Is that possible?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      unread: false,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">Conversations</h1>
          <p className="text-lg text-gray-600">Chat with leads and clients in real-time.</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-champagne/30 flex flex-col">
            <div className="p-4 border-b border-champagne/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-champagne/30 border border-champagne/50 rounded-xl text-sm text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 text-left border-b border-champagne/20 hover:bg-champagne/20 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blush/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium truncate ${conversation.unread ? 'text-charcoal' : 'text-gray-700'}`}>
                          {conversation.clientName}
                        </h3>
                        {conversation.unread && (
                          <div className="h-2 w-2 bg-blush rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {format(new Date(conversation.timestamp), 'HH:mm')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-champagne/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blush to-mauve rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedConversation.clientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-charcoal">{selectedConversation.clientName}</h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl hover:bg-champagne/30 transition-colors">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-champagne/30 transition-colors">
                      <Video className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-champagne/30 transition-colors">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-xs bg-gray-100 rounded-2xl px-4 py-2">
                      <p className="text-sm text-gray-800">{selectedConversation.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(selectedConversation.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="max-w-xs bg-gradient-to-r from-blush to-mauve rounded-2xl px-4 py-2">
                      <p className="text-sm text-white">Thank you for your message! I'll get back to you shortly with more details.</p>
                      <p className="text-xs text-white/80 mt-1">
                        {format(new Date(), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-champagne/30">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        rows={2}
                        className="w-full px-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-gradient-to-r from-blush to-mauve text-white rounded-2xl shadow-soft hover:shadow-elegant transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
