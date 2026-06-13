import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const { isLoading } = useChatStore();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSend(text);
    setText('');
    
    // Maintain focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative flex items-center bg-astro-indigo bg-opacity-40 border rounded-2xl p-2 transition-all duration-300 ${focused ? 'border-astro-gold shadow-[0_0_20px_rgba(223,183,60,0.25)]' : 'border-astro-cardBorder border-opacity-70 shadow-glow'}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? "AstroAgent is reading the stars..." : "Ask about your career, daily transits, or chart placements..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isLoading}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-astro-textMain placeholder-astro-textMuted placeholder-opacity-50 focus:outline-none disabled:cursor-not-allowed font-sans"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-astro-gold to-[#f5d471] hover:from-[#cda22b] hover:to-[#dfb73c] disabled:bg-astro-indigo disabled:opacity-20 text-astro-bg rounded-xl transition duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
