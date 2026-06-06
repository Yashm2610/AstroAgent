import React, { useState } from 'react';
import { Compass, Briefcase, Moon, AlertTriangle, Heart } from 'lucide-react';

const PROMPTS = [
  { text: "What does my Sun sign reveal about my core purpose?", icon: <Compass className="h-3 w-3 text-astro-gold" />, category: "identity" },
  { text: "How can I balance my Sun and Moon sign energies?", icon: <Compass className="h-3 w-3 text-astro-gold" />, category: "identity" },
  { text: "What lessons does Saturn indicate in my chart?", icon: <AlertTriangle className="h-3 w-3 text-astro-purple" />, category: "lessons" },
  { text: "Explain the spiritual meaning of any retrograde planets in my chart.", icon: <AlertTriangle className="h-3 w-3 text-astro-purple" />, category: "lessons" },
  { text: "Analyze my career path using my 10th house placement.", icon: <Briefcase className="h-3 w-3 text-blue-400" />, category: "career" },
  { text: "What planetary placements govern my wealth and assets?", icon: <Briefcase className="h-3 w-3 text-blue-400" />, category: "career" },
  { text: "What does my 7th house placement suggest about partnerships?", icon: <Heart className="h-3 w-3 text-red-400" />, category: "love" },
  { text: "Are there any major transits affecting my Moon sign today?", icon: <Moon className="h-3 w-3 text-green-400" />, category: "identity" }
];

export default function AstroPrompts({ onSelect, disabled }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'identity', label: 'Identity' },
    { id: 'career', label: 'Career' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'love', label: 'Love' }
  ];

  const filteredPrompts = activeCategory === 'all'
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col gap-1.5 mb-3 w-full text-sans print:hidden">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[9px] text-astro-textMuted uppercase font-bold tracking-wider font-mono">Suggested Consultation Queries</span>
      </div>

      {/* Category selector chips */}
      <div className="flex flex-wrap gap-1.5 mb-2 px-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-mono font-bold border cursor-pointer transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-astro-gold text-astro-bg border-astro-gold shadow-goldGlow'
                : 'bg-astro-indigo bg-opacity-35 text-astro-textMuted border-astro-cardBorder border-opacity-20 hover:border-opacity-50 hover:text-astro-gold'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto pr-1">
        {filteredPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-astro-indigo bg-opacity-30 hover:bg-opacity-50 border border-astro-cardBorder border-opacity-20 hover:border-opacity-40 rounded-xl text-xs text-astro-textMain transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          >
            {prompt.icon}
            <span className="font-sans font-medium text-left">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
