import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useStreaming } from '../hooks/useStreaming';
import { api } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import AstroWheel from '../components/chat/AstroWheel';
import ElementBalance from '../components/chat/ElementBalance';
import AstroPrompts from '../components/chat/AstroPrompts';
import { Sparkles, Calendar, Clock, MapPin, Trash2, ArrowLeft, Orbit, Compass, Layout } from 'lucide-react';

const PLANET_SYMBOLS = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  north_node: '☊',
  south_node: '☋'
};

export default function Chat({ onBack }) {
  const { birthDetails, userId, messages, setMessages, clearChat, isLoading, setIsLoading } = useChatStore();
  const { sendMessageStream } = useStreaming();
  const [activeTab, setActiveTab] = useState('wheel'); // 'wheel' | 'planets' | 'coords'

  // Load chat history from SQLite on load
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.getChatHistory(userId);
        if (response.success && response.history) {
          setMessages(response.history);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [userId, setMessages]);

  const handleClearChat = async () => {
    if (window.confirm('Are you sure you want to clear your cosmic consultation history?')) {
      try {
        await api.clearChat(userId);
        clearChat();
      } catch (err) {
        console.error('Failed to clear chat:', err);
      }
    }
  };

  const formattedChart = birthDetails?.chart || {};
  const planets = formattedChart.planets || {};

  return (
    <div className="flex flex-col md:flex-row h-[90vh] max-w-7xl mx-auto w-full gap-6 px-4 py-4 md:py-6 overflow-hidden">
      
      {/* Sidebar Panel */}
      <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 h-full overflow-hidden">
        
        {/* Navigation Action */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-astro-textMuted hover:text-astro-gold transition cursor-pointer self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Change Birth Details</span>
        </button>

        {/* Natal Profile Tabbed Card */}
        <div className="bg-astro-card border border-astro-cardBorder rounded-2xl p-5 shadow-glow flex flex-col flex-1 overflow-hidden relative">
          <div className="absolute top-0 right-0 h-16 w-16 bg-astro-gold opacity-5 blur-2xl rounded-full"></div>
          
          {/* Tabs header control */}
          <div className="flex bg-astro-indigo bg-opacity-40 p-1 rounded-xl border border-astro-cardBorder border-opacity-15 mb-4">
            <button
              onClick={() => setActiveTab('wheel')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${activeTab === 'wheel' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Wheel
            </button>
            <button
              onClick={() => setActiveTab('planets')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${activeTab === 'planets' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Planets
            </button>
            <button
              onClick={() => setActiveTab('coords')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition cursor-pointer ${activeTab === 'coords' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Coords
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {/* WHEEL TAB */}
            {activeTab === 'wheel' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Orbit className="h-3.5 w-3.5 text-astro-gold" />
                  <span>Interactive Chart</span>
                </h3>
                <AstroWheel chart={formattedChart} />
                <ElementBalance chart={formattedChart} />
              </div>
            )}

            {/* PLANETS TAB */}
            {activeTab === 'planets' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-astro-gold" />
                  <span>Natal Planetary Alignments</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(planets).map(([key, planet]) => {
                    const symbol = PLANET_SYMBOLS[key] || '★';
                    return (
                      <div key={key} className="flex justify-between items-center text-xs px-3 py-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl hover:border-opacity-30 transition-all duration-300">
                        <span className="font-semibold text-astro-textMain flex items-center gap-2">
                          <span className="text-astro-gold text-sm">{symbol}</span>
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          {planet.is_retrograde && (
                            <span className="text-[8px] bg-red-950 text-red-400 px-1 py-0.2 rounded border border-red-900 border-opacity-40 uppercase font-mono font-black">R</span>
                          )}
                        </span>
                        <span className="text-astro-textMuted font-mono font-medium">
                          {planet.degree}° {planet.sign} (H{planet.house})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COORDS TAB */}
            {activeTab === 'coords' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-astro-gold" />
                  <span>Space-Time Reference</span>
                </h3>
                <div className="space-y-3 text-xs bg-astro-indigo bg-opacity-20 border border-astro-cardBorder border-opacity-15 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-astro-gold flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-astro-textMuted uppercase">Birthplace</div>
                      <div className="font-semibold text-astro-textMain truncate max-w-[180px]">{birthDetails?.place}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-astro-gold flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-astro-textMuted uppercase">Date</div>
                      <div className="font-semibold text-astro-textMain">{birthDetails?.dob}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-astro-gold flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-astro-textMuted uppercase">Local Time (TZ)</div>
                      <div className="font-semibold text-astro-textMain">{birthDetails?.time} ({birthDetails?.timezone})</div>
                    </div>
                  </div>
                  <hr className="border-astro-cardBorder border-opacity-20 my-2" />
                  <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-astro-textMuted">
                    <div>Lat: {Number(birthDetails?.lat).toFixed(4)}°</div>
                    <div>Lon: {Number(birthDetails?.lon).toFixed(4)}°</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-astro-cardBorder border-opacity-15 my-4" />

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl">
              <div className="text-astro-textMuted uppercase text-[8px]">Ascendant</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{formattedChart.ascendant || 'Unknown'}</div>
            </div>
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl">
              <div className="text-astro-textMuted uppercase text-[8px]">Sun Sign</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{formattedChart.sun || 'Unknown'}</div>
            </div>
            <div className="p-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl">
              <div className="text-astro-textMuted uppercase text-[8px]">Moon Sign</div>
              <div className="font-bold text-astro-gold truncate mt-0.5">{formattedChart.moon || 'Unknown'}</div>
            </div>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleClearChat}
          className="flex items-center justify-center gap-2 py-2.5 border border-red-500 border-opacity-20 text-red-400 hover:bg-red-950 hover:bg-opacity-20 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear Consultation</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-astro-card border border-astro-cardBorder rounded-2xl flex flex-col shadow-glow overflow-hidden">
        
        {/* Chat header */}
        <div className="px-6 py-4 bg-astro-indigo bg-opacity-25 border-b border-astro-cardBorder border-opacity-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-astro-indigo border border-astro-cardBorder border-opacity-40 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-astro-gold animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-astro-textMain font-sans">AstroAgent Consultant</h2>
              <p className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                <span>Active celestial reasoning loop</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages scroll area */}
        <ChatWindow />

        {/* Message Input box */}
        <div className="p-4 border-t border-astro-cardBorder border-opacity-30 bg-astro-indigo bg-opacity-10">
          <AstroPrompts onSelect={sendMessageStream} disabled={isLoading} />
          <ChatInput onSend={sendMessageStream} />
        </div>
      </div>
    </div>
  );
}
