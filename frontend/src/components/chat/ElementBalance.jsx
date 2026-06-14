import React from 'react';
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

export default function ElementBalance({ chart }) {
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
              <div key={elemKey} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${style.textColor}`}>
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
              <div key={modKey} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${style.textColor}`}>
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
    </div>
  );
}
