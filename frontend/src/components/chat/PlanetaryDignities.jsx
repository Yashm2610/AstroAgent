import React from 'react';
import { Award, ShieldAlert, Star, ShieldCheck } from 'lucide-react';

const DOMICILES = {
  sun: ['Leo'],
  moon: ['Cancer'],
  mercury: ['Gemini', 'Virgo'],
  venus: ['Taurus', 'Libra'],
  mars: ['Aries', 'Scorpio'],
  jupiter: ['Sagittarius', 'Pisces'],
  saturn: ['Capricorn', 'Aquarius']
};

const EXALTATIONS = {
  sun: 'Aries',
  moon: 'Taurus',
  mercury: 'Virgo',
  venus: 'Pisces',
  mars: 'Capricorn',
  jupiter: 'Cancer',
  saturn: 'Libra'
};

const DETRIMENTS = {
  sun: ['Aquarius'],
  moon: ['Capricorn'],
  mercury: ['Sagittarius', 'Pisces'],
  venus: ['Aries', 'Scorpio'],
  mars: ['Taurus', 'Libra'],
  jupiter: ['Gemini', 'Virgo'],
  saturn: ['Cancer', 'Leo']
};

const FALLS = {
  sun: 'Libra',
  moon: 'Scorpio',
  mercury: 'Pisces',
  venus: 'Virgo',
  mars: 'Cancer',
  jupiter: 'Capricorn',
  saturn: 'Aries'
};

export default function PlanetaryDignities({ chart }) {
  if (!chart || !chart.planets) return null;

  const results = [];

  Object.entries(chart.planets).forEach(([key, planet]) => {
    // We only calculate for classical personal/social planets
    if (!['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(key)) return;

    const sign = planet.sign;
    let quality = null;
    let label = '';
    let style = {};

    if (DOMICILES[key]?.includes(sign)) {
      quality = 'domicile';
      label = 'Domicile (Home)';
      style = { color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-500/20', icon: <ShieldCheck className="h-3.5 w-3.5" /> };
    } else if (EXALTATIONS[key] === sign) {
      quality = 'exaltation';
      label = 'Exalted (Strongest)';
      style = { color: 'text-astro-gold', bg: 'bg-amber-950/20', border: 'border-astro-gold/20', icon: <Star className="h-3.5 w-3.5" /> };
    } else if (DETRIMENTS[key]?.includes(sign)) {
      quality = 'detriment';
      label = 'Detriment (Challenged)';
      style = { color: 'text-orange-400', bg: 'bg-orange-950/20', border: 'border-orange-500/20', icon: <ShieldAlert className="h-3.5 w-3.5" /> };
    } else if (FALLS[key] === sign) {
      quality = 'fall';
      label = 'Fall (Weakened)';
      style = { color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-500/20', icon: <ShieldAlert className="h-3.5 w-3.5" /> };
    }

    if (quality) {
      results.push({
        key,
        name: planet.name || key,
        sign,
        label,
        style
      });
    }
  });

  if (results.length === 0) return null;

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Award className="h-3.5 w-3.5 text-astro-gold" />
        <span>Planetary Dignities</span>
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {results.map((item) => (
          <div 
            key={item.key} 
            className={`flex items-center justify-between p-2 rounded-xl border ${item.style.border} ${item.style.bg} transition duration-300 hover:scale-[1.01]`}
          >
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-bold capitalize ${item.style.color}`}>{item.name}</span>
              <span className="text-[10px] text-astro-textMuted">in {item.sign}</span>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${item.style.color}`}>
              {item.style.icon}
              <span>{item.style.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
