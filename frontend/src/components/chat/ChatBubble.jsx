import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { User, Sparkles, Star, Copy, Check } from 'lucide-react';

const MarkdownPre = ({ children }) => {
  const [codeCopied, setCodeCopied] = useState(false);
  
  const getCodeText = (child) => {
    if (!child) return '';
    if (typeof child === 'string') return child;
    if (Array.isArray(child)) return child.map(getCodeText).join('');
    if (child.props && child.props.children) return getCodeText(child.props.children);
    return '';
  };
  
  const codeText = getCodeText(children);

  const copyCode = () => {
    navigator.clipboard.writeText(codeText);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="relative my-3 border border-astro-cardBorder border-opacity-20 rounded-lg overflow-hidden bg-[#07080f] font-mono">
      <div className="flex justify-between items-center px-4 py-1.5 bg-[#0a0b16] border-b border-astro-cardBorder border-opacity-15 text-[10px] text-astro-textMuted select-none">
        <span className="text-[9px] uppercase tracking-wider font-bold">Code</span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 hover:text-astro-gold transition-colors cursor-pointer focus:outline-none"
        >
          {codeCopied ? (
            <>
              <Check className="h-2.5 w-2.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-2.5 w-2.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-[#ffe596] m-0 bg-transparent">
        {children}
      </pre>
    </div>
  );
};

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const reactionKey = `reactions_${message.id || message.content.substring(0, 32)}`;
  const [activeReactions, setActiveReactions] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(reactionKey);
    if (saved) {
      setActiveReactions(JSON.parse(saved));
    }
  }, [reactionKey]);

  useEffect(() => {
    if (isUser) return;
    const journal = JSON.parse(localStorage.getItem('astroagent_journal') || '[]');
    setIsBookmarked(journal.some(item => item.id === message.id || item.text === message.content));
  }, [message.content, isUser, message.id]);

  const toggleBookmark = () => {
    const journal = JSON.parse(localStorage.getItem('astroagent_journal') || '[]');
    if (isBookmarked) {
      const next = journal.filter(item => item.text !== message.content);
      localStorage.setItem('astroagent_journal', JSON.stringify(next));
      setIsBookmarked(false);
    } else {
      const entry = {
        id: message.id || `entry_${Date.now()}`,
        text: message.content,
        timestamp: Date.now()
      };
      journal.push(entry);
      localStorage.setItem('astroagent_journal', JSON.stringify(journal));
      setIsBookmarked(true);
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReaction = (emoji) => {
    const next = { ...activeReactions, [emoji]: !activeReactions[emoji] };
    setActiveReactions(next);
    localStorage.setItem(reactionKey, JSON.stringify(next));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex w-full gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot Icon */}
      {!isUser && (
        <div className="h-8.5 w-8.5 rounded-full bg-astro-indigo border border-astro-cardBorder flex items-center justify-center flex-shrink-0 shadow-glow select-none">
          <Sparkles className="h-4 w-4 text-astro-gold" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm font-sans relative group ${
          isUser
            ? 'bg-gradient-to-tr from-astro-purple to-[#8c66ff] text-astro-textMain rounded-tr-none shadow-glow border border-white border-opacity-10'
            : 'bg-astro-card bg-opacity-80 border border-astro-cardBorder text-astro-textMain rounded-tl-none shadow-glow'
        }`}
      >
        {/* Bookmark and reactions tray */}
        {!isUser && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition duration-200 bg-[#0d0e26] border border-astro-cardBorder border-opacity-35 px-2 py-0.5 rounded-full shadow-glow">
            <button
              onClick={toggleBookmark}
              className="p-0.5 rounded hover:bg-astro-indigo hover:text-astro-gold text-astro-textMuted cursor-pointer"
              title="Bookmark insight"
            >
              <Star className={`h-3 w-3 ${isBookmarked ? 'fill-astro-gold text-astro-gold' : 'text-astro-textMuted'}`} />
            </button>
            
            {['✨', '🪐', '🔮', '🙏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => toggleReaction(emoji)}
                className={`p-0.5 rounded hover:bg-astro-indigo text-[10px] cursor-pointer transition ${activeReactions[emoji] ? 'bg-astro-indigo scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Active reactions bubble summary */}
        {Object.entries(activeReactions).some(([_, active]) => active) && (
          <div className="absolute -bottom-2.5 right-4 flex gap-1 bg-[#0d0e26] border border-astro-cardBorder border-opacity-35 px-1.5 py-0.5 rounded-full text-[9px] shadow-glow">
            {Object.entries(activeReactions).map(([emoji, active]) => active && (
              <span key={emoji}>{emoji}</span>
            ))}
          </div>
        )}

        {/* Glow point behind bot bubble */}
        {!isUser && (
          <div className="absolute -top-10 -left-10 h-24 w-24 bg-astro-gold opacity-[0.03] blur-xl rounded-full pointer-events-none"></div>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-astro-textMain leading-relaxed space-y-2 text-[13px] pr-2">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-none pl-0 mb-3.5 space-y-1.5 [&>li]:relative [&>li]:pl-4 [&>li]:before:content-['✦'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-astro-gold [&>li]:before:text-[8px] [&>li]:before:top-[0px]" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3.5 space-y-1.5" {...props} />,
                li: ({ node, ...props }) => <li className="text-astro-textMain leading-relaxed text-[13px] hover:text-astro-gold transition-colors duration-250" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-astro-gold font-extrabold bg-astro-gold bg-opacity-[0.06] border border-astro-gold border-opacity-15 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(223,183,60,0.04)]" {...props} />,
                code: ({ node, ...props }) => <code className="bg-astro-indigo border border-astro-cardBorder border-opacity-25 px-1.5 py-0.5 rounded text-[11px] text-[#ffe596] font-mono" {...props} />,
                pre: ({ node, ...props }) => <MarkdownPre {...props} />,
                hr: ({ node, ...props }) => <hr className="border-astro-cardBorder border-opacity-20 my-4" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-sm font-bold text-astro-gold uppercase tracking-wider mb-2 mt-1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-1.5" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-[11px] font-bold text-astro-gold uppercase tracking-wide mb-1" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute bottom-2.5 right-2.5 p-0.5 rounded hover:bg-astro-indigo hover:text-astro-gold text-astro-textMuted transition opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Copy message"
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </button>
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="h-8.5 w-8.5 rounded-full bg-astro-purple border border-astro-cardBorder border-opacity-35 flex items-center justify-center flex-shrink-0 shadow-glow select-none">
          <User className="h-4.5 w-4.5 text-astro-textMain" />
        </div>
      )}
    </motion.div>
  );
}
