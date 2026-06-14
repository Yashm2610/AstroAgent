import React from 'react';

const SIGN_MAP = [
  { name: 'Pisces', row: 0, col: 0 },
  { name: 'Aries', row: 0, col: 1 },
  { name: 'Taurus', row: 0, col: 2 },
  { name: 'Gemini', row: 0, col: 3 },
  { name: 'Cancer', row: 1, col: 3 },
  { name: 'Leo', row: 2, col: 3 },
  { name: 'Libra', row: 3, col: 2 },
  { name: 'Scorpio', row: 3, col: 1 },
  { name: 'Sagittarius', row: 3, col: 0 },
  { name: 'Capricorn', row: 2, col: 0 },
  { name: 'Aquarius', row: 1, col: 0 },
  { name: 'Virgo', row: 3, col: 3 } // Wait, let's map them clockwise
];

// Clockwise layout coordinates (0-indexed 4x4 grid):
// (0,0): Pisces | (0,1): Aries | (0,2): Taurus | (0,3): Gemini
// (1,0): Aquarius | (1,1): empty | (1,2): empty | (1,3): Cancer
// (2,0): Capricorn | (2,1): empty | (2,2): empty | (2,3): Leo
// (3,0): Sagittarius | (3,1): Scorpio | (3,2): Libra | (3,3): Virgo
const SIGN_GRID = {
  Aries: { r: 0, c: 1, label: 'Ari' },
  Taurus: { r: 0, c: 2, label: 'Tau' },
  Gemini: { r: 0, c: 3, label: 'Gem' },
  Cancer: { r: 1, c: 3, label: 'Can' },
  Leo: { r: 2, c: 3, label: 'Leo' },
  Virgo: { r: 3, c: 3, label: 'Vir' },
  Libra: { r: 3, c: 2, label: 'Lib' },
  Scorpio: { r: 3, c: 1, label: 'Sco' },
  Sagittarius: { r: 3, c: 0, label: 'Sag' },
  Capricorn: { r: 2, c: 0, label: 'Cap' },
  Aquarius: { r: 1, c: 0, label: 'Aqu' },
  Pisces: { r: 0, c: 0, label: 'Pis' }
};

const PLANET_SYMBOLS = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  north_node: 'Rahu', south_node: 'Ketu'
};

export default function SouthIndianChart({ chart }) {
  if (!chart || !chart.planets) return null;

  // Group planets by sign
  const planetsBySign = {};
  Object.keys(SIGN_GRID).forEach(sign => {
    planetsBySign[sign] = [];
  });

  // Add Ascendant
  if (chart.ascendant && planetsBySign[chart.ascendant]) {
    planetsBySign[chart.ascendant].push({ name: 'Lagna', isAsc: true });
  }

  // Add Planets
  Object.entries(chart.planets).forEach(([key, planet]) => {
    const sign = planet.sign;
    if (planetsBySign[sign]) {
      planetsBySign[sign].push({
        key,
        name: planet.name || key,
        symbol: PLANET_SYMBOLS[key] || planet.name[0],
        degree: planet.degree
      });
    }
  });

  // Generate 4x4 cells
  const gridCells = Array(4).fill(null).map(() => Array(4).fill(null));
  
  Object.entries(SIGN_GRID).forEach(([signName, gridInfo]) => {
    gridCells[gridInfo.r][gridInfo.c] = {
      signName,
      label: gridInfo.label,
      planets: planetsBySign[signName] || []
    };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center font-sans text-astro-textMain bg-astro-indigo bg-opacity-10 border border-astro-cardBorder border-opacity-20 p-4 rounded-2xl shadow-glow">
      <div className="text-[10px] font-mono font-bold text-astro-gold uppercase tracking-wider mb-3 w-full text-left">
        South Indian Chart Layout
      </div>
      
      {/* 4x4 Square Grid layout */}
      <div className="grid grid-cols-4 grid-rows-4 gap-1 w-64 h-64 bg-[#0a0b16] border border-astro-cardBorder border-opacity-30 p-1 rounded-xl">
        {gridCells.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            const isEmptyCenter = (rIdx === 1 || rIdx === 2) && (cIdx === 1 || cIdx === 2);
            
            if (isEmptyCenter) {
              // Center 2x2 empty box display Lagna and info
              if (rIdx === 1 && cIdx === 1) {
                return (
                  <div key={`${rIdx}-${cIdx}`} className="col-span-2 row-span-2 flex flex-col items-center justify-center border border-dashed border-astro-cardBorder border-opacity-20 bg-astro-indigo bg-opacity-20 rounded-lg p-2 text-center text-[9px]">
                    <span className="font-bold text-astro-gold uppercase tracking-wider">AstroAgent</span>
                    <span className="text-astro-textMuted text-[8px] mt-0.5">Vedic Grid</span>
                    {chart.ascendant && (
                      <span className="text-[8.5px] mt-1.5 font-bold text-astro-textMain">Asc: {chart.ascendant}</span>
                    )}
                  </div>
                );
              }
              // Skip rendering for other cells in col-span/row-span
              return null;
            }

            if (!cell) return <div key={`${rIdx}-${cIdx}`} className="bg-transparent" />;

            return (
              <div 
                key={cell.signName} 
                className="bg-[#14152e] bg-opacity-45 border border-astro-cardBorder border-opacity-25 rounded-md p-1 flex flex-col justify-between overflow-hidden hover:border-astro-gold transition-all duration-300"
              >
                {/* Sign Label */}
                <div className="text-[7.5px] text-astro-gold font-mono font-bold uppercase tracking-wider">
                  {cell.label}
                </div>
                
                {/* Planets inside cell */}
                <div className="flex flex-wrap gap-0.5 overflow-y-auto max-h-10 pr-0.5 scrollbar-none flex-1 justify-center items-center mt-1">
                  {cell.planets.map((p, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[8.5px] font-mono leading-none ${p.isAsc ? 'text-red-400 font-bold' : 'text-astro-textMain'}`}
                      title={p.isAsc ? 'Lagna (Ascendant)' : `${p.name} (${p.degree}°)`}
                    >
                      {p.isAsc ? 'Lg' : p.symbol}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
