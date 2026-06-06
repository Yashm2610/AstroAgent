import React, { useState, useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import Home from './pages/Home';
import BirthForm from './components/forms/BirthForm';
import Chat from './pages/Chat';
import { Moon, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { toggleMuteStatus, getMuteStatus } from './services/soundEffects';
import MouseTrail from './components/chat/MouseTrail';

export default function App() {
  const { birthDetails, setBirthDetails, theme, setTheme } = useChatStore();
  const [view, setView] = useState('home'); // 'home' | 'birth-form' | 'chat'
  const [muted, setMuted] = useState(getMuteStatus());

  // Apply theme class to body
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Restore session if details are stored in localStorage
  useEffect(() => {
    if (birthDetails) {
      setView('chat');
    }
  }, [birthDetails]);

  const handleStart = () => {
    setView('birth-form');
  };

  const handleBirthSuccess = () => {
    setView('chat');
  };

  const handleResetBirthDetails = () => {
    if (window.confirm('Do you want to clear your current birth profile and cast a new chart?')) {
      localStorage.removeItem('astroagent_birth_details');
      // We keep user id but clear chart details
      setBirthDetails(null);
      setView('birth-form');
    }
  };

  return (
    <div className="min-h-screen bg-astro-bg text-astro-textMain bg-cosmos-gradient flex flex-col font-sans relative overflow-hidden">
      {/* Parallax Starry Background Layers */}
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
      
      {/* Mouse cursor particle trail */}
      <MouseTrail />
      
      {/* Top Navigation Header */}
      <header className="px-6 py-4 border-b border-astro-cardBorder border-opacity-25 flex items-center justify-between backdrop-blur-md bg-astro-bg bg-opacity-80 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="h-8 w-8 rounded-full bg-astro-indigo border border-astro-cardBorder border-opacity-35 flex items-center justify-center">
            <Moon className="h-4.5 w-4.5 text-astro-gold" />
          </div>
          <span className="font-bold text-sm tracking-wide font-mono text-astro-textMain uppercase">
            Astro<span className="text-astro-gold">Agent</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 px-2.5 py-1 rounded-full text-[10px] font-mono">
            <span className="text-astro-textMuted uppercase">Theme:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-transparent text-astro-gold font-bold focus:outline-none cursor-pointer uppercase text-[10px] border-none outline-none"
            >
              <option value="indigo" className="bg-[#0a0b16] text-[#dfb73c]">Indigo</option>
              <option value="nebula" className="bg-[#080312] text-[#dfb73c]">Nebula</option>
              <option value="silver" className="bg-[#06080e] text-[#dfb73c]">Silver</option>
            </select>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              const nextMuted = toggleMuteStatus();
              setMuted(nextMuted);
            }}
            className="p-1.5 rounded-full bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 text-astro-gold hover:text-astro-goldHover transition cursor-pointer"
            title={muted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <span className="text-xs text-astro-textMuted font-mono bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-astro-gold" />
            <span>v1.0.0</span>
          </span>
        </div>
      </header>

      {/* Main Page Layout Switcher */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto w-full relative z-10">
        {view === 'home' && <Home onStart={handleStart} />}
        
        {view === 'birth-form' && (
          <div className="flex flex-col items-center justify-center p-4">
            <BirthForm onSuccess={handleBirthSuccess} />
            <button
              onClick={() => setView('home')}
              className="mt-4 text-xs text-astro-textMuted hover:text-astro-gold font-semibold transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}
        
        {view === 'chat' && <Chat onBack={handleResetBirthDetails} />}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-astro-textMuted border-t border-astro-cardBorder border-opacity-10 bg-astro-bg bg-opacity-90">
        <p className="font-mono">© 2026 AstroAgent Systems. Built with LangGraph, flatlib & Vite.</p>
      </footer>
    </div>
  );
}
