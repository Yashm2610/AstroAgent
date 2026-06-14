import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useStreaming } from '../hooks/useStreaming';
import { api } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import AstroWheel from '../components/chat/AstroWheel';
import ElementBalance from '../components/chat/ElementBalance';
import AstroPrompts from '../components/chat/AstroPrompts';
import { PLANET_DESCRIPTIONS, ZODIAC_DESCRIPTIONS } from '../services/astrologyInterpretations';
import { playMessageChime, getDominantElement, startAmbientDrone, stopAmbientDrone } from '../services/soundEffects';
import { Sparkles, Calendar, Clock, MapPin, Trash2, ArrowLeft, Orbit, Compass, Layout, Printer, Heart } from 'lucide-react';
import OracleDrawer from '../components/chat/OracleDrawer';
import HouseAccordion from '../components/chat/HouseAccordion';
import PlanetaryDignities from '../components/chat/PlanetaryDignities';
import AstroJournal from '../components/chat/AstroJournal';
import AspectGrid from '../components/chat/AspectGrid';
import MoonPhase from '../components/chat/MoonPhase';
import SouthIndianChart from '../components/chat/SouthIndianChart';

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

const ZODIAC_LIST = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_ELEMENTS = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water'
};

const getCompatibilityScore = (sign1, sign2) => {
  if (!sign1 || !sign2) return 50;
  const el1 = ZODIAC_ELEMENTS[sign1];
  const el2 = ZODIAC_ELEMENTS[sign2];
  if (!el1 || !el2) return 50;
  
  if (el1 === el2) return 95; // Same element
  
  if ((el1 === 'fire' && el2 === 'air') || (el1 === 'air' && el2 === 'fire')) return 88;
  if ((el1 === 'earth' && el2 === 'water') || (el1 === 'water' && el2 === 'earth')) return 85;
  
  if ((el1 === 'fire' && el2 === 'earth') || (el1 === 'earth' && el2 === 'fire')) return 60;
  if ((el1 === 'air' && el2 === 'water') || (el1 === 'water' && el2 === 'air')) return 55;
  
  return 45;
};

const getCompatibilityText = (sign1, sign2) => {
  const score = getCompatibilityScore(sign1, sign2);
  const el1 = ZODIAC_ELEMENTS[sign1];
  const el2 = ZODIAC_ELEMENTS[sign2];
  
  if (score >= 90) {
    return `Both sharing the ${el1} element, this relationship is fueled by instant mutual understanding. You share similar energetic speeds and view life through a matching elemental lens.`;
  }
  if (score >= 80) {
    return `The combination of ${el1} and ${el2} creates a highly productive union. ${el1 === 'fire' || el1 === 'air' ? 'Air feeds Fire, inspiring expansion and mutual inspiration.' : 'Water nourishes Earth, bringing emotional depth and grounded security.'}`;
  }
  if (score >= 55) {
    return `A combination of ${el1} and ${el2} requires adjustments. While it offers unique perspectives, you may often feel like you speak different energetic languages. Growth is found in balancing your differences.`;
  }
  return `This is a highly karmic match with intense growth lessons. The clash between ${el1} and ${el2} can create steam or mud, demanding patient boundary work and conscious appreciation of your different modes of expression.`;
};

export default function Chat({ onBack }) {
  const { birthDetails, userId, messages, setMessages, clearChat, isLoading, setIsLoading } = useChatStore();
  const { sendMessageStream } = useStreaming();
  const [activeTab, setActiveTab] = useState('wheel'); // 'wheel' | 'planets' | 'coords'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [partnerSign, setPartnerSign] = useState('Aries');
  const [oracleOpen, setOracleOpen] = useState(false);
  const [chartStyle, setChartStyle] = useState('circular'); // 'circular' | 'south'

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

  // Play chime on message received
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        playMessageChime();
      }
    }
  }, [messages.length]);

  // Start element-based ambient drone soundscape on mount, stop on unmount
  useEffect(() => {
    if (birthDetails && birthDetails.chart) {
      const element = getDominantElement(birthDetails.chart);
      startAmbientDrone(element);
    }
    return () => {
      stopAmbientDrone();
    };
  }, [birthDetails]);

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
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-full md:w-80 opacity-100 flex' : 'w-0 h-0 overflow-hidden opacity-0 pointer-events-none md:hidden'} flex-col gap-4 flex-shrink-0 h-full`}>
        
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
          <div className="flex bg-astro-indigo bg-opacity-40 p-1 rounded-xl border border-astro-cardBorder border-opacity-15 mb-4 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => setActiveTab('wheel')}
              className={`flex-shrink-0 px-1 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition cursor-pointer flex-1 ${activeTab === 'wheel' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Wheel
            </button>
            <button
              onClick={() => setActiveTab('planets')}
              className={`flex-shrink-0 px-1 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition cursor-pointer flex-1 ${activeTab === 'planets' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Planets
            </button>
            <button
              onClick={() => setActiveTab('coords')}
              className={`flex-shrink-0 px-1 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition cursor-pointer flex-1 ${activeTab === 'coords' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Coords
            </button>
            <button
              onClick={() => setActiveTab('compat')}
              className={`flex-shrink-0 px-1 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition cursor-pointer flex-1 ${activeTab === 'compat' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Match
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex-shrink-0 px-1 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition cursor-pointer flex-1 ${activeTab === 'journal' ? 'bg-astro-gold text-astro-bg' : 'text-astro-textMuted hover:text-astro-textMain'}`}
            >
              Journal
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {/* WHEEL TAB */}
            {activeTab === 'wheel' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Orbit className="h-3.5 w-3.5 text-astro-gold" />
                    <span>Interactive Chart</span>
                  </h3>
                  <button
                    onClick={() => setChartStyle(chartStyle === 'circular' ? 'south' : 'circular')}
                    className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border bg-transparent text-astro-textMuted border-astro-cardBorder border-opacity-30 hover:border-opacity-65 hover:text-astro-gold cursor-pointer transition-all duration-300"
                  >
                    Style: {chartStyle === 'circular' ? 'Western' : 'Vedic'}
                  </button>
                </div>
                {chartStyle === 'circular' ? (
                  <AstroWheel chart={formattedChart} />
                ) : (
                  <SouthIndianChart chart={formattedChart} />
                )}
                <ElementBalance chart={formattedChart} />
                <HouseAccordion chart={formattedChart} />
                <MoonPhase />
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
                      <div 
                        key={key} 
                        onClick={() => setSelectedPlanet({ key, ...planet, symbol })}
                        className="flex justify-between items-center text-xs px-3 py-2 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 rounded-xl hover:border-opacity-30 hover:bg-opacity-50 transition-all duration-300 cursor-pointer"
                      >
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
                <PlanetaryDignities chart={formattedChart} />
                <AspectGrid chart={formattedChart} />
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

            {/* COMPATIBILITY TAB */}
            {activeTab === 'compat' && (
              <div className="space-y-4 animate-fade-in text-sans">
                <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-astro-gold" />
                  <span>Synastry Match</span>
                </h3>
                
                <div className="space-y-3 bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-15 p-4 rounded-xl">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-astro-textMuted font-mono mb-1">Your Sun Sign</label>
                    <div className="text-xs font-semibold text-astro-textMain bg-[#0a0b16] bg-opacity-40 px-3 py-2 border border-astro-cardBorder border-opacity-15 rounded-lg capitalize">
                      {formattedChart.sun || 'Unknown'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-astro-textMuted font-mono mb-1">Partner's Sun Sign</label>
                    <select
                      value={partnerSign}
                      onChange={(e) => setPartnerSign(e.target.value)}
                      className="w-full text-xs font-semibold text-astro-gold bg-[#0a0b16] px-3 py-2 border border-astro-cardBorder border-opacity-30 rounded-lg focus:outline-none focus:border-astro-gold cursor-pointer"
                    >
                      {ZODIAC_LIST.map(sign => (
                        <option key={sign} value={sign} className="bg-astro-bg text-astro-textMain">{sign}</option>
                      ))}
                    </select>
                  </div>
                  
                  {formattedChart.sun && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                        <span className="text-astro-textMuted">Compatibility Score</span>
                        <span className="text-astro-gold font-bold text-xs">{getCompatibilityScore(formattedChart.sun, partnerSign)}%</span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-[#0a0b16] rounded-full overflow-hidden border border-astro-cardBorder border-opacity-10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-astro-purple to-astro-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${getCompatibilityScore(formattedChart.sun, partnerSign)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <p className="text-[10px] text-astro-textMuted leading-relaxed bg-[#0a0b16] bg-opacity-45 p-3 rounded-lg border border-astro-cardBorder border-opacity-10 mt-2">
                        {getCompatibilityText(formattedChart.sun, partnerSign)}
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* JOURNAL TAB */}
            {activeTab === 'journal' && (
              <AstroJournal />
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

        {/* Oracle Card button */}
        <button
          onClick={() => setOracleOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 bg-astro-indigo bg-opacity-40 border border-astro-gold border-opacity-35 text-astro-gold hover:bg-opacity-65 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer mb-2 print:hidden shadow-glow"
        >
          <Sparkles className="h-4 w-4 star-twinkle-fast" />
          <span>Draw Oracle Card</span>
        </button>

        {/* Export Profile button */}
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center justify-center gap-2 py-2.5 border border-astro-gold border-opacity-35 text-astro-gold hover:bg-astro-indigo hover:bg-opacity-40 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer mb-2 print:hidden"
        >
          <Printer className="h-4 w-4" />
          <span>Export Astro Profile</span>
        </button>

        {/* Clear chat button */}
        <button
          onClick={handleClearChat}
          className="flex items-center justify-center gap-2 py-2.5 border border-red-500 border-opacity-20 text-red-400 hover:bg-red-950 hover:bg-opacity-20 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer print:hidden"
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
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-20 text-astro-textMuted hover:text-astro-gold transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-glow"
          >
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">{sidebarOpen ? 'Hide Blueprint' : 'Show Blueprint'}</span>
          </button>
        </div>

        {/* Chat Messages scroll area */}
        <ChatWindow />

        {/* Message Input box */}
        <div className="p-4 border-t border-astro-cardBorder border-opacity-30 bg-astro-indigo bg-opacity-10">
          <AstroPrompts onSelect={sendMessageStream} disabled={isLoading} />
          <ChatInput onSend={sendMessageStream} />
        </div>
      </div>

      {/* Interpretation Modal overlay */}
      {selectedPlanet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-astro-card border border-astro-cardBorder rounded-2xl max-w-sm w-full p-6 shadow-glow relative overflow-hidden animate-fade-in text-sans">
            <div className="absolute top-0 right-0 h-16 w-16 bg-astro-gold opacity-10 blur-2xl rounded-full"></div>
            
            <button 
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-4 right-4 text-astro-textMuted hover:text-astro-gold transition-colors text-sm font-semibold cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3.5 mb-4 border-b border-astro-cardBorder border-opacity-20 pb-3">
              <span className="text-3xl text-astro-gold">{selectedPlanet.symbol}</span>
              <div>
                <h3 className="text-base font-bold text-astro-textMain capitalize">{selectedPlanet.name}</h3>
                <p className="text-[10px] text-astro-gold font-mono uppercase tracking-wider">
                  {selectedPlanet.degree}° in {selectedPlanet.sign} — House {selectedPlanet.house}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-astro-textMain">
              <div>
                <span className="text-[10px] font-bold text-astro-textMuted uppercase block mb-1">Planet Dynamics</span>
                <p className="text-astro-textMuted">{PLANET_DESCRIPTIONS[selectedPlanet.key] || "Governs key vibrational lessons and planetary energies."}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-astro-textMuted uppercase block mb-1">Sign Expression</span>
                <p className="text-astro-textMuted">{ZODIAC_DESCRIPTIONS[selectedPlanet.sign] || "Expressed through the energetic modes of this zodiac house."}</p>
              </div>
              <div className="bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-10 p-3 rounded-xl font-mono text-[9px] text-astro-textMuted">
                <span className="text-astro-gold font-bold uppercase block mb-1">Celestial Synthesis</span>
                Your {selectedPlanet.name} qualities are expressed in a {selectedPlanet.sign.toLowerCase()} manner within your {selectedPlanet.house}th house of life experiences.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Profile Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm print:relative print:bg-white print:p-0 print:z-0">
          <div className="bg-astro-card border border-astro-cardBorder rounded-2xl max-w-xl w-full p-6 shadow-glow relative overflow-hidden animate-fade-in text-sans print:border-none print:shadow-none print:bg-white print:text-black print:p-0 print:max-w-none print:w-full">
            <div className="absolute top-0 right-0 h-24 w-24 bg-astro-gold opacity-5 blur-3xl rounded-full print:hidden"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b border-astro-cardBorder border-opacity-20 pb-3 print:border-black print:pb-2">
              <div>
                <h3 className="text-base font-bold text-astro-textMain print:text-black font-sans">Cosmic Birth Alignment Report</h3>
                <p className="text-[10px] text-astro-textMuted uppercase tracking-wider font-mono print:text-gray-600">AstroAgent Precision Ephemeris v1.0</p>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-astro-textMuted hover:text-astro-gold transition-colors text-sm font-semibold cursor-pointer print:hidden"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs text-astro-textMain print:text-black overflow-y-auto max-h-[60vh] pr-1 print:max-h-none print:overflow-visible print:pr-0">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-3 bg-astro-indigo bg-opacity-35 p-3 rounded-xl border border-astro-cardBorder border-opacity-10 print:bg-gray-100 print:border-gray-300 print:text-black">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono print:text-gray-600 block">Consultant Name</span>
                  <span className="font-bold">AstroAgent seeker</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono print:text-gray-600 block">Birth Date & Time</span>
                  <span className="font-bold">{birthDetails?.dob} @ {birthDetails?.time}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono print:text-gray-600 block">Birth Place</span>
                  <span className="font-bold truncate block">{birthDetails?.place}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-astro-textMuted font-mono print:text-gray-600 block">Coordinates & TZ</span>
                  <span className="font-bold font-mono text-[9px]">{Number(birthDetails?.lat).toFixed(4)}°N, {Number(birthDetails?.lon).toFixed(4)}°E ({birthDetails?.timezone})</span>
                </div>
              </div>

              {/* Signs Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-10 rounded-xl print:border-gray-300 print:bg-gray-50">
                  <div className="text-astro-textMuted text-[8px] uppercase font-mono print:text-gray-600">Ascendant</div>
                  <div className="font-bold text-astro-gold mt-0.5 print:text-black">{formattedChart.ascendant || 'Unknown'}</div>
                </div>
                <div className="p-2 bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-10 rounded-xl print:border-gray-300 print:bg-gray-50">
                  <div className="text-astro-textMuted text-[8px] uppercase font-mono print:text-gray-600">Sun Sign</div>
                  <div className="font-bold text-astro-gold mt-0.5 print:text-black">{formattedChart.sun || 'Unknown'}</div>
                </div>
                <div className="p-2 bg-astro-indigo bg-opacity-25 border border-astro-cardBorder border-opacity-10 rounded-xl print:border-gray-300 print:bg-gray-50">
                  <div className="text-astro-textMuted text-[8px] uppercase font-mono print:text-gray-600">Moon Sign</div>
                  <div className="font-bold text-astro-gold mt-0.5 print:text-black">{formattedChart.moon || 'Unknown'}</div>
                </div>
              </div>

              {/* Alignments List */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-wider text-astro-gold font-bold font-mono print:text-black block border-b border-astro-cardBorder border-opacity-10 pb-1 print:border-gray-300">Planetary Coordinates</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {Object.entries(planets).map(([key, planet]) => (
                    <div key={key} className="flex justify-between border-b border-astro-cardBorder border-opacity-5 py-1 font-mono print:border-gray-200 print:text-black">
                      <span className="capitalize text-astro-textMain font-sans print:text-black font-medium">{key.replace('_', ' ')}:</span>
                      <span className="text-astro-textMuted print:text-gray-700">{planet.degree}° {planet.sign} (H{planet.house})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification note */}
              <div className="text-[8px] text-astro-textMuted italic font-mono mt-4 text-center border-t border-astro-cardBorder border-opacity-10 pt-3 print:text-black print:border-gray-300">
                Calculated dynamically via AstroAgent Astronomy Systems. Ephemeris time verified.
              </div>
            </div>

            {/* Print Action button */}
            <div className="mt-5 flex gap-3 print:hidden">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2 border border-astro-cardBorder border-opacity-35 text-astro-textMuted rounded-xl text-xs font-semibold cursor-pointer hover:bg-astro-indigo hover:bg-opacity-35 transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-gradient-to-r from-astro-gold to-[#fbe087] text-astro-bg rounded-xl text-xs font-bold shadow-goldGlow cursor-pointer hover:scale-[1.01] transition"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {oracleOpen && (
        <OracleDrawer isOpen={oracleOpen} onClose={() => setOracleOpen(false)} />
      )}
    </div>
  );
}
