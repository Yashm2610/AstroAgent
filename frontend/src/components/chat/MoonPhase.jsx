import React from 'react';
import { Moon } from 'lucide-react';

const LUNAR_CYCLE = 29.530588853;
// Known New Moon: Jan 6, 2000 18:14:00 UTC
const NEW_MOON_BASE = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();

export default function MoonPhase() {
  const getMoonData = () => {
    const now = Date.now();
    const diffMs = now - NEW_MOON_BASE;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const age = diffDays % LUNAR_CYCLE;
    
    // Percentage illumination
    const phaseValue = age / LUNAR_CYCLE; // 0.0 to 1.0
    let illumination = 0;
    if (phaseValue <= 0.5) {
      illumination = phaseValue * 2 * 100;
    } else {
      illumination = (1 - phaseValue) * 2 * 100;
    }
    
    let phaseName = '';
    let svgPath = ''; // Custom SVG path drawing to shade the moon
    
    // Approximate phase name and SVG shading path
    // Under 50px radius circle
    if (age < 1.84 || age >= 27.68) {
      phaseName = 'New Moon';
      // shaded entirely
      svgPath = 'M 50 0 A 50 50 0 1 0 50 100 A 50 50 0 1 0 50 0';
    } else if (age < 5.54) {
      phaseName = 'Waxing Crescent';
      svgPath = 'M 50 0 A 50 50 0 0 1 50 100 A 25 50 0 0 1 50 0 Z';
    } else if (age < 9.23) {
      phaseName = 'First Quarter';
      svgPath = 'M 50 0 A 50 50 0 0 1 50 100 Z';
    } else if (age < 12.92) {
      phaseName = 'Waxing Gibbous';
      svgPath = 'M 50 0 A 50 50 0 0 1 50 100 A 25 50 0 0 0 50 0 Z';
    } else if (age < 16.61) {
      phaseName = 'Full Moon';
      svgPath = ''; // completely illuminated, no shadow path
    } else if (age < 20.30) {
      phaseName = 'Waning Gibbous';
      svgPath = 'M 50 0 A 25 50 0 0 0 50 100 A 50 50 0 0 1 50 0 Z';
    } else if (age < 23.99) {
      phaseName = 'Last Quarter';
      svgPath = 'M 50 0 A 50 50 0 0 0 50 100 Z';
    } else {
      phaseName = 'Waning Crescent';
      svgPath = 'M 50 0 A 50 50 0 0 0 50 100 A 25 50 0 0 1 50 0 Z';
    }

    return {
      age: age.toFixed(2),
      illumination: Math.round(illumination),
      phaseName,
      phaseValue,
      svgPath
    };
  };

  const data = getMoonData();

  return (
    <div className="bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4 shadow-glow mt-4 text-astro-textMain font-sans flex items-center justify-between">
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-astro-gold" />
          <span>Current Moon Phase</span>
        </h3>
        <div>
          <div className="text-sm font-bold text-astro-textMain">{data.phaseName}</div>
          <div className="text-[10px] text-astro-textMuted font-mono">
            Illumination: {data.illumination}% | Age: {data.age} days
          </div>
        </div>
      </div>

      {/* Interactive Moon Visual */}
      <div className="h-14 w-14 rounded-full bg-[#111227] border border-astro-cardBorder border-opacity-35 relative flex items-center justify-center overflow-hidden shadow-glow">
        <svg viewBox="0 0 100 100" className="h-10 w-10">
          {/* Base illuminated moon background */}
          <circle cx="50" cy="50" r="48" fill="#ffe596" />
          
          {/* Shadow overlay */}
          {data.svgPath && (
            <path d={data.svgPath} fill="#06070d" opacity="0.85" />
          )}
          
          {/* Crater textures (drawn on top of background) */}
          <circle cx="35" cy="30" r="5" fill="#eac762" opacity="0.3" />
          <circle cx="65" cy="45" r="7" fill="#eac762" opacity="0.3" />
          <circle cx="45" cy="70" r="6" fill="#eac762" opacity="0.3" />
          <circle cx="55" cy="20" r="4" fill="#eac762" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}
