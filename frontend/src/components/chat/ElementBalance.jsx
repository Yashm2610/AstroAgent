import React, { useState } from 'react';
import { Flame, Trees, Wind, Droplets, Compass } from 'lucide-react';

const SIGN_ELEMENTS = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water'
};

const SIGN_MODALITIES = {
  Aries: 'cardinal', Cancer: 'cardinal', Libra: 'cardinal', Capricorn: 'cardinal',
  Taurus: 'fixed', Leo: 'fixed', Scorpio: 'fixed', Aquarius: 'fixed',
  Gemini: 'mutable', Virgo: 'mutable', Sagittarius: 'mutable', Pisces: 'mutable'
};

const ELEMENT_STYLES = {
  fire: { label: 'Fire', color: 'bg-red-500', textColor: 'text-red-400', icon: <Flame className="h-3.5 w-3.5" /> },
  earth: { label: 'Earth', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: <Trees className="h-3.5 w-3.5" /> },
  air: { label: 'Air', color: 'bg-cyan-500', textColor: 'text-cyan-400', icon: <Wind className="h-3.5 w-3.5" /> },
  water: { label: 'Water', color: 'bg-blue-500', textColor: 'text-blue-400', icon: <Droplets className="h-3.5 w-3.5" /> }
};

const MODALITY_STYLES = {
  cardinal: { label: 'Cardinal (Initiation)', color: 'bg-purple-500', textColor: 'text-purple-400' },
  fixed: { label: 'Fixed (Stability)', color: 'bg-pink-500', textColor: 'text-pink-400' },
  mutable: { label: 'Mutable (Adaptability)', color: 'bg-amber-500', textColor: 'text-amber-400' }
};

const ELEMENT_DETAILS = {
  fire: {
    title: 'Fire Element',
    desc: 'Action-oriented, passionate, intuitive, energetic, and expressive. Fire signs (Aries, Leo, Sagittarius) bring enthusiasm and drive, but must guard against burnout, impatience, or acting before thinking.',
    keywords: 'Inspiration, Vitality, Courage, Spontaneity'
  },
  earth: {
    title: 'Earth Element',
    desc: 'Grounded, practical, reliable, sensual, and realistic. Earth signs (Taurus, Virgo, Capricorn) build stable foundations and value material results, but must watch out for stubbornness, rigidity, or excessive materialism.',
    keywords: 'Stability, Pragmatism, Reliability, Structure'
  },
  air: {
    title: 'Air Element',
    desc: 'Intellectual, communicative, objective, social, and conceptual. Air signs (Gemini, Libra, Aquarius) excel in thinking, sharing ideas, and social relations, but can sometimes feel detached, indecisive, or scattered.',
    keywords: 'Intellect, Communication, Objectivity, Perspective'
  },
  water: {
    title: 'Water Element',
    desc: 'Emotional, sensitive, intuitive, imaginative, and deep. Water signs (Cancer, Scorpio, Pisces) experience life through feelings, empathy, and deep attachments, but can be prone to mood swings or absorbing others\' negative energy.',
    keywords: 'Intuition, Emotion, Empathy, Depth'
  }
};

const MODALITY_DETAILS = {
  cardinal: {
    title: 'Cardinal Modality',
    desc: 'Initiators, leaders, and action-oriented forces. Cardinal signs (Aries, Cancer, Libra, Capricorn) start seasons and project energy forward, but must watch out for not finishing what they start.',
    keywords: 'Initiative, Ambition, Direction, Drive'
  },
  fixed: {
    title: 'Fixed Modality',
    desc: 'Sustainers, stabilisers, and resistant to change. Fixed signs (Taurus, Leo, Scorpio, Aquarius) excel in focus, perseverance, and completion, but can be prone to stubbornness and stagnation.',
    keywords: 'Stability, Endurance, Focus, Resolve'
  },
  mutable: {
    title: 'Mutable Modality',
    desc: 'Adapters, communicators, and flexible change-agents. Mutable signs (Gemini, Virgo, Sagittarius, Pisces) bridge seasons and excel in adjustment and learning, but can struggle with scattered focus and indecision.',
    keywords: 'Adaptability, Resourcefulness, Flexibility, Transition'
  }
};

export default function ElementBalance({ chart }) {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedModality, setSelectedModality] = useState(null);

  if (!chart || !chart.planets) return null;

  const points = { fire: 0, earth: 0, air: 0, water: 0 };
  const modPoints = { cardinal: 0, fixed: 0, mutable: 0 };

  // Calculate points
  // 1. Ascendant (2 pts)
  if (chart.ascendant) {
    const elem = SIGN_ELEMENTS[chart.ascendant];
    if (elem) points[elem] += 2;
    const mod = SIGN_MODALITIES[chart.ascendant];
    if (mod) modPoints[mod] += 2;
  }

  // 2. Planets
  Object.entries(chart.planets).forEach(([key, planet]) => {
    const weight = (key === 'sun' || key === 'moon') ? 2 : 1;
    
    const element = SIGN_ELEMENTS[planet.sign];
    if (element) {
      points[element] += weight;
    }
    
    const modality = SIGN_MODALITIES[planet.sign];
    if (modality) {
      modPoints[modality] += weight;
    }
  });

  const totalPoints = Object.values(points).reduce((sum, p) => sum + p, 0);
  const totalModPoints = Object.values(modPoints).reduce((sum, p) => sum + p, 0);

  if (totalPoints === 0) return null;

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 space-y-4 font-sans text-astro-textMain">
      {/* Elements */}
      <div>
        <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-astro-gold" />
          <span>Elemental Balance</span>
        </h3>
        <div className="space-y-2.5">
          {Object.entries(points).map(([elemKey, val]) => {
            const percentage = Math.round((val / totalPoints) * 100);
            const style = ELEMENT_STYLES[elemKey];
            return (
              <div 
                key={elemKey} 
                onClick={() => setSelectedElement(elemKey)}
                className="space-y-1 cursor-pointer group hover:bg-[#0a0b16] hover:bg-opacity-30 p-1.5 rounded-lg transition duration-200"
                title={`Click to analyze ${style.label}`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${style.textColor} group-hover:text-astro-gold transition`}>
                    {style.icon}
                    <span>{style.label}</span>
                  </span>
                  <span className="font-mono text-astro-textMuted font-bold text-[10px]">{percentage}%</span>
                </div>
                <div className="h-1.5 bg-astro-indigo bg-opacity-65 rounded-full overflow-hidden border border-astro-cardBorder border-opacity-10">
                  <div 
                    className={`h-full rounded-full ${style.color} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-astro-cardBorder border-opacity-15" />

      {/* Modalities */}
      <div>
        <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-astro-gold" />
          <span>Modality Balance</span>
        </h3>
        <div className="space-y-2.5">
          {Object.entries(modPoints).map(([modKey, val]) => {
            const percentage = Math.round((val / totalModPoints) * 100);
            const style = MODALITY_STYLES[modKey];
            return (
              <div 
                key={modKey} 
                onClick={() => setSelectedModality(modKey)}
                className="space-y-1 cursor-pointer group hover:bg-[#0a0b16] hover:bg-opacity-30 p-1.5 rounded-lg transition duration-200"
                title={`Click to analyze ${style.label}`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${style.textColor} group-hover:text-astro-gold transition`}>
                    <span>{style.label}</span>
                  </span>
                  <span className="font-mono text-astro-textMuted font-bold text-[10px]">{percentage}%</span>
                </div>
                <div className="h-1.5 bg-astro-indigo bg-opacity-65 rounded-full overflow-hidden border border-astro-cardBorder border-opacity-10">
                  <div 
                    className={`h-full rounded-full ${style.color} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Element details Modal */}
      {selectedElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-astro-card border border-astro-cardBorder rounded-2xl max-w-sm w-full p-6 shadow-glow relative overflow-hidden animate-fade-in text-sans">
            <div className="absolute top-0 right-0 h-16 w-16 bg-astro-gold opacity-10 blur-2xl rounded-full"></div>
            
            <button 
              onClick={() => setSelectedElement(null)}
              className="absolute top-4 right-4 text-astro-textMuted hover:text-astro-gold transition-colors text-sm font-semibold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-astro-indigo border border-astro-cardBorder border-opacity-45 ${ELEMENT_STYLES[selectedElement].textColor}`}>
                  {ELEMENT_STYLES[selectedElement].icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-astro-gold uppercase tracking-wider font-mono">
                    {ELEMENT_DETAILS[selectedElement].title}
                  </h3>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono">Psychological Profile</span>
                </div>
              </div>

              <hr className="border-astro-cardBorder border-opacity-15" />

              <div className="space-y-2 text-[11px] leading-relaxed text-astro-textMain">
                <p>{ELEMENT_DETAILS[selectedElement].desc}</p>
                <div className="p-2.5 bg-[#0a0b16] border border-astro-cardBorder border-opacity-20 rounded-xl space-y-1">
                  <span className="block text-[8px] font-mono uppercase tracking-wider text-astro-gold font-bold">Core Strengths:</span>
                  <p className="text-astro-textMuted">{ELEMENT_DETAILS[selectedElement].keywords}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modality details Modal */}
      {selectedModality && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-astro-card border border-astro-cardBorder rounded-2xl max-w-sm w-full p-6 shadow-glow relative overflow-hidden animate-fade-in text-sans">
            <div className="absolute top-0 right-0 h-16 w-16 bg-astro-gold opacity-10 blur-2xl rounded-full"></div>
            
            <button 
              onClick={() => setSelectedModality(null)}
              className="absolute top-4 right-4 text-astro-textMuted hover:text-astro-gold transition-colors text-sm font-semibold cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-3 mt-2 text-astro-textMain">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-astro-indigo border border-astro-cardBorder border-opacity-45 text-astro-gold">
                  <Compass className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-astro-gold uppercase tracking-wider font-mono">
                    {MODALITY_DETAILS[selectedModality].title}
                  </h3>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono">Behavioral Modality</span>
                </div>
              </div>

              <hr className="border-astro-cardBorder border-opacity-15" />

              <div className="space-y-2 text-[11px] leading-relaxed text-astro-textMain">
                <p>{MODALITY_DETAILS[selectedModality].desc}</p>
                <div className="p-2.5 bg-[#0a0b16] border border-astro-cardBorder border-opacity-20 rounded-xl space-y-1">
                  <span className="block text-[8px] font-mono uppercase tracking-wider text-astro-gold font-bold">Key Attributes:</span>
                  <p className="text-astro-textMuted">{MODALITY_DETAILS[selectedModality].keywords}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
