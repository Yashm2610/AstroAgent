import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Home } from 'lucide-react';

const HOUSE_INFO = {
  1: { title: "1st House", keyword: "Identity & Self", desc: "Self-expression, physical appearance, first impressions, and your outward personality." },
  2: { title: "2nd House", keyword: "Values & Wealth", desc: "Personal finances, material possessions, self-worth, values, and security." },
  3: { title: "3rd House", keyword: "Mind & Communication", desc: "Intellect, local travel, siblings, immediate environment, and communication style." },
  4: { title: "4th House", keyword: "Home & Roots", desc: "Family, ancestry, foundations, emotional security, and the private self." },
  5: { title: "5th House", keyword: "Pleasure & Creativity", desc: "Romance, artistic expression, children, play, and joyful self-expression." },
  6: { title: "6th House", keyword: "Health & Routine", desc: "Daily routines, physical health, work environment, service, and pets." },
  7: { title: "7th House", keyword: "Partnerships & Relations", desc: "Committed partnerships, marriage, business associations, and open agreements." },
  8: { title: "8th House", keyword: "Transformation & Sharing", desc: "Shared resources, intimacy, psychological depth, inheritance, and rebirth." },
  9: { title: "9th House", keyword: "Philosophy & Travel", desc: "Higher education, long-distance travel, philosophy, religion, and belief systems." },
  10: { title: "10th House", keyword: "Career & Calling", desc: "Profession, public reputation, status, authority figures, and life calling." },
  11: { title: "11th House", keyword: "Community & Goals", desc: "Friendships, networks, future goals, social causes, and aspirations." },
  12: { title: "12th House", keyword: "Subconscious & Secrets", desc: "Dreams, spiritual growth, solitude, hidden motives, and subconscious patterns." }
};

const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  north_node: '', south_node: ''
};

export default function HouseAccordion({ chart }) {
  const [expandedHouse, setExpandedHouse] = useState(null);

  if (!chart || !chart.planets) return null;

  // Group planets by house
  const planetsByHouse = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }
  Object.entries(chart.planets).forEach(([key, planet]) => {
    const houseNum = planet.house;
    if (houseNum >= 1 && houseNum <= 12) {
      planetsByHouse[houseNum].push({ key, ...planet });
    }
  });

  const toggleHouse = (num) => {
    setExpandedHouse(expandedHouse === num ? null : num);
  };

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Home className="h-3.5 w-3.5 text-astro-gold" />
        <span>House Interpretations</span>
      </h3>
      
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {Object.entries(HOUSE_INFO).map(([numStr, info]) => {
          const num = parseInt(numStr);
          const isOpen = expandedHouse === num;
          const housePlanets = planetsByHouse[num] || [];
          
          return (
            <div 
              key={num} 
              className={`border rounded-xl transition duration-300 ${isOpen ? 'border-astro-gold border-opacity-40 bg-[#0c0d1e] bg-opacity-60' : 'border-astro-cardBorder border-opacity-20 hover:border-astro-cardBorder hover:border-opacity-40'}`}
            >
              <button
                onClick={() => toggleHouse(num)}
                className="w-full px-3 py-2 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${isOpen ? 'bg-astro-gold text-astro-bg' : 'bg-astro-indigo bg-opacity-65 text-astro-gold border border-astro-cardBorder border-opacity-20'}`}>
                    {num}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{info.title}</div>
                    <div className="text-[9px] text-astro-textMuted uppercase tracking-wider">{info.keyword}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Planet glyphs in this house */}
                  <div className="flex gap-1 text-[10px] text-astro-gold font-semibold">
                    {housePlanets.map(p => (
                      <span key={p.key} title={p.name}>{PLANET_SYMBOLS[p.key] || p.name[0]}</span>
                    ))}
                  </div>
                  {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-astro-textMuted" /> : <ChevronDown className="h-3.5 w-3.5 text-astro-textMuted" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-astro-cardBorder border-opacity-10 pt-2 text-[10px] space-y-2">
                      <p className="text-astro-textMuted leading-relaxed">{info.desc}</p>
                      {housePlanets.length > 0 ? (
                        <div className="bg-[#05060d] bg-opacity-50 p-2 rounded-lg border border-astro-cardBorder border-opacity-15 space-y-1">
                          <span className="block text-[8px] font-mono uppercase tracking-wider text-astro-gold font-semibold">Planets In House:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {housePlanets.map(p => (
                              <span 
                                key={p.key} 
                                className="inline-flex items-center gap-1 bg-astro-indigo bg-opacity-45 px-1.5 py-0.5 rounded text-[9px] text-astro-textMain font-mono border border-astro-cardBorder border-opacity-10"
                              >
                                <span>{PLANET_SYMBOLS[p.key] || ''}</span>
                                <span className="capitalize">{p.key.replace('_', ' ')}</span>
                                <span className="text-[8px] text-astro-textMuted">({p.degree}° {p.sign})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[9px] text-astro-textMuted italic pl-1">No planets occupy this house.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
