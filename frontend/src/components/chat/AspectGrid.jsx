import React, { useState } from 'react';
import { Grid, HelpCircle } from 'lucide-react';

const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

const PLANET_SHORT_NAMES = {
  sun: 'Sun', moon: 'Moon', mercury: 'Merc', venus: 'Venus', mars: 'Mars', jupiter: 'Jup', saturn: 'Sat'
};

const SIGN_ORDER = {
  'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3, 'Leo': 4, 'Virgo': 5,
  'Libra': 6, 'Scorpio': 7, 'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
};

const ASPECTS = [
  { name: 'Conjunction', angle: 0, orb: 8, symbol: '☌', color: 'text-yellow-400', desc: 'Blending of forces, high focus, unity.' },
  { name: 'Sextile', angle: 60, orb: 6, symbol: '⚹', color: 'text-cyan-400', desc: 'Opportunities, excitement, ease of expression.' },
  { name: 'Square', angle: 90, orb: 8, symbol: '□', color: 'text-red-400', desc: 'Tension, action, core growth, challenges.' },
  { name: 'Trine', angle: 120, orb: 8, symbol: '△', color: 'text-emerald-400', desc: 'Harmony, talents, smooth flow, easy energy.' },
  { name: 'Opposition', angle: 180, orb: 8, symbol: '☍', color: 'text-purple-400', desc: 'Polarization, relationship awareness, compromise.' }
];

export default function AspectGrid({ chart }) {
  const [selectedAspect, setSelectedAspect] = useState(null);

  if (!chart || !chart.planets) return null;

  const getPlanetLon = (p) => {
    const planetData = chart.planets[p];
    if (!planetData) return null;
    return SIGN_ORDER[planetData.sign] * 30 + planetData.degree;
  };

  const getAspect = (p1, p2) => {
    if (p1 === p2) return null;
    const lon1 = getPlanetLon(p1);
    const lon2 = getPlanetLon(p2);
    if (lon1 === null || lon2 === null) return null;

    let diff = Math.abs(lon1 - lon2);
    if (diff > 180) diff = 360 - diff;

    for (const asp of ASPECTS) {
      if (Math.abs(diff - asp.angle) <= asp.orb) {
        return asp;
      }
    }
    return null;
  };

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Grid className="h-3.5 w-3.5 text-astro-gold" />
        <span>Planet Aspect Grid</span>
      </h3>

      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <table className="min-w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-[9px] font-mono text-astro-textMuted uppercase">P</th>
              {PLANETS.map(p => (
                <th key={p} className="p-1.5 text-[9px] font-mono text-astro-textMuted uppercase font-bold" title={p}>
                  {PLANET_SHORT_NAMES[p]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLANETS.map((p1, idx1) => (
              <tr key={p1} className="border-t border-astro-cardBorder border-opacity-10">
                <td className="p-1.5 text-[9px] font-mono text-astro-textMuted uppercase font-bold text-left">{PLANET_SHORT_NAMES[p1]}</td>
                {PLANETS.map((p2, idx2) => {
                  if (idx2 >= idx1) {
                    // We only render half the matrix (lower triangular) for clean look
                    return <td key={p2} className="p-1.5 bg-[#0a0b16] bg-opacity-30"></td>;
                  }
                  const aspect = getAspect(p1, p2);
                  return (
                    <td 
                      key={p2}
                      onClick={() => {
                        if (aspect) {
                          setSelectedAspect({
                            p1: chart.planets[p1].name,
                            p2: chart.planets[p2].name,
                            aspect
                          });
                        }
                      }}
                      className={`p-1.5 text-base font-bold transition duration-200 ${aspect ? `${aspect.color} bg-astro-indigo bg-opacity-40 hover:bg-opacity-70 cursor-pointer` : 'text-astro-textMuted opacity-20'}`}
                      title={aspect ? `${chart.planets[p1].name} ${aspect.name} ${chart.planets[p2].name}` : 'No major aspect'}
                    >
                      {aspect ? aspect.symbol : '•'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected aspect details */}
      {selectedAspect ? (
        <div className="mt-3 p-2.5 bg-[#0a0b16] bg-opacity-65 border border-astro-cardBorder border-opacity-15 rounded-xl text-[10px] space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-astro-textMain font-mono">
              {selectedAspect.p1} <span className={selectedAspect.aspect.color}>{selectedAspect.aspect.symbol} ({selectedAspect.aspect.name})</span> {selectedAspect.p2}
            </span>
            <button 
              onClick={() => setSelectedAspect(null)}
              className="text-[9px] text-astro-textMuted hover:text-astro-gold uppercase font-mono cursor-pointer"
            >
              Clear
            </button>
          </div>
          <p className="text-astro-textMuted leading-relaxed">{selectedAspect.aspect.desc}</p>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 text-[9px] text-astro-textMuted italic">
          <HelpCircle className="h-3 w-3" />
          <span>Tap any cell in the grid to analyze the aspect details.</span>
        </div>
      )}
    </div>
  );
}
