import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCw, Eye } from 'lucide-react';

const ORACLE_CARDS = [
  { name: 'The Star', keyword: 'Hope & Inspiration', desc: 'A beacon of hope guides your path. Trust the timing of your life and keep your vision clear.' },
  { name: 'The Cosmos', keyword: 'Expansion & Unity', desc: 'You are interconnected with all things. Expand your awareness beyond immediate horizons.' },
  { name: 'The Eclipse', keyword: 'Shadow Work & Transformation', desc: 'Hidden aspects are coming to light. Embrace the transition and release what no longer serves you.' },
  { name: 'The Nebula', keyword: 'Creation & Potential', desc: 'Stars are born in chaos. Do not fear uncertainty; it is the fertile ground for new beginnings.' },
  { name: 'The Crescent', keyword: 'Intuition & Cycles', desc: 'Align your actions with natural rhythms. Listen to your inner voice and allow yourself to rest.' },
  { name: 'The Sun', keyword: 'Clarity & Radiance', desc: 'Success and vitality are yours. Shine your light boldly and let your truth be seen.' },
  { name: 'The Comet', keyword: 'Sudden Shift & Action', desc: 'A fast-moving opportunity is approaching. Be ready to take swift, aligned action.' },
  { name: 'The Orbit', keyword: 'Consistency & Alignment', desc: 'Find your center and stay your course. Harmony comes from balanced, repeating patterns.' }
];

export default function OracleDrawer({ isOpen, onClose }) {
  const [drawnCard, setDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCard = () => {
    setIsDrawing(true);
    setDrawnCard(null);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * ORACLE_CARDS.length);
      setDrawnCard(ORACLE_CARDS[idx]);
      setIsDrawing(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-[#0a0b16] border-l border-astro-cardBorder border-opacity-35 z-50 p-6 flex flex-col justify-between shadow-2xl text-astro-textMain"
          >
            <div>
              <div className="flex items-center justify-between border-b border-astro-cardBorder border-opacity-25 pb-4 mb-6">
                <h2 className="text-base font-bold text-astro-gold uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Sparkles className="h-4 w-4 star-twinkle-fast" />
                  <span>Celestial Oracle</span>
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-astro-indigo hover:text-astro-gold transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <p className="text-xs text-astro-textMuted leading-relaxed mb-6 font-sans">
                Clear your mind, set an intention, and draw a daily guidance card from our mystical deck.
              </p>

              {/* Card Drawing Area */}
              <div className="flex flex-col items-center justify-center py-6">
                {isDrawing ? (
                  <motion.div
                    animate={{ rotateY: 360, scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-48 h-72 rounded-2xl border-2 border-dashed border-astro-gold border-opacity-40 flex items-center justify-center bg-astro-indigo bg-opacity-25 shadow-glow"
                  >
                    <Sparkles className="h-8 w-8 text-astro-gold animate-spin" />
                  </motion.div>
                ) : drawnCard ? (
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.9 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    className="w-52 h-80 rounded-2xl border-2 border-astro-gold bg-gradient-to-b from-[#14152e] to-[#0a0b16] shadow-goldGlow p-5 flex flex-col justify-between items-center text-center relative overflow-hidden"
                  >
                    {/* Decorative cosmic graphics */}
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                      <svg className="w-full h-full rotate-slow" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#dfb73c" strokeWidth="0.5" strokeDasharray="1 2" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#dfb73c" strokeWidth="0.3" />
                      </svg>
                    </div>

                    <div className="text-[10px] text-astro-gold font-mono tracking-widest uppercase font-semibold border-b border-astro-cardBorder border-opacity-30 pb-1 w-full">
                      Daily Guidance
                    </div>

                    <div className="my-auto flex flex-col items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-astro-indigo bg-opacity-60 border border-astro-cardBorder flex items-center justify-center text-astro-gold">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-black tracking-wide font-sans text-astro-textMain">{drawnCard.name}</h3>
                      <span className="text-[10px] text-astro-gold bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-25 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
                        {drawnCard.keyword}
                      </span>
                    </div>

                    <p className="text-[11px] text-astro-textMuted leading-relaxed font-sans mt-2">
                      {drawnCard.desc}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={drawCard}
                    className="w-48 h-72 rounded-2xl border border-astro-cardBorder bg-[#14162d] flex flex-col items-center justify-center cursor-pointer shadow-glow hover:border-astro-gold transition-all duration-300 relative group"
                  >
                    <div className="absolute inset-2 border border-dashed border-astro-cardBorder border-opacity-35 rounded-xl group-hover:border-astro-gold transition" />
                    <Sparkles className="h-8 w-8 text-astro-textMuted group-hover:text-astro-gold transition mb-3" />
                    <span className="text-xs font-bold font-mono text-astro-textMuted group-hover:text-astro-gold transition uppercase tracking-wide">
                      Draw Card
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-6">
              {drawnCard && (
                <button
                  onClick={drawCard}
                  className="w-full py-2.5 bg-astro-indigo bg-opacity-45 hover:bg-opacity-65 border border-astro-cardBorder hover:border-astro-gold text-astro-gold font-bold font-mono text-xs uppercase rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Draw Another Card</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
