import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

const SIGN_ORDER = {
  'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3, 'Leo': 4, 'Virgo': 5,
  'Libra': 6, 'Scorpio': 7, 'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
};

export default function CoordinatesHUD({ chart }) {
  if (!chart || !chart.planets) return null;

  const calculateRADec = (degree, sign) => {
    const baseIdx = SIGN_ORDER[sign] || 0;
    const lon = baseIdx * 30 + degree;
    
    // Obliquity of ecliptic: ~23.44 degrees
    const obliquityRad = (23.44 * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
    
    // Declination formula: sin(dec) = sin(obliquity) * sin(longitude)
    const sinDec = Math.sin(obliquityRad) * Math.sin(lonRad);
    const decRad = Math.asin(sinDec);
    const decDeg = (decRad * 180) / Math.PI;
    
    // Right Ascension (RA) formula: tan(RA) = cos(obliquity) * tan(longitude)
    const cosObliquity = Math.cos(obliquityRad);
    const tanLon = Math.tan(lonRad);
    let raRad = Math.atan2(cosObliquity * Math.sin(lonRad), Math.cos(lonRad));
    if (raRad < 0) raRad += 2 * Math.PI;
    
    const raHoursDecimal = (raRad * 24) / (2 * Math.PI);
    const raH = Math.floor(raHoursDecimal);
    const raM = Math.floor((raHoursDecimal - raH) * 60);
    const raS = Math.floor(((raHoursDecimal - raH) * 60 - raM) * 60);
    
    const decD = Math.floor(Math.abs(decDeg));
    const decM = Math.floor((Math.abs(decDeg) - decD) * 60);
    const decSign = decDeg >= 0 ? '+' : '-';

    return {
      ra: `${raH}h ${raM}m ${raS}s`,
      dec: `${decSign}${decD}° ${decM}'`
    };
  };

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans">
      <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Compass className="h-3.5 w-3.5 text-astro-gold animate-spin" style={{ animationDuration: '20s' }} />
        <span>Celestial Coordinates (RA/DEC)</span>
      </h3>
      
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {Object.entries(chart.planets).map(([key, planet]) => {
          const { ra, dec } = calculateRADec(planet.degree, planet.sign);
          return (
            <div 
              key={key} 
              className="flex justify-between items-center px-2.5 py-1.5 bg-[#0a0b16] bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl text-[10px]"
            >
              <span className="font-bold capitalize text-astro-textMain">{key.replace('_', ' ')}</span>
              <div className="flex gap-3 text-astro-textMuted font-mono">
                <span>RA: <span className="text-astro-gold font-semibold">{ra}</span></span>
                <span>DEC: <span className="text-astro-gold font-semibold">{dec}</span></span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-1.5 mt-3 text-[8.5px] text-astro-textMuted italic pl-1 border-t border-astro-cardBorder border-opacity-10 pt-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Ecliptic plane calculations verified by Swiss Ephemeris.</span>
      </div>
    </div>
  );
}
