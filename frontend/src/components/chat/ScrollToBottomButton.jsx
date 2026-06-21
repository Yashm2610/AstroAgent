import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function ScrollToBottomButton({ onClick, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="absolute bottom-6 right-8 p-3 rounded-full bg-astro-card border border-astro-gold border-opacity-35 text-astro-gold hover:text-white hover:bg-astro-indigo shadow-glowGlow flex items-center justify-center transition-colors duration-300 cursor-pointer z-40"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-4.5 w-4.5 text-astro-gold hover:text-white animate-bounce" style={{ animationDuration: '2s' }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
