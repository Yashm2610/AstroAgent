import React, { useState, useEffect } from 'react';
import { BookOpen, Trash2, Calendar, Star } from 'lucide-react';

export default function AstroJournal() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('astroagent_journal');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (id) => {
    const next = bookmarks.filter(b => b.id !== id);
    setBookmarks(next);
    localStorage.setItem('astroagent_journal', JSON.stringify(next));
  };

  const clearJournal = () => {
    if (window.confirm('Clear all saved cosmic journal entries?')) {
      setBookmarks([]);
      localStorage.removeItem('astroagent_journal');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans text-astro-textMain">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-astro-gold" />
          <span>My Astro-Journal</span>
        </h3>
        {bookmarks.length > 0 && (
          <button 
            onClick={clearJournal}
            className="text-[9px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 uppercase transition cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-8 px-4 border border-astro-cardBorder border-opacity-15 bg-[#0a0b16] bg-opacity-40 rounded-xl">
          <BookOpen className="h-6 w-6 text-astro-textMuted mx-auto mb-2 opacity-50" />
          <p className="text-[10px] text-astro-textMuted leading-relaxed">
            No entries bookmarked yet. Tap the star icon next to AI responses to save insights here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {bookmarks.map((entry) => (
            <div 
              key={entry.id} 
              className="p-3 bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-15 rounded-xl space-y-2 relative group"
            >
              <button
                onClick={() => removeBookmark(entry.id)}
                className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-950/20 text-astro-textMuted hover:text-red-400 transition cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remove entry"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1.5 text-[8px] text-astro-gold font-mono uppercase font-semibold">
                <Calendar className="h-3 w-3" />
                <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
              </div>

              <p className="text-[10px] text-astro-textMuted leading-relaxed whitespace-pre-wrap font-sans pr-4 italic">
                "{entry.text.substring(0, 150)}{entry.text.length > 150 ? '...' : ''}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
