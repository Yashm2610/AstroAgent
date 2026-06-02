import React from 'react';
import { Compass, Briefcase, Moon, AlertTriangle } from 'lucide-react';

const PROMPTS = [
  { text: "What does my Sun sign reveal about my core purpose?", icon: <Compass className="h-3 w-3 text-astro-gold" /> },
  { text: "What lessons does Saturn indicate in my chart?", icon: <AlertTriangle className="h-3 w-3 text-astro-purple" /> },
  { text: "Analyze my career path using my 10th house placement.", icon: <Briefcase className="h-3 w-3 text-blue-400" /> },
  { text: "Are there any major transits affecting my Moon sign today?", icon: <Moon className="h-3 w-3 text-green-400" /> }
];

export default function AstroPrompts({ onSelect, disabled }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3.5 w-full">
      <div className="text-[10px] text-astro-textMuted uppercase font-bold tracking-wider mb-1 px-1">
        Suggested Queries
      </div>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-astro-indigo bg-opacity-30 hover:bg-opacity-50 border border-astro-cardBorder border-opacity-20 hover:border-opacity-40 rounded-full text-xs text-astro-textMain transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            {prompt.icon}
            <span className="font-sans font-medium text-left">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
