import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePartner } from '../hooks/usePartner';
import { Send, Loader2, Home as HomeIcon } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function Chat() {
  const { user } = useAuth();
  const { partner } = usePartner();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50); // Limit to last 50 for performance

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => [...prev, newMsg]);

        // Optional: Play sound if not in Home Mode and message is from partner
        // if (newMsg.sender_id !== user.id && !profile?.is_home_mode) {
        //   playSound();
        // }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage(''); // Optimistic clear

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        content: content,
      });

    if (error) {
      console.error('Error sending message:', error);
      // Ideally show error toast
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const isPartnerHome = partner?.is_home_mode;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]"> {/* Adjust height for bottom nav */}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Chat</h2>
        {isPartnerHome && (
          <span className="text-xs flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            <HomeIcon size={12} /> She's in Home Mode (Silent)
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div
              key={msg.id}
              className={clsx(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={clsx(
                  "px-4 py-2 rounded-2xl shadow-sm text-sm break-words",
                  isMe
                    ? "bg-gradient-to-r from-pastel-pink to-pink-200 text-gray-800 rounded-br-none"
                    : "bg-white text-gray-700 rounded-bl-none border border-gray-100"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {format(new Date(msg.created_at), 'h:mm a')}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center pb-24 md:pb-4" // Extra padding for bottom nav on mobile
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isPartnerHome ? "Send a silent message..." : "Type a message..."}
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-pink bg-gray-50"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="p-2 bg-pastel-pink rounded-full text-white shadow-md disabled:opacity-50 hover:bg-pink-300 transition-colors"
        >
          {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
