import React, { useState } from 'react';
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

const HOUSE_INFO = {
  1: { title: "1st House (Ascendant)", desc: "Self, identity, appearance, new beginnings, vitality." },
  2: { title: "2nd House", desc: "Values, personal finances, self-worth, material wealth." },
  3: { title: "3rd House", desc: "Mind, communication, immediate environment, siblings." },
  4: { title: "4th House (Nadir)", desc: "Home, family, foundations, ancestry, private self." },
  5: { title: "5th House", desc: "Creativity, romance, pleasure, play, self-expression." },
  6: { title: "6th House", desc: "Health, work environment, service, daily routines." },
  7: { title: "7th House (Descendant)", desc: "Partnerships, marriage, collaborations, open relations." },
  8: { title: "8th House", desc: "Transformation, shared resources, intimacy, rebirth." },
  9: { title: "9th House", desc: "Philosophy, belief systems, higher learning, travel." },
  10: { title: "10th House (Midheaven)", desc: "Career, public reputation, ambitions, life calling." },
  11: { title: "11th House", desc: "Friendships, community groups, future goals, networks." },
  12: { title: "12th House", desc: "Subconscious, spiritual growth, secrets, solitude." }
};

const SIGN_ORDER = {
  'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3, 'Leo': 4, 'Virgo': 5,
  'Libra': 6, 'Scorpio': 7, 'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
};

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
  
  const [hoveredHouse, setHoveredHouse] = useState(null);
  const [showTransits, setShowTransits] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const downloadChartSVG = () => {
    const svgEl = document.getElementById('astro-chart-svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" encoding="utf-8"?>\n' + source;
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "natal_chart.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const getTransitPositions = () => {
    const transits = {};
    const shifts = {
      sun: 120,
      moon: 280,
      mercury: 95,
      venus: 45,
      mars: 190,
      jupiter: 30,
      saturn: 12,
      uranus: 4,
      neptune: 2,
      pluto: 1,
      north_node: -18,
      south_node: -18
    };
    
    Object.entries(chart.planets).forEach(([key, planet]) => {
      const shift = shifts[key] || 0;
      const natalLon = SIGN_ORDER[planet.sign] * 30 + planet.degree;
      const transitLon = (natalLon + shift) % 360;
      
      const signIdx = Math.floor(transitLon / 30);
      const degree = Math.round(transitLon % 30);
      const signName = ZODIAC_SIGNS[signIdx].name;
      
      const house = ((Math.floor(transitLon / 30) + 12 - Math.floor(natalLon / 30) + planet.house - 1) % 12) + 1;
      
      transits[key] = {
        degree,
        sign: signName,
        house,
        name: planet.name
      };
    });
    return transits;
  };

  const getCoordinates = (angleDeg, r) => {
    // 180 deg puts the Ascendant at the left (9 o'clock), standard in astrology
    const angleRad = ((angleDeg - 180) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const getAnnularSectorPath = (startAngle, endAngle, rIn, rOut) => {
    const pIn1 = getCoordinates(startAngle, rIn);
    const pOut1 = getCoordinates(startAngle, rOut);
    const pOut2 = getCoordinates(endAngle, rOut);
    const pIn2 = getCoordinates(endAngle, rIn);
    
    return `M ${pIn1.x} ${pIn1.y} L ${pOut1.x} ${pOut1.y} A ${rOut} ${rOut} 0 0 1 ${pOut2.x} ${pOut2.y} L ${pIn2.x} ${pIn2.y} A ${rIn} ${rIn} 0 0 0 ${pIn1.x} ${pIn1.y} Z`;
  };

  // Render house sectors
  const houseSectors = [];
  for (let h = 1; h <= 12; h++) {
    const startAngle = (h - 1) * 30;
    const endAngle = h * 30;
    const pathData = getAnnularSectorPath(startAngle, endAngle, 35, 98);
    
    houseSectors.push(
      <path
        key={`house-sector-${h}`}
        d={pathData}
        fill={hoveredHouse === h ? "rgba(223, 183, 60, 0.08)" : "transparent"}
        stroke="rgba(212, 175, 55, 0.03)"
        strokeWidth="0.5"
        className="cursor-pointer transition-all duration-200"
        onMouseEnter={() => setHoveredHouse(h)}
        onMouseLeave={() => setHoveredHouse(null)}
      />
    );
  }

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

  // 2. Precompute coordinates for all planets
  const planetCoords = {};
  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    const planetsInHouse = housePlanets[houseNum];
    const numPlanets = planetsInHouse.length;

    planetsInHouse.forEach((planet, index) => {
      const startAngle = (houseNum - 1) * 30;
      const midAngle = startAngle + 15;
      
      let r = showTransits ? 54 : 68;
      if (numPlanets > 1) {
        const minR = showTransits ? 42 : 45;
        const maxR = showTransits ? 66 : 82;
        r = minR + (index / (numPlanets - 1)) * (maxR - minR);
      }
      planetCoords[planet.key] = getCoordinates(midAngle, r);
    });
  }

  // Precompute transit coords if showTransits is true
  const transitCoords = {};
  const transitPositions = showTransits ? getTransitPositions() : {};
  if (showTransits) {
    const transitHousePlanets = {};
    for (let i = 1; i <= 12; i++) transitHousePlanets[i] = [];
    Object.entries(transitPositions).forEach(([key, planet]) => {
      transitHousePlanets[planet.house].push({ key, ...planet });
    });

    for (let houseNum = 1; houseNum <= 12; houseNum++) {
      const planetsInHouse = transitHousePlanets[houseNum];
      const numPlanets = planetsInHouse.length;
      planetsInHouse.forEach((planet, index) => {
        const startAngle = (houseNum - 1) * 30;
        const midAngle = startAngle + 15;
        let r = 80;
        if (numPlanets > 1) {
          const minR = 72;
          const maxR = 88;
          r = minR + (index / (numPlanets - 1)) * (maxR - minR);
        }
        transitCoords[planet.key] = getCoordinates(midAngle, r);
      });
    }
  }

  // 3. Render aspect lines between planets
  const aspectLines = [];
  const planetKeys = Object.keys(chart.planets);
  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1Key = planetKeys[i];
      const p2Key = planetKeys[j];
      const p1 = chart.planets[p1Key];
      const p2 = chart.planets[p2Key];
      
      if (!p1.sign || !p2.sign || !planetCoords[p1Key] || !planetCoords[p2Key]) continue;
      
      const idx1 = SIGN_ORDER[p1.sign];
      const idx2 = SIGN_ORDER[p2.sign];
      if (idx1 === undefined || idx2 === undefined) continue;
      
      const lon1 = idx1 * 30 + p1.degree;
      const lon2 = idx2 * 30 + p2.degree;
      
      let diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;
      
      let color = null;
      let label = '';
      let strokeDash = '';
      
      if (Math.abs(diff - 180) < 6) {
        color = '#ff1744'; // Red for Opposition
        label = 'Opposition';
      } else if (Math.abs(diff - 90) < 6) {
        color = '#b388ff'; // Purple for Square
        label = 'Square';
      } else if (Math.abs(diff - 120) < 6) {
        color = '#00e5ff'; // Blue for Trine
        label = 'Trine';
      } else if (Math.abs(diff - 60) < 5) {
        color = '#81c784'; // Green for Sextile
        label = 'Sextile';
        strokeDash = '2 2';
      }
      
      if (color) {
        const c1 = planetCoords[p1Key];
        const c2 = planetCoords[p2Key];
        aspectLines.push(
          <motion.line
            key={`aspect-${p1Key}-${p2Key}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.25 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            x1={c1.x}
            y1={c1.y}
            x2={c2.x}
            y2={c2.y}
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray={strokeDash}
            className="hover:opacity-85 transition-opacity duration-200 cursor-pointer"
          >
            <title>{`${PLANET_GLYPHS[p1Key]?.name || p1Key} ${label} ${PLANET_GLYPHS[p2Key]?.name || p2Key} (${diff.toFixed(1)}°)`}</title>
          </motion.line>
        );
      }
    }
  }

  // 4. Render planetary icons inside the wheel
  const planetElements = [];
  Object.entries(chart.planets).forEach(([key, planet], index) => {
    const coords = planetCoords[key];
    if (!coords) return;
    const glyph = PLANET_GLYPHS[key] || { symbol: '★', color: '#dfb73c', name: key };

    planetElements.push(
      <motion.g 
        key={`planet-node-${key}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.1 + index * 0.03 }}
      >
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
        <title>{`NATAL ${glyph.name}: ${planet.degree}° in ${planet.sign} (House ${planet.house})`}</title>
      </motion.g>
    );
  });

  // Render transit planets
  if (showTransits) {
    Object.entries(transitPositions).forEach(([key, planet], index) => {
      const coords = transitCoords[key];
      if (!coords) return;
      const glyph = PLANET_GLYPHS[key] || { symbol: '★', name: key };
      const transitColor = '#64b5f6';

      planetElements.push(
        <motion.g 
          key={`transit-node-${key}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 12, delay: index * 0.03 }}
        >
          {planetCoords[key] && (
            <line
              x1={planetCoords[key].x}
              y1={planetCoords[key].y}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(100, 181, 246, 0.2)"
              strokeWidth="0.6"
              strokeDasharray="1 1"
            />
          )}
          <motion.circle
            whileHover={{ scale: 1.4 }}
            cx={coords.x}
            cy={coords.y}
            r="6"
            fill="rgba(10, 11, 22, 0.95)"
            stroke={transitColor}
            strokeWidth="1"
            className="cursor-pointer"
          />
          <text
            x={coords.x}
            y={coords.y + 2}
            fill={transitColor}
            fontSize="6"
            textAnchor="middle"
            fontFamily="sans-serif"
            className="pointer-events-none font-bold"
          >
            {glyph.symbol}
          </text>
          <title>{`TRANSIT ${glyph.name}: ${planet.degree}° in ${planet.sign} (House ${planet.house})`}</title>
        </motion.g>
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
    <div className="flex flex-col items-center justify-center bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow w-full">
      <div className="flex justify-between items-center w-full mb-3 px-1">
        <span className="text-[10px] font-bold text-astro-gold uppercase tracking-wider font-mono">Natal Chart</span>
        <div className="flex gap-1.5">
          <button
            onClick={downloadChartSVG}
            className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border bg-transparent text-astro-textMuted border-astro-cardBorder border-opacity-30 hover:border-opacity-65 hover:text-astro-gold cursor-pointer transition-all duration-300"
            title="Download Chart SVG"
          >
            Download SVG
          </button>
          <button
            onClick={() => setShowTransits(!showTransits)}
            className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border cursor-pointer transition-all duration-300 ${
              showTransits 
                ? 'bg-astro-purple text-white border-astro-purple border-opacity-50' 
                : 'bg-transparent text-astro-textMuted border-astro-cardBorder border-opacity-30 hover:border-opacity-65 hover:text-astro-gold'
            }`}
          >
            {showTransits ? 'Transits ON' : 'Show Transits'}
          </button>
        </div>
      </div>
      <div className="relative w-64 h-64">
        <svg id="astro-chart-svg" className="w-full h-full" viewBox="0 0 240 240">
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
          
          <g transform={`rotate(${wheelRotation}, ${cx}, ${cy})`}>
            {/* House Sectors */}
            {houseSectors}

            {/* Spokes and divisions */}
            {spokes}

            {/* Astrological Aspect Lines */}
            {aspectLines}

            {/* Planet SVG Elements */}
            {planetElements}

            {/* Zodiac Labels */}
            {zodiacLabels}
          </g>

          {/* Outer Ring Border highlights */}
          <circle cx={cx} cy={cy} r="115" fill="none" stroke="rgba(125, 82, 255, 0.3)" strokeWidth="0.5" className="star-twinkle-slow" />
        </svg>
      </div>

      {/* Rotation slider */}
      <div className="w-full mt-2.5 flex items-center justify-between gap-3 px-3 py-1.5 bg-[#0a0b16] bg-opacity-35 border border-astro-cardBorder border-opacity-15 rounded-xl">
        <span className="text-[9px] font-bold text-astro-textMuted uppercase tracking-wider font-mono">Rotate Wheel:</span>
        <input 
          type="range"
          min="0"
          max="360"
          value={wheelRotation}
          onChange={(e) => setGlowEnabled ? setWheelRotation(parseInt(e.target.value)) : setWheelRotation(parseInt(e.target.value))}
          className="flex-1 h-1 bg-astro-cardBorder rounded-lg appearance-none cursor-pointer accent-astro-gold"
        />
        <span className="text-[9px] font-mono font-bold text-astro-gold">{wheelRotation}°</span>
      </div>

      {/* House info tooltip display */}
      <div className="w-full min-h-[46px] mt-3 px-3 py-2 bg-astro-bg bg-opacity-50 border border-astro-cardBorder border-opacity-20 rounded-xl flex flex-col justify-center transition-all duration-300">
        {hoveredHouse ? (
          <div className="animate-fade-in text-left">
            <div className="text-[9px] font-bold text-astro-gold uppercase tracking-wider font-mono">
              {HOUSE_INFO[hoveredHouse].title}
            </div>
            <div className="text-[8.5px] text-astro-textMuted leading-tight font-sans mt-0.5">
              {HOUSE_INFO[hoveredHouse].desc}
            </div>
          </div>
        ) : (
          <div className="text-[9px] text-astro-textMuted font-mono uppercase tracking-widest text-center">
            Hover houses for alignments
          </div>
        )}
      </div>
    </div>
  );
}
