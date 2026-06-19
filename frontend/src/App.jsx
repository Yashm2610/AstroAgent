import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from './store/chatStore';
import Home from './pages/Home';
import BirthForm from './components/forms/BirthForm';
import Chat from './pages/Chat';
import { Moon, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { toggleMuteStatus, getMuteStatus, startAmbientDrone, stopAmbientDrone, getDominantElement, getSoundVolume, getSoundTrack, setSoundVolume, setSoundTrack, playCosmicChime, playMessageChime } from './services/soundEffects';
import MouseTrail from './components/chat/MouseTrail';

export default function App() {
  const { birthDetails, setBirthDetails, theme, setTheme, fontPairing, setFontPairing } = useChatStore();
  const [view, setView] = useState('home'); // 'home' | 'birth-form' | 'chat'
  const [muted, setMuted] = useState(getMuteStatus());
  const [volumeVal, setVolumeVal] = useState(getSoundVolume());
  const [trackVal, setTrackVal] = useState(getSoundTrack());

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(localStorage.getItem('astroagent_display_name') || 'Cosmic Traveler');
  const [avatar, setAvatar] = useState(localStorage.getItem('astroagent_user_avatar') || '🧙‍♂️');
  const [coordRep, setCoordRep] = useState(localStorage.getItem('astroagent_coord_rep') || 'dms');
  const [glowEnabled, setGlowEnabled] = useState(localStorage.getItem('astroagent_glow_enabled') !== 'false');
  const [nebulaHue, setNebulaHue] = useState(parseInt(localStorage.getItem('astroagent_nebula_hue') || '260'));
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('astroagent_font_size') || '13'));

  const handleSaveSettings = (name, av, coord, glow, hue, fsize) => {
    setDisplayName(name);
    localStorage.setItem('astroagent_display_name', name);
    setAvatar(av);
    localStorage.setItem('astroagent_user_avatar', av);
    setCoordRep(coord);
    localStorage.setItem('astroagent_coord_rep', coord);
    setGlowEnabled(glow);
    localStorage.setItem('astroagent_glow_enabled', String(glow));
    setNebulaHue(hue);
    localStorage.setItem('astroagent_nebula_hue', String(hue));
    setFontSize(fsize);
    localStorage.setItem('astroagent_font_size', String(fsize));
    setSettingsOpen(false);
  };

  // Apply theme and font class to body
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    document.body.classList.add(`font-${fontPairing}-pair`);
    if (!glowEnabled) {
      document.body.classList.add('disable-effects');
    }
  }, [theme, fontPairing, glowEnabled]);

  // Set HSL Nebula Glow color variables
  useEffect(() => {
    document.documentElement.style.setProperty('--nebula-glow-hue', String(nebulaHue));
  }, [nebulaHue]);

  // Set chat font size CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--chat-font-size', `${fontSize}px`);
  }, [fontSize]);

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
      {glowEnabled && <MouseTrail />}
      
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
              <option value="aurora" className="bg-[#022c22] text-[#dfb73c]">Aurora</option>
            </select>
          </div>

          {/* Font Selector */}
          <div className="flex items-center gap-1.5 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 px-2.5 py-1 rounded-full text-[10px] font-mono">
            <span className="text-astro-textMuted uppercase">Font:</span>
            <select
              value={fontPairing}
              onChange={(e) => setFontPairing(e.target.value)}
              className="bg-transparent text-astro-gold font-bold focus:outline-none cursor-pointer uppercase text-[10px] border-none outline-none"
            >
              <option value="sans" className="bg-[#0a0b16] text-[#dfb73c]">Sans</option>
              <option value="serif" className="bg-[#0a0b16] text-[#dfb73c]">Serif</option>
              <option value="mono" className="bg-[#0a0b16] text-[#dfb73c]">Mono</option>
            </select>
          </div>

          {/* Profile settings button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-full bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 text-astro-gold hover:text-astro-goldHover transition cursor-pointer flex items-center justify-center font-bold"
            title="User Profile Settings"
          >
            <span className="text-sm leading-none">{avatar}</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              const nextMuted = toggleMuteStatus();
              setMuted(nextMuted);
              if (nextMuted) {
                stopAmbientDrone();
              } else if (view === 'chat' && birthDetails && birthDetails.chart) {
                const element = getDominantElement(birthDetails.chart);
                startAmbientDrone(element);
              }
            }}
            className="p-1.5 rounded-full bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 text-astro-gold hover:text-astro-goldHover transition cursor-pointer"
            title={muted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Volume Slider & Track Selector */}
          {!muted && (
            <div className="flex items-center gap-2 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 px-2 py-1 rounded-full text-[10px] font-mono">
              <span className="text-astro-textMuted uppercase">Track:</span>
              <select
                value={trackVal}
                onChange={(e) => {
                  setSoundTrack(e.target.value);
                  setTrackVal(e.target.value);
                }}
                className="bg-transparent text-astro-gold font-bold focus:outline-none cursor-pointer uppercase text-[10px] border-none outline-none"
              >
                <option value="element" className="bg-[#0a0b16] text-[#dfb73c]">Element</option>
                <option value="cosmic" className="bg-[#0a0b16] text-[#dfb73c]">Cosmic</option>
                <option value="solfeggio" className="bg-[#0a0b16] text-[#dfb73c]">528Hz</option>
                <option value="theta" className="bg-[#0a0b16] text-[#dfb73c]">Theta</option>
              </select>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volumeVal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSoundVolume(val);
                  setVolumeVal(val);
                }}
                className="w-12 h-1 bg-astro-cardBorder rounded-lg appearance-none cursor-pointer accent-astro-gold"
                title="Volume"
              />
            </div>
          )}

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

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-astro-card border border-astro-cardBorder rounded-2xl max-w-sm w-full p-6 shadow-glow relative overflow-hidden text-sans text-astro-textMain"
            >
              <div className="flex justify-between items-center border-b border-astro-cardBorder border-opacity-25 pb-3 mb-4">
                <h3 className="text-sm font-bold text-astro-gold uppercase tracking-wider font-mono">Profile Settings</h3>
                <button 
                  onClick={() => setSettingsOpen(false)}
                  className="text-astro-textMuted hover:text-astro-gold transition-colors text-sm font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-astro-textMuted font-mono mb-1.5">Display Name</label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    id="settings-name-input"
                    className="w-full text-xs font-semibold text-astro-textMain bg-[#0a0b16] px-3 py-2 border border-astro-cardBorder border-opacity-35 rounded-lg focus:outline-none focus:border-astro-gold"
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-astro-textMuted font-mono mb-1.5">Select Avatar</label>
                  <div className="grid grid-cols-4 gap-2 text-xl">
                    {['🧙‍♂️', '🪐', '🔮', '🦄', '👽', '🦊', '🐉', '🔱'].map(avEmoji => (
                      <button
                        key={avEmoji}
                        onClick={() => setAvatar(avEmoji)}
                        className={`p-2 rounded-lg border transition ${avatar === avEmoji ? 'border-astro-gold bg-astro-indigo bg-opacity-35' : 'border-astro-cardBorder border-opacity-15 bg-[#0a0b16] hover:border-opacity-35'}`}
                      >
                        {avEmoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coordinate representation */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-astro-textMuted font-mono mb-1.5">Coordinate Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCoordRep('dms')}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition ${coordRep === 'dms' ? 'border-astro-gold bg-astro-indigo bg-opacity-35 text-astro-gold font-bold' : 'border-astro-cardBorder border-opacity-15 bg-[#0a0b16] text-astro-textMuted'}`}
                    >
                      DMS (° ' ")
                    </button>
                    <button
                      onClick={() => setCoordRep('decimal')}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition ${coordRep === 'decimal' ? 'border-astro-gold bg-astro-indigo bg-opacity-35 text-astro-gold font-bold' : 'border-astro-cardBorder border-opacity-15 bg-[#0a0b16] text-astro-textMuted'}`}
                    >
                      Decimal
                    </button>
                  </div>
                </div>

                {/* Glow Effects toggle */}
                <div className="flex items-center justify-between py-1">
                  <label className="text-[9px] uppercase tracking-wider text-astro-textMuted font-mono">Glow Effects</label>
                  <input
                    type="checkbox"
                    defaultChecked={glowEnabled}
                    id="settings-glow-checkbox"
                    className="w-4 h-4 rounded border-astro-cardBorder bg-astro-indigo text-astro-gold accent-astro-gold cursor-pointer"
                  />
                </div>

                {/* Celestial Soundboard */}
                <div className="space-y-1.5 py-1">
                  <label className="block text-[9px] uppercase tracking-wider text-astro-textMuted font-mono">Celestial Soundboard</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => playCosmicChime()}
                      className="flex-1 py-1.5 bg-[#0a0b16] border border-astro-cardBorder border-opacity-20 hover:border-astro-gold rounded-lg text-[9px] font-mono font-bold text-astro-gold hover:text-white transition cursor-pointer"
                    >
                      Chart Chime
                    </button>
                    <button
                      type="button"
                      onClick={() => playMessageChime()}
                      className="flex-1 py-1.5 bg-[#0a0b16] border border-astro-cardBorder border-opacity-20 hover:border-astro-gold rounded-lg text-[9px] font-mono font-bold text-astro-gold hover:text-white transition cursor-pointer"
                    >
                      Msg Chime
                    </button>
                  </div>
                </div>

                {/* Nebula Glow Hue customizer */}
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-astro-textMuted font-mono">
                    <span>Nebula Hue</span>
                    <span className="text-astro-gold font-bold">{nebulaHue}°</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="360"
                    defaultValue={nebulaHue}
                    id="settings-nebula-hue-slider"
                    onChange={(e) => setNebulaHue(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0a0b16] rounded-lg appearance-none cursor-pointer accent-astro-gold"
                  />
                </div>

                {/* Font Size slider customizer */}
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-astro-textMuted font-mono">
                    <span>Chat Font Size</span>
                    <span className="text-astro-gold font-bold">{fontSize}px</span>
                  </div>
                  <input 
                    type="range"
                    min="11"
                    max="17"
                    defaultValue={fontSize}
                    id="settings-font-size-slider"
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#0a0b16] rounded-lg appearance-none cursor-pointer accent-astro-gold"
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={() => {
                    const inputVal = document.getElementById('settings-name-input').value || 'Cosmic Traveler';
                    const glowVal = document.getElementById('settings-glow-checkbox').checked;
                    const hueVal = parseInt(document.getElementById('settings-nebula-hue-slider').value || '260');
                    const sizeVal = parseInt(document.getElementById('settings-font-size-slider').value || '13');
                    handleSaveSettings(inputVal, avatar, coordRep, glowVal, hueVal, sizeVal);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-astro-gold to-[#fbe087] text-astro-bg rounded-xl text-xs font-bold shadow-goldGlow cursor-pointer hover:scale-[1.01] transition"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-astro-textMuted border-t border-astro-cardBorder border-opacity-10 bg-astro-bg bg-opacity-90">
        <p className="font-mono">© 2026 AstroAgent Systems. Built with LangGraph, flatlib & Vite.</p>
      </footer>
    </div>
  );
}
