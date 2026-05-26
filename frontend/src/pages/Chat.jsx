import React, { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useStreaming } from '../hooks/useStreaming';
import { api } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import { Sparkles, Calendar, Clock, MapPin, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Chat({ onBack }) {
  const { birthDetails, userId, messages, setMessages, clearChat, setIsLoading } = useChatStore();
  const { sendMessageStream } = useStreaming();

  // Load chat history from SQLite on load
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.getChatHistory(userId);
        if (response.success && response.history) {
          setMessages(response.history);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [userId, setMessages]);

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your cosmic consultation history?')) {
      try {
        await api.clearChat(userId);
        clearChat();
      } catch (err) {
        console.error('Failed to clear chat:', err);
      }
    }
  };

  const formattedChart = birthDetails?.chart || {};
  const planets = formattedChart.planets || {};

  return (
    <div className="flex flex-col md:flex-row h-[90vh] max-w-7xl mx-auto w-full gap-6 px-4 py-4 md:py-6 overflow-hidden">
      
      {/* Sidebar Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0">
        
        {/* Navigation Action */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-astro-textMuted hover:text-astro-gold transition cursor-pointer self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Change Birth Details</span>
        </button>

        {/* Natal Profile Card */}
        <div className="bg-astro-card border border-astro-cardBorder rounded-2xl p-5 shadow-glow relative overflow-hidden">
          
          <div className="absolute top-0 right-0 h-16 w-16 bg-astro-gold opacity-5 blur-2xl rounded-full"></div>
          
          <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-4 flex items-center gap-1.5 font-sans">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Natal Blueprint</span>
          </h3>

          {/* Profile details list */}
          <div className="space-y-3 text-sm font-sans mb-5">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-astro-textMuted flex-shrink-0" />
              <span className="truncate text-astro-textMain">{birthDetails?.place}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-astro-textMuted flex-shrink-0" />
              <span className="text-astro-textMain">{birthDetails?.dob}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-astro-textMuted flex-shrink-0" />
              <span className="text-astro-textMain">{birthDetails?.time} ({birthDetails?.timezone})</span>
            </div>
          </div>

          <hr className="border-astro-cardBorder border-opacity-35 my-4" />

          {/* Golden Chart Summary Card */}
          <h4 className="text-xs font-semibold text-astro-textMuted uppercase tracking-wider mb-3 font-sans">
            Key Alignments
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-20 rounded-xl">
              <div className="text-[10px] text-astro-textMuted uppercase">Rising</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{birthDetails?.chart?.ascendant || 'Unknown'}</div>
            </div>
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-20 rounded-xl">
              <div className="text-[10px] text-astro-textMuted uppercase">Sun</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{birthDetails?.chart?.sun || 'Unknown'}</div>
            </div>
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-20 rounded-xl">
              <div className="text-[10px] text-astro-textMuted uppercase">Moon</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{birthDetails?.chart?.moon || 'Unknown'}</div>
            </div>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleClearChat}
          className="mt-auto flex items-center justify-center gap-2 py-3 border border-red-500 border-opacity-30 text-red-400 hover:bg-red-950 hover:bg-opacity-20 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-astro-card border border-astro-cardBorder rounded-2xl flex flex-col shadow-glow overflow-hidden">
        
        {/* Chat header */}
        <div className="px-6 py-4 bg-astro-indigo bg-opacity-25 border-b border-astro-cardBorder border-opacity-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-astro-indigo border border-astro-cardBorder border-opacity-40 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-astro-gold animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-astro-textMain font-sans">AstroAgent Consultant</h2>
              <p className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                <span>Active celestial reasoning loop</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages scroll area */}
        <ChatWindow />

        {/* Message Input box */}
        <div className="p-4 border-t border-astro-cardBorder border-opacity-30 bg-astro-indigo bg-opacity-10">
          <ChatInput onSend={sendMessageStream} />
        </div>
      </div>
    </div>
  );
}
