import React, { useState, useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import Home from './pages/Home';
import BirthForm from './components/forms/BirthForm';
import Chat from './pages/Chat';
import { Moon, Sparkles } from 'lucide-react';

export default function App() {
  const { birthDetails, setBirthDetails } = useChatStore();
  const [view, setView] = useState('home'); // 'home' | 'birth-form' | 'chat'

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
    <div className="min-h-screen bg-astro-bg text-astro-textMain bg-cosmos-gradient flex flex-col font-sans">
      
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
