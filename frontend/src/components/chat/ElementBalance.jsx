import React from 'react';
import { Flame, Trees, Wind, Droplets } from 'lucide-react';

const SIGN_ELEMENTS = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water'
};

const ELEMENT_STYLES = {
  fire: { label: 'Fire', color: 'bg-red-500', textColor: 'text-red-400', icon: <Flame className="h-3.5 w-3.5" /> },
  earth: { label: 'Earth', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: <Trees className="h-3.5 w-3.5" /> },
  air: { label: 'Air', color: 'bg-cyan-500', textColor: 'text-cyan-400', icon: <Wind className="h-3.5 w-3.5" /> },
  water: { label: 'Water', color: 'bg-blue-500', textColor: 'text-blue-400', icon: <Droplets className="h-3.5 w-3.5" /> }
};

export default function ElementBalance({ chart }) {
  if (!chart || !chart.planets) return null;

  const points = { fire: 0, earth: 0, air: 0, water: 0 };

  // Calculate points
  // 1. Ascendant (2 pts)
  if (chart.ascendant && SIGN_ELEMENTS[chart.ascendant]) {
    points[SIGN_ELEMENTS[chart.ascendant]] += 2;
  }

  // 2. Planets
  Object.entries(chart.planets).forEach(([key, planet]) => {
    const element = SIGN_ELEMENTS[planet.sign];
    if (element) {
      // Sun/Moon get 2 pts, others 1 pt
      const weight = (key === 'sun' || key === 'moon') ? 2 : 1;
      points[element] += weight;
    }
  });

  const totalPoints = Object.values(points).reduce((sum, p) => sum + p, 0);

  if (totalPoints === 0) return null;

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5 font-sans">
        <span>Elemental Balance</span>
      </h3>
      <div className="space-y-3">
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
              <div className="h-2 bg-astro-indigo bg-opacity-65 rounded-full overflow-hidden border border-astro-cardBorder border-opacity-10">
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
  );
}
