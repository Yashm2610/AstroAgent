import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { Compass, Sparkles, BookOpen, Clock, Loader2 } from 'lucide-react';

const TOOL_CONFIG = {
  tool_geocode_place: {
    label: 'Geocoding Coordinates & Target Timezone',
    icon: <Compass className="h-4.5 w-4.5 text-astro-gold animate-spin" style={{ animationDuration: '3s' }} />,
    color: 'border-astro-gold border-opacity-40 bg-astro-gold bg-opacity-5'
  },
  tool_compute_birth_chart: {
    label: 'Computing Natal Celestial Positions & Houses',
    icon: <Sparkles className="h-4.5 w-4.5 text-astro-purple animate-pulse" />,
    color: 'border-astro-purple border-opacity-40 bg-astro-purple bg-opacity-5'
  },
  tool_compute_transits: {
    label: 'Calculating Live Planetary Horizon Transits',
    icon: <Clock className="h-4.5 w-4.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />,
    color: 'border-blue-500 border-opacity-35 bg-blue-500 bg-opacity-5'
  },
  tool_knowledge_lookup: {
    label: 'Consulting Astrological Semantic Library (RAG)',
    icon: <BookOpen className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />,
    color: 'border-emerald-500 border-opacity-35 bg-emerald-500 bg-opacity-5'
  }
};

export default function ToolActivity() {
  const { activeTools } = useChatStore();

  if (!activeTools || activeTools.length === 0) return null;

  return (
    <div className="w-full bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-30 rounded-2xl p-4.5 mb-4 animate-fade-in shadow-glow">
      <div className="flex items-center gap-2 text-[10px] font-bold text-astro-textMuted uppercase tracking-widest mb-3 border-b border-astro-cardBorder border-opacity-10 pb-2">
        <Loader2 className="animate-spin h-3.5 w-3.5 text-astro-gold" />
        <span>Celestial Reasoning Pipeline Active</span>
      </div>
      <div className="space-y-2.5">
        <AnimatePresence>
          {activeTools.map((tool) => {
            const config = TOOL_CONFIG[tool] || {
              label: `Executing subsystem: ${tool}`,
              icon: <Loader2 className="animate-spin h-4.5 w-4.5 text-astro-gold" />,
              color: 'border-astro-cardBorder border-opacity-30 bg-astro-bg'
            };
            return (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                className={`flex items-center gap-3.5 text-xs text-astro-textMain p-3 border rounded-xl shadow-glow ${config.color}`}
              >
                <div className="flex-shrink-0 bg-astro-indigo bg-opacity-50 p-1.5 rounded-lg border border-astro-cardBorder border-opacity-10">
                  {config.icon}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-[9px] text-astro-textMuted font-bold uppercase tracking-wider">{tool}</div>
                  <div className="text-astro-textMain font-semibold mt-0.5 text-xs">{config.label}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
