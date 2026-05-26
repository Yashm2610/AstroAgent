import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {/* Bot Icon */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-astro-indigo border border-astro-cardBorder flex items-center justify-center flex-shrink-0 shadow-glow">
          <Sparkles className="h-4 w-4 text-astro-gold" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm font-sans ${
          isUser
            ? 'bg-gradient-to-tr from-astro-purple to-[#8c66ff] text-astro-textMain rounded-tr-none'
            : 'bg-astro-card bg-opacity-70 border border-astro-cardBorder text-astro-textMain rounded-tl-none shadow-glow'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-astro-textMain leading-relaxed space-y-2">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="text-astro-textMain" {...props} />,
                strong: ({ node, ...props }) => <strong className="text-astro-gold font-bold" {...props} />,
                code: ({ node, ...props }) => <code className="bg-astro-indigo px-1 py-0.5 rounded text-xs text-[#dfb73c]" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-astro-cardBorder my-3" {...props} />
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-astro-purple border border-astro-cardBorder border-opacity-30 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-astro-textMain" />
        </div>
      )}
    </div>
  );
}
