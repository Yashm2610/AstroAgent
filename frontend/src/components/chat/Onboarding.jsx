import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, X, ChevronRight, BookOpen } from 'lucide-react';

const STEPS = [
  { title: 'Welcome to AstroAgent!', desc: 'This onboarding wizard will guide you through your cosmic dashboard. Let\'s explore!' },
  { title: 'Interactive Birth Chart', desc: 'In the sidebar, select the Wheel tab. You can toggle between Western circular chart and Vedic square grid. Hover signs or houses to view planetary dynamics.' },
  { title: 'Oracle Guidance', desc: 'Tap the "Draw Oracle Card" button in the sidebar to draw a daily guidance card for meditation and spiritual focus.' },
  { title: 'Astro-Journal & Bookmarks', desc: 'Hover over AI messages in the chat window to bookmark specific paragraphs or click emoji reactions (✨, 🪐, 🔮, 🙏).' },
  { title: 'Consultation Chat', desc: 'Type customized questions about career paths, transits, or relationship synastry, or tap suggestion chips to instantly initiate calculations.' }
];

export default function Onboarding() {
  const [show, setShow] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem('astroagent_onboarding_done');
    if (!done) {
      setShow(true);
    }
  }, []);

  const handleNext = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(prev => prev + 1);
    } else {
      dismiss();
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('astroagent_onboarding_done', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 bg-gradient-to-r from-[#141530] to-[#0a0b16] border border-astro-gold border-opacity-30 p-4 rounded-2xl relative shadow-goldGlow font-sans text-astro-textMain"
        >
          {/* Close button */}
          <button 
            onClick={dismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-astro-indigo hover:text-astro-gold text-astro-textMuted transition cursor-pointer"
            title="Dismiss Tour"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex gap-3.5 items-start">
            <div className="h-9 w-9 rounded-full bg-astro-indigo bg-opacity-70 border border-astro-gold border-opacity-25 flex items-center justify-center text-astro-gold flex-shrink-0 mt-0.5">
              <Sparkles className="h-4.5 w-4.5 star-twinkle-fast" />
            </div>

            <div className="space-y-1.5 flex-1 pr-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-astro-gold">Onboarding Wizard</span>
                <span className="text-[9px] font-mono text-astro-textMuted bg-astro-indigo px-1.5 py-0.2 rounded border border-astro-cardBorder border-opacity-15 font-semibold">
                  Step {stepIdx + 1} of {STEPS.length}
                </span>
              </div>
              <h4 className="text-sm font-bold">{STEPS[stepIdx].title}</h4>
              <p className="text-[11px] text-astro-textMuted leading-relaxed max-w-xl">
                {STEPS[stepIdx].desc}
              </p>
              
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleNext}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-astro-gold to-[#fbe087] text-astro-bg text-[10px] font-bold tracking-wider uppercase rounded-lg shadow-goldGlow cursor-pointer hover:scale-[1.02] transition flex items-center gap-1"
                >
                  <span>{stepIdx === STEPS.length - 1 ? 'Get Started' : 'Next Step'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
                {stepIdx < STEPS.length - 1 && (
                  <button
                    onClick={dismiss}
                    className="text-[9px] font-mono text-astro-textMuted hover:text-astro-gold uppercase font-semibold cursor-pointer"
                  >
                    Skip Tour
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
