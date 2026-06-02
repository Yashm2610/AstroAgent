import React from 'react';
import { motion } from 'framer-motion';

const PLANET_GLYPHS = {
  sun: { symbol: '☉', color: '#ffb300', name: 'Sun' },
  moon: { symbol: '☽', color: '#e0e0e0', name: 'Moon' },
  mercury: { symbol: '☿', color: '#00e5ff', name: 'Mercury' },
  venus: { symbol: '♀', color: '#ff4081', name: 'Venus' },
  mars: { symbol: '♂', color: '#ff1744', name: 'Mars' },
  jupiter: { symbol: '♃', color: '#d4af37', name: 'Jupiter' },
  saturn: { symbol: '♄', color: '#b0bec5', name: 'Saturn' },
  uranus: { symbol: '♅', color: '#b388ff', name: 'Uranus' },
  neptune: { symbol: '♆', color: '#8c9eff', name: 'Neptune' },
  pluto: { symbol: '♇', color: '#b28900', name: 'Pluto' },
  north_node: { symbol: '☊', color: '#a7ffeb', name: 'Rahu' },
  south_node: { symbol: '☋', color: '#ff8a80', name: 'Ketu' }
};

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'fire' },
  { name: 'Taurus', symbol: '♉', element: 'earth' },
  { name: 'Gemini', symbol: '♊', element: 'air' },
  { name: 'Cancer', symbol: '♋', element: 'water' },
  { name: 'Leo', symbol: '♌', element: 'fire' },
  { name: 'Virgo', symbol: '♍', element: 'earth' },
  { name: 'Libra', symbol: '♎', element: 'air' },
  { name: 'Scorpio', symbol: '♏', element: 'water' },
  { name: 'Sagittarius', symbol: '♐', element: 'fire' },
  { name: 'Capricorn', symbol: '♑', element: 'earth' },
  { name: 'Aquarius', symbol: '♒', element: 'air' },
  { name: 'Pisces', symbol: '♓', element: 'water' }
];

export default function AstroWheel({ chart }) {
  if (!chart || !chart.planets) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-astro-textMuted italic">
        No chart coordinates found.
      </div>
    );
  }

  // 1. Group planets by house to calculate radial spacing
  const housePlanets = {};
  for (let i = 1; i <= 12; i++) {
    housePlanets[i] = [];
  }

  Object.entries(chart.planets).forEach(([key, planet]) => {
    const houseNum = planet.house;
    if (houseNum >= 1 && houseNum <= 12) {
      housePlanets[houseNum].push({ key, ...planet });
    }
  });

  // Calculate coordinates (center = 120, 120; radius = 100)
  const cx = 120;
  const cy = 120;

  const getCoordinates = (angleDeg, r) => {
    // 180 deg puts the Ascendant at the left (9 o'clock), standard in astrology
    const angleRad = ((angleDeg - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Render the spokes dividing the houses (12 houses)
  const spokes = [];
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const startPt = getCoordinates(angle, 35);
    const endPt = getCoordinates(angle, 95);
    spokes.push(
      <line
        key={`spoke-${i}`}
        x1={startPt.x}
        y1={startPt.y}
        x2={endPt.x}
        y2={endPt.y}
        stroke="rgba(212, 175, 55, 0.18)"
        strokeWidth="1"
      />
    );
  }

  // Render planetary icons inside the wheel
  const planetElements = [];
  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    const planetsInHouse = housePlanets[houseNum];
    const numPlanets = planetsInHouse.length;

    planetsInHouse.forEach((planet, index) => {
      // Wedge center angle
      const startAngle = (houseNum - 1) * 30;
      const midAngle = startAngle + 15;
      
      // Distribute multiple planets radially to avoid overlap
      let r = 68; // default middle radius
      if (numPlanets > 1) {
        const minR = 45;
        const maxR = 82;
        r = minR + (index / (numPlanets - 1)) * (maxR - minR);
      }

      const coords = getCoordinates(midAngle, r);
      const glyph = PLANET_GLYPHS[planet.key] || { symbol: '★', color: '#dfb73c', name: planet.name };

      planetElements.push(
        <g key={`planet-node-${planet.key}`}>
          <motion.circle
            whileHover={{ scale: 1.4 }}
            cx={coords.x}
            cy={coords.y}
            r="7"
            fill="rgba(10, 11, 22, 0.9)"
            stroke={glyph.color}
            strokeWidth="1.2"
            className="cursor-pointer"
          />
          <text
            x={coords.x}
            y={coords.y + 2.5}
            fill={glyph.color}
            fontSize="7"
            textAnchor="middle"
            fontFamily="sans-serif"
            className="pointer-events-none font-bold"
          >
            {glyph.symbol}
          </text>
          {/* Custom micro-tooltip representation */}
          <title>{`${glyph.name}: ${planet.degree}° in ${planet.sign} (House ${planet.house})`}</title>
        </g>
      );
    });
  }

  // Outer Zodiac Ring labeling
  const zodiacLabels = [];
  for (let i = 0; i < 12; i++) {
    const midAngle = i * 30 + 15;
    const coords = getCoordinates(midAngle, 107);
    const sign = ZODIAC_SIGNS[i];

    let elementColor = 'rgba(223, 183, 60, 0.6)'; // default gold
    if (sign.element === 'fire') elementColor = '#ff6b6b';
    if (sign.element === 'water') elementColor = '#64b5f6';
    if (sign.element === 'earth') elementColor = '#81c784';
    if (sign.element === 'air') elementColor = '#ffd54f';

    zodiacLabels.push(
      <text
        key={`zodiac-label-${i}`}
        x={coords.x}
        y={coords.y + 2}
        fill={elementColor}
        fontSize="6"
        fontWeight="bold"
        textAnchor="middle"
        className="pointer-events-none font-mono"
      >
        {sign.symbol}
      </text>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 240 240">
          <defs>
            <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#0a0b16" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a0b16" stopOpacity="0.9" />
            </radialGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circles */}
          <circle cx={cx} cy={cy} r="115" fill="url(#wheelGlow)" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="98" fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="35" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="0.8" />
          
          {/* Center glowing star */}
          <circle cx={cx} cy={cy} r="5" fill="#dfb73c" opacity="0.3" filter="url(#glowEffect)" />
          <polygon 
            points={`${cx},${cy-8} ${cx+2},${cy-2} ${cx+8},${cy} ${cx+2},${cy+2} ${cx},${cy+8} ${cx-2},${cy+2} ${cx-8},${cy} ${cx-2},${cy-2}`}
            fill="#dfb73c"
          />

          {/* Spokes and divisions */}
          {spokes}

          {/* Planet SVG Elements */}
          {planetElements}

          {/* Zodiac Labels */}
          {zodiacLabels}

          {/* Outer Ring Border highlights */}
          <circle cx={cx} cy={cy} r="115" fill="none" stroke="rgba(125, 82, 255, 0.3)" strokeWidth="0.5" className="star-twinkle-slow" />
        </svg>
      </div>
      <div className="text-[10px] text-astro-textMuted font-mono mt-2 text-center uppercase tracking-widest flex items-center gap-1.5 justify-center">
        <span>Ascendant at Left horizon</span>
      </div>
    </div>
  );
}
