import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { Compass, Sparkles, BookOpen, Clock, Loader2 } from 'lucide-react';

export default function ToolActivity() {
  const { activeTools } = useChatStore();

  if (!activeTools || activeTools.length === 0) return null;

  const toolLabels = {
    tool_geocode_place: {
      label: 'Geolocating coordinates & local timezone...',
      icon: <Compass className="h-4 w-4 text-astro-gold animate-spin" />,
    },
    tool_compute_birth_chart: {
      label: 'Casting natal planet degrees & houses...',
      icon: <Sparkles className="h-4 w-4 text-astro-purple animate-pulse" />,
    },
    tool_compute_transits: {
      label: 'Calculating current planetary alignments...',
      icon: <Clock className="h-4 w-4 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />,
    },
    tool_knowledge_lookup: {
      label: 'Searching local RAG library files...',
      icon: <BookOpen className="h-4 w-4 text-green-400 animate-pulse" />,
    },
  };

  return (
    <div className="w-full bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-40 rounded-xl p-4 space-y-2 mb-4 animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-semibold text-astro-textMuted uppercase tracking-wider mb-1">
        <Loader2 className="animate-spin h-3 w-3 text-astro-gold" />
        <span>Active Agent Processing</span>
      </div>
      <div className="space-y-2">
        {activeTools.map((tool) => {
          const config = toolLabels[tool] || {
            label: `Executing agent subsystem: ${tool}...`,
            icon: <Loader2 className="animate-spin h-4 w-4 text-astro-gold" />,
          };
          return (
            <div key={tool} className="flex items-center gap-3 text-sm text-astro-textMain bg-astro-bg bg-opacity-65 rounded-lg px-3 py-2 border border-astro-cardBorder border-opacity-20 shadow-glow">
              <span className="flex-shrink-0">{config.icon}</span>
              <span className="font-mono text-xs text-astro-textMuted">{tool}</span>
              <span className="text-astro-textMain">{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
