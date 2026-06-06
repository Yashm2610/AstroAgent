import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';
import { api } from '../../services/api';
import { playCosmicChime } from '../../services/soundEffects';
import { MapPin, Calendar, Clock, Loader2, Sparkles, HelpCircle } from 'lucide-react';

export default function BirthForm({ onSuccess }) {
  const { userId, setBirthDetails } = useChatStore();
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTip, setActiveTip] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic validation
    if (!dob || !time || !place) {
      setError('All fields are required to calculate your astronomical alignments.');
      return;
    }

    // 2. Future date check
    const selectedDate = new Date(`${dob}T${time}`);
    const now = new Date();
    if (selectedDate > now) {
      setError('Date and time of birth cannot be in the future. Please check your entries.');
      return;
    }

    setLoading(true);

    try {
      // 3. Format Date to YYYY/MM/DD expected by backend
      const formattedDate = dob.replace(/-/g, '/');
      const response = await api.submitBirthDetails(userId, formattedDate, time, place);

      if (response.success) {
        playCosmicChime();
        setBirthDetails({
          dob: formattedDate,
          time,
          place,
          lat: response.lat,
          lon: response.lon,
          timezone: response.timezone,
          chart: response.chart
        });
        if (onSuccess) onSuccess();
      } else {
        setError(response.detail || 'Could not calculate details for this birthplace.');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Could not calculate chart details. Please verify the city name and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formTips = {
    dob: "Your date of birth determines the exact planetary degrees in zodiac signs.",
    time: "Precise birth time determines the Ascendant (Rising sign) and house boundary alignments.",
    place: "Latitude and longitude coordinates resolve local timezone offsets and horizon lines."
  };

  const completedFields = [dob, time, place].filter(Boolean).length;
  const progressPercent = Math.round((completedFields / 3) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md bg-astro-card backdrop-blur-md border border-astro-cardBorder rounded-2xl p-8 shadow-glow pulsing-border"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gold-gradient font-sans flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-astro-gold star-twinkle-fast" />
          <span>Cast Your Birth Chart</span>
        </h2>
        <p className="text-xs text-astro-textMuted mt-1.5 font-sans leading-relaxed">
          Enter your precise birth parameters to geocode coordinates and compute planet houses.
        </p>
      </div>

      {/* Progress completeness gauge */}
      <div className="mb-6 bg-astro-indigo bg-opacity-40 p-3.5 rounded-xl border border-astro-cardBorder border-opacity-10">
        <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider mb-1.5">
          <span className="text-astro-textMuted">Profile Completeness</span>
          <span className="text-astro-gold font-bold">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#0a0b16] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-astro-purple to-astro-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 text-[9px] text-astro-textMuted font-mono flex justify-between">
          <span className={dob ? "text-green-400 font-semibold" : "text-astro-textMuted"}>{dob ? "✓ Date" : "○ Date"}</span>
          <span className={time ? "text-green-400 font-semibold" : "text-astro-textMuted"}>{time ? "✓ Time" : "○ Time"}</span>
          <span className={place ? "text-green-400 font-semibold" : "text-astro-textMuted"}>{place ? "✓ Place" : "○ Place"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date Input */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold text-astro-textMuted uppercase tracking-wider">
              Date of Birth
            </label>
            <button 
              type="button" 
              onClick={() => setActiveTip(activeTip === 'dob' ? null : 'dob')}
              className="text-astro-textMuted hover:text-astro-gold transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-3 h-4.5 w-4.5 text-astro-gold" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              onFocus={() => setActiveTip('dob')}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-40 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain font-sans transition-all duration-300 placeholder-opacity-40 text-sm"
              required
            />
          </div>
        </div>

        {/* Time Input */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold text-astro-textMuted uppercase tracking-wider">
              Time of Birth
            </label>
            <button 
              type="button" 
              onClick={() => setActiveTip(activeTip === 'time' ? null : 'time')}
              className="text-astro-textMuted hover:text-astro-gold transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative">
            <Clock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-astro-gold" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              onFocus={() => setActiveTip('time')}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-40 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain font-sans transition-all duration-300 text-sm"
              required
            />
          </div>
        </div>

        {/* Place Input */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold text-astro-textMuted uppercase tracking-wider">
              Place of Birth (City, Country)
            </label>
            <button 
              type="button" 
              onClick={() => setActiveTip(activeTip === 'place' ? null : 'place')}
              className="text-astro-textMuted hover:text-astro-gold transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4.5 w-4.5 text-astro-gold" />
            <input
              type="text"
              placeholder="e.g. New York, USA or Mumbai, India"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              onFocus={() => setActiveTip('place')}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-30 border border-astro-cardBorder border-opacity-40 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain placeholder-astro-textMuted placeholder-opacity-40 font-sans transition-all duration-300 text-sm"
              required
            />
          </div>
        </div>

        {/* Form Tip Helper Block */}
        <AnimatePresence mode="wait">
          {activeTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-astro-indigo bg-opacity-20 border border-astro-cardBorder border-opacity-20 p-3 rounded-lg text-[11px] text-astro-textMuted font-sans"
            >
              <span className="text-astro-gold font-semibold uppercase mr-1">Astral Info:</span>
              {formTips[activeTip]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs bg-red-950 bg-opacity-50 border border-red-500 border-opacity-30 text-red-300 p-3 rounded-xl text-center font-sans"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-astro-gold to-[#fbe087] hover:from-[#cda22b] hover:to-[#dfb73c] disabled:from-astro-indigo disabled:to-astro-indigo text-astro-bg font-extrabold text-sm tracking-wider uppercase rounded-xl transition duration-300 shadow-goldGlow flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 text-astro-bg" />
              <span>Analyzing Cosmic Spheres...</span>
            </>
          ) : (
            <>
              <span>Generate Natal Blueprint</span>
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
