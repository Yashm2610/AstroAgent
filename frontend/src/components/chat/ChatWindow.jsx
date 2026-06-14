import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import ChatBubble from './ChatBubble';
import ToolActivity from './ToolActivity';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ChatWindow({ searchFilter }) {
  const { messages, isLoading, activeTools } = useChatStore();
  const scrollRef = useRef(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeTools]);

  const filteredMessages = searchFilter
    ? messages.filter(msg => msg.content.toLowerCase().includes(searchFilter.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-[400px]">
      {filteredMessages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 mt-12">
          <div className="h-16 w-16 rounded-full bg-astro-indigo border border-astro-cardBorder flex items-center justify-center mb-4 shadow-glow pulsing-border">
            <Sparkles className="h-8 w-8 text-astro-gold" />
          </div>
          <h3 className="text-lg font-bold text-gold-gradient font-sans">Your Cosmic Consultation</h3>
          <p className="text-sm text-astro-textMuted max-w-sm mt-2 font-sans">
            {searchFilter ? "No messages matching your search query." : "Ask about your strengths, transits today, Saturn lessons, or career alignments. Your astrological chart is cast and loaded!"}
          </p>
        </div>
      ) : (
        filteredMessages.map((msg, idx) => <ChatBubble key={idx} message={msg} />)
      )}

      {/* Live Tool Activity Stream */}
      <ToolActivity />

      {/* Typing indicator (only shown if loading but no tool execution is outputting and no text chunk is writing) */}
      {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <div className="flex gap-2 items-center text-xs text-astro-textMuted ml-12 font-mono">
          <Loader2 className="animate-spin h-3.5 w-3.5 text-astro-gold" />
          <span>Consulting cosmic currents...</span>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
}
