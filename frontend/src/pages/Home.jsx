import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Moon, Orbit, ArrowRight, Stars } from 'lucide-react';

const COSMIC_QUOTES = [
  { text: "Astronomy is useful because it raises the mind to the contemplation of things above.", author: "Plato" },
  { text: "The stars in heaven sing a music if only we had ears to hear it.", author: "Pythagoras" },
  { text: "Millionaires don't use Astrology, billionaires do.", author: "J.P. Morgan" },
  { text: "We are born at a given moment, in a given place and, like vintage years of wine, we have the qualities of the year and of the season in which we are born.", author: "Carl Jung" },
  { text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.", author: "Carl Sagan" }
];

export default function Home({ onStart }) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % COSMIC_QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-6 relative overflow-hidden w-full">
      {/* Background glowing orbs */}
      <div className="absolute top-1/10 left-1/10 h-96 w-96 rounded-full bg-astro-purple opacity-[0.08] blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/10 right-1/10 h-[450px] w-[450px] rounded-full bg-astro-gold opacity-[0.04] blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>

      {/* Floating Constellation Lines / SVG (pure decorative) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full rotate-slow" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.2" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(125, 82, 255, 0.05)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="0.15" strokeDasharray="5 5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-3xl space-y-8 mt-6"
      >
        {/* Cosmos emblem */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-40 text-xs text-astro-gold shadow-glow cursor-pointer"
        >
          <Stars className="h-3.5 w-3.5 text-astro-gold star-twinkle-fast" />
          <span className="font-mono tracking-wider uppercase font-semibold text-[10px]">Align With The Cosmos v1.0</span>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-sans leading-tight">
            Welcome to <span className="text-gold-gradient block sm:inline">AstroAgent</span>
          </h1>
          <p className="text-base md:text-xl text-astro-textMuted leading-relaxed max-w-2xl mx-auto font-sans">
            A premium, AI-driven astrological sanctuary. By synthesizing Swiss Ephemeris mathematics with advanced cognitive reasoning loops, we chart your celestial course and answer your deepest life inquiries.
          </p>
        </div>

        {/* Rotating Cosmic Quote Block */}
        <div className="min-h-[80px] flex items-center justify-center max-w-xl mx-auto py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center italic text-xs md:text-sm text-astro-textMuted font-mono px-4 border-l border-r border-astro-cardBorder border-opacity-30"
            >
              "{COSMIC_QUOTES[quoteIdx].text}"
              <span className="block mt-1.5 text-[10px] text-astro-gold not-italic font-semibold tracking-wide uppercase">— {COSMIC_QUOTES[quoteIdx].author}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 text-left max-w-2xl mx-auto">
          <motion.div 
            whileHover={{ y: -5, borderColor: 'rgba(223, 183, 60, 0.4)' }}
            className="p-5 bg-astro-card border border-astro-cardBorder border-opacity-20 rounded-2xl shadow-glow transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <Compass className="h-6 w-6 text-astro-gold mb-3 float-slow" />
            <h4 className="text-sm font-bold text-astro-textMain font-sans flex items-center gap-1.5">
              Vedic & Western Precision
            </h4>
            <p className="text-xs text-astro-textMuted mt-1.5 leading-relaxed">
              Precise longitude mapping of celestial objects and custom Placidus boundary calculation.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, borderColor: 'rgba(223, 183, 60, 0.4)' }}
            className="p-5 bg-astro-card border border-astro-cardBorder border-opacity-20 rounded-2xl shadow-glow transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <Orbit className="h-6 w-6 text-astro-purple mb-3 animate-spin" style={{ animationDuration: '12s' }} />
            <h4 className="text-sm font-bold text-astro-textMain font-sans">
              Dynamic Transits
            </h4>
            <p className="text-xs text-astro-textMuted mt-1.5 leading-relaxed">
              Real-time calculations coordinates updated for your precise geographic local time and space.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, borderColor: 'rgba(223, 183, 60, 0.4)' }}
            className="p-5 bg-astro-card border border-astro-cardBorder border-opacity-20 rounded-2xl shadow-glow transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <Moon className="h-6 w-6 text-blue-400 mb-3 float-medium" />
            <h4 className="text-sm font-bold text-astro-textMain font-sans">
              RAG Astrological Notes
            </h4>
            <p className="text-xs text-astro-textMuted mt-1.5 leading-relaxed">
              Calculations are grounded via a semantic knowledge base of planetary lessons and transit history.
            </p>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="pt-6 pb-8">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(223, 183, 60, 0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="px-10 py-4.5 bg-gradient-to-r from-astro-gold to-[#fbe087] hover:from-[#cda22b] hover:to-[#dfb73c] text-astro-bg font-black text-sm tracking-wider uppercase rounded-2xl transition duration-300 shadow-goldGlow cursor-pointer inline-flex items-center gap-2.5"
          >
            <span>Begin Consultation</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
