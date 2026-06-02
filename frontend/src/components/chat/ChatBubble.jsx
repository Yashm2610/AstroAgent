import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

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
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm font-sans relative ${
          isUser
            ? 'bg-gradient-to-tr from-astro-purple to-[#8c66ff] text-astro-textMain rounded-tr-none shadow-glow border border-white border-opacity-10'
            : 'bg-astro-card bg-opacity-80 border border-astro-cardBorder text-astro-textMain rounded-tl-none shadow-glow'
        }`}
      >
        {/* Glow point behind bot bubble */}
        {!isUser && (
          <div className="absolute -top-10 -left-10 h-24 w-24 bg-astro-gold opacity-[0.03] blur-xl rounded-full pointer-events-none"></div>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-astro-textMain leading-relaxed space-y-2 text-[13px]">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2.5 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="text-astro-textMain hover:text-astro-gold transition-colors duration-200" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-astro-gold font-bold bg-astro-indigo bg-opacity-20 px-1 py-0.5 rounded" {...props} />,
                code: ({ node, ...props }) => <code className="bg-astro-indigo border border-astro-cardBorder border-opacity-25 px-1.5 py-0.5 rounded text-[11px] text-[#ffe596] font-mono" {...props} />,
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
