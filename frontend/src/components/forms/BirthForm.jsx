import React, { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { api } from '../../services/api';
import { MapPin, Calendar, Clock, Loader2 } from 'lucide-react';

export default function BirthForm({ onSuccess }) {
  const { userId, setBirthDetails } = useChatStore();
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarnings([]);

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

  return (
    <div className="w-full max-w-md bg-astro-card backdrop-blur-md border border-astro-cardBorder rounded-2xl p-8 shadow-glow pulsing-border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gold-gradient font-sans">
          Cast Your Birth Chart
        </h2>
        <p className="text-sm text-astro-textMuted mt-1">
          Enter your precise birth details to synchronize with the cosmos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold text-astro-textMuted uppercase tracking-wider mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-astro-gold" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-60 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain font-sans"
              required
            />
          </div>
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-xs font-semibold text-astro-textMuted uppercase tracking-wider mb-2">
            Time of Birth
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-5 w-5 text-astro-gold" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-60 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain font-sans"
              required
            />
          </div>
        </div>

        {/* Place Input */}
        <div>
          <label className="block text-xs font-semibold text-astro-textMuted uppercase tracking-wider mb-2">
            Place of Birth (City, Country)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-astro-gold" />
            <input
              type="text"
              placeholder="e.g. Delhi, India or Paris, France"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-astro-indigo bg-opacity-40 border border-astro-cardBorder border-opacity-60 rounded-xl focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold text-astro-textMain placeholder-astro-textMuted placeholder-opacity-50 font-sans"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-xs bg-red-950 bg-opacity-50 border border-red-500 border-opacity-30 text-red-300 p-3 rounded-lg text-center font-sans">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-astro-gold to-[#f5d471] hover:from-[#cda22b] hover:to-[#dfb73c] disabled:from-astro-indigo disabled:to-astro-indigo text-astro-bg font-bold rounded-xl transition duration-300 shadow-goldGlow flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Analyzing Cosmic Coordinates...</span>
            </>
          ) : (
            <span>Draw Natal Blueprint</span>
          )}
        </button>
      </form>
    </div>
  );
}
