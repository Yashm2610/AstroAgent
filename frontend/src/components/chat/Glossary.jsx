import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const GLOSSARY_ITEMS = [
  { term: 'Ascendant (Lagna)', definition: 'The zodiac sign that was rising on the eastern horizon at the exact time and location of birth. It represents your outer personality and first impressions.' },
  { term: 'Midheaven (MC)', definition: 'The highest point in the chart, representing career, public reputation, ambitions, and your life calling.' },
  { term: 'Placidus House System', definition: 'A time-proportional method of house division where the sky is split into 12 segments based on the time it takes for planets to ascend and culminate.' },
  { term: 'Retrograde (R)', definition: 'An optical illusion where a planet appears to move backward in the sky. Astrologically, it represents internal redirection, reflection, and karmic review.' },
  { term: 'Conjunction (0°)', definition: 'When two planets are sitting close to each other. Their energies merge and blend together, creating powerful focus.' },
  { term: 'Opposition (180°)', definition: 'When two planets sit directly opposite each other. This creates tension, demanding balance and compromise in partnerships.' },
  { term: 'Trine (120°)', definition: 'A highly harmonious aspect where planets flow smoothly. It represents natural talents and easy luck.' },
  { term: 'Square (90°)', definition: 'A challenging aspect creating friction and blockages. It forces action, drive, and personal breakthroughs.' }
];

export default function Glossary() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <HelpCircle className="h-3.5 w-3.5 text-astro-gold" />
        <span>Astrological Glossary</span>
      </h3>
      
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {GLOSSARY_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="border border-astro-cardBorder border-opacity-15 rounded-lg overflow-hidden bg-[#0a0b16] bg-opacity-35"
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full px-2.5 py-1.5 flex justify-between items-center text-left text-[10px] font-bold cursor-pointer"
              >
                <span>{item.term}</span>
                {isOpen ? <ChevronUp className="h-3 w-3 text-astro-gold" /> : <ChevronDown className="h-3 w-3 text-astro-gold" />}
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2 text-[9px] text-astro-textMuted leading-relaxed border-t border-astro-cardBorder border-opacity-10 pt-1">
                  {item.definition}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
