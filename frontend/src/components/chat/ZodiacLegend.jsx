import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', element: 'Air' },
  { name: 'Cancer', symbol: '♋', element: 'Water' },
  { name: 'Leo', symbol: '♌', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', element: 'Earth' },
  { name: 'Libra', symbol: '♎', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth' },
  { name: 'Aquarius', symbol: '♒', element: 'Air' },
  { name: 'Pisces', symbol: '♓', element: 'Water' }
];

export default function ZodiacLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-xs font-bold text-astro-gold uppercase tracking-wider cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-astro-gold" />
          <span>Zodiac Symbols Legend</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="grid grid-cols-3 gap-2 mt-3 animate-fade-in">
          {ZODIAC_SIGNS.map(sign => (
            <div 
              key={sign.name} 
              className="p-1.5 bg-[#0a0b16] bg-opacity-35 border border-astro-cardBorder border-opacity-10 rounded-lg flex flex-col items-center justify-center text-center"
              title={`${sign.name} (${sign.element})`}
            >
              <span className="text-sm text-astro-gold font-bold">{sign.symbol}</span>
              <span className="text-[8px] font-semibold text-astro-textMain mt-0.5">{sign.name}</span>
              <span className="text-[7px] text-astro-textMuted font-mono">{sign.element}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
