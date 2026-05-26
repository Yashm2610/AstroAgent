import React from 'react';
import { Sparkles, Compass, Moon } from 'lucide-react';

export default function Home({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-6 relative bg-cosmos-gradient overflow-hidden">
      
      {/* Astrological floating shapes */}
      <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-astro-purple opacity-5 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 h-96 w-96 rounded-full bg-astro-gold opacity-[0.02] blur-[150px] animate-pulse" style={{ animationDuration: '6s' }}></div>

      <div className="z-10 max-w-2xl space-y-6">
        
        {/* Cosmos emblem */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-35 text-xs text-astro-gold shadow-glow animate-bounce">
          <Moon className="h-3.5 w-3.5" />
          <span className="font-mono tracking-wider uppercase font-semibold">Align With The Cosmos</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans">
          Welcome to <span className="text-gold-gradient">AstroAgent</span>
        </h1>

        <p className="text-base md:text-lg text-astro-textMuted leading-relaxed max-w-xl mx-auto font-sans">
          A premium AI astrological consultant. We combine Swiss Ephemeris astronomical algorithms, geocoding timezone solvers, and advanced reasoning models to deliver personalized cosmic insights.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-xl mx-auto">
          <div className="p-4 bg-astro-card border border-astro-cardBorder border-opacity-10 rounded-xl shadow-glow">
            <Compass className="h-5 w-5 text-astro-gold mb-2" />
            <h4 className="text-sm font-bold text-astro-textMain font-sans">Vedic Precision</h4>
            <p className="text-xs text-astro-textMuted mt-1">Exact house boundary mapping via Placidus engines.</p>
          </div>
          <div className="p-4 bg-astro-card border border-astro-cardBorder border-opacity-10 rounded-xl shadow-glow">
            <Sparkles className="h-5 w-5 text-astro-purple mb-2" />
            <h4 className="text-sm font-bold text-astro-textMain font-sans">Dynamic Transits</h4>
            <p className="text-xs text-astro-textMuted mt-1">Real-time planetary analysis synced with your location.</p>
          </div>
          <div className="p-4 bg-astro-card border border-astro-cardBorder border-opacity-10 rounded-xl shadow-glow">
            <Moon className="h-5 w-5 text-blue-400 mb-2" />
            <h4 className="text-sm font-bold text-astro-textMain font-sans">Retrieval-Grounded</h4>
            <p className="text-xs text-astro-textMuted mt-1">RAG-grounded interpretations of planetary lessons.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-astro-gold to-[#f5d471] hover:from-[#cda22b] hover:to-[#dfb73c] text-astro-bg font-extrabold text-base rounded-xl transition duration-300 shadow-goldGlow hover:scale-105 transform cursor-pointer inline-flex items-center gap-2"
          >
            <span>Begin Reading</span>
            <Sparkles className="h-5 w-5 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}
