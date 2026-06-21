import React, { useState } from 'react';
import { Sparkles, Shield, UserCheck, Flame, Trees, Wind, Droplets } from 'lucide-react';

const ZODIAC_DATA = {
  Aries: { symbol: '♈', element: 'fire', modality: 'Cardinal', ruler: 'Mars', house: '1st House', strengths: 'Courage, determination, confidence, enthusiasm, honesty', weaknesses: 'Impatience, moodiness, short temper, impulsiveness', desc: 'The pioneer of the zodiac. Energetic, driven, and always ready to lead the way into new adventures.' },
  Taurus: { symbol: '♉', element: 'earth', modality: 'Fixed', ruler: 'Venus', house: '2nd House', strengths: 'Reliable, patient, practical, devoted, responsible, stable', weaknesses: 'Stubborn, possessive, uncompromising', desc: 'The anchor of the zodiac. Loves beauty, stability, and sensory pleasures. Highly persistent.' },
  Gemini: { symbol: '♊', element: 'air', modality: 'Mutable', ruler: 'Mercury', house: '3rd House', strengths: 'Gentle, affectionate, curious, adaptable, ability to learn quickly', weaknesses: 'Inconsistent, indecisive, nervous', desc: 'The storyteller of the zodiac. Double-sided, intellectual, communicative, and constantly seeking variety.' },
  Cancer: { symbol: '♋', element: 'water', modality: 'Cardinal', ruler: 'Moon', house: '4th House', strengths: 'Tenacious, highly imaginative, loyal, sympathetic, persuasive', weaknesses: 'Moody, pessimistic, suspicious, insecure', desc: 'The protector of the zodiac. Deeply emotional, intuitive, nurturing, and strongly tied to home.' },
  Leo: { symbol: '♌', element: 'fire', modality: 'Fixed', ruler: 'Sun', house: '5th House', strengths: 'Creative, passionate, generous, warm-hearted, cheerful, humorous', weaknesses: 'Arrogant, stubborn, self-centered, lazy, inflexible', desc: 'The king of the zodiac. Warm, theatrical, proud, and extremely loyal to those they love.' },
  Virgo: { symbol: '♍', element: 'earth', modality: 'Mutable', ruler: 'Mercury', house: '6th House', strengths: 'Loyal, analytical, kind, hardworking, practical', weaknesses: 'Shyness, worry, overly critical of self and others', desc: 'The healer of the zodiac. Practical, detail-oriented, analytical, and dedicated to service.' },
  Libra: { symbol: '♎', element: 'air', modality: 'Cardinal', ruler: 'Venus', house: '7th House', strengths: 'Cooperative, diplomatic, gracious, fair-minded, social', weaknesses: 'Indecisive, avoids confrontations, will carry a grudge', desc: 'The peacemaker of the zodiac. Seeks balance, harmony, justice, and beautiful relationships.' },
  Scorpio: { symbol: '♏', element: 'water', modality: 'Fixed', ruler: 'Pluto & Mars', house: '8th House', strengths: 'Resourceful, powerful, brave, passionate, a true friend', weaknesses: 'Distrusting, jealous, secretive, violent', desc: 'The alchemist of the zodiac. Intense, passionate, magnetic, and deeply transformative.' },
  Sagittarius: { symbol: '♐', element: 'fire', modality: 'Mutable', ruler: 'Jupiter', house: '9th House', strengths: 'Generous, idealistic, great sense of humor', weaknesses: 'Promises more than can deliver, very impatient, tactless', desc: 'The seeker of the zodiac. Optimistic, adventure-loving, truth-seeking, and philosophical.' },
  Capricorn: { symbol: '♑', element: 'earth', modality: 'Cardinal', ruler: 'Saturn', house: '10th House', strengths: 'Responsible, disciplined, self-control, good managers', weaknesses: 'Know-it-all, unforgiving, expecting the worst', desc: 'The architect of the zodiac. Hardworking, structured, ambitious, and focused on peak goals.' },
  Aquarius: { symbol: '♒', element: 'air', modality: 'Fixed', ruler: 'Uranus & Saturn', house: '11th House', strengths: 'Progressive, original, independent, humanitarian', weaknesses: 'Runs from emotional expression, temperamental, uncompromising', desc: 'The visionary of the zodiac. Altruistic, logical, unconventional, and dedicated to collective progress.' },
  Pisces: { symbol: '♓', element: 'water', modality: 'Mutable', ruler: 'Neptune & Jupiter', house: '12th House', strengths: 'Compassionate, artistic, intuitive, gentle, wise, musical', weaknesses: 'Fearful, overly trusting, desire to escape reality', desc: 'The mystic of the zodiac. Empathetic, dream-loving, spiritually porous, and highly creative.' }
};

const ELEMENT_ICONS = {
  fire: <Flame className="h-3 w-3 text-red-400" />,
  earth: <Trees className="h-3 w-3 text-emerald-400" />,
  air: <Wind className="h-3 w-3 text-cyan-400" />,
  water: <Droplets className="h-3 w-3 text-blue-400" />
};

export default function SignExplorer() {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const data = ZODIAC_DATA[selectedSign];

  return (
    <div className="space-y-4 animate-fade-in text-sans">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-astro-gold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-astro-gold" />
          <span>Zodiac Library</span>
        </h3>
        <select
          value={selectedSign}
          onChange={(e) => setSelectedSign(e.target.value)}
          className="text-xs font-semibold text-astro-gold bg-[#0a0b16] px-3 py-1.5 border border-astro-cardBorder border-opacity-30 rounded-lg focus:outline-none focus:border-astro-gold cursor-pointer font-mono"
        >
          {Object.keys(ZODIAC_DATA).map(sign => (
            <option key={sign} value={sign} className="bg-astro-bg text-astro-textMain font-mono">{sign}</option>
          ))}
        </select>
      </div>

      <div className="bg-astro-indigo bg-opacity-20 border border-astro-cardBorder border-opacity-15 p-4 rounded-xl space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="text-3xl text-astro-gold select-none font-bold">{data.symbol}</div>
          <div>
            <h4 className="text-sm font-bold text-astro-textMain">{selectedSign}</h4>
            <div className="flex gap-1.5 mt-0.5">
              <span className="text-[8px] bg-astro-indigo border border-astro-cardBorder border-opacity-20 px-1.5 py-0.5 rounded text-astro-textMuted uppercase font-mono">
                {data.modality}
              </span>
              <span className="text-[8px] bg-astro-indigo border border-astro-cardBorder border-opacity-20 px-1.5 py-0.5 rounded text-astro-textMuted uppercase font-mono flex items-center gap-0.5">
                {ELEMENT_ICONS[data.element]}
                <span className="capitalize">{data.element}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-astro-textMuted leading-relaxed border-t border-astro-cardBorder border-opacity-10 pt-2.5">
          {data.desc}
        </p>

        <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#0a0b16] bg-opacity-40 p-2.5 border border-astro-cardBorder border-opacity-10 rounded-lg font-mono">
          <div>
            <span className="text-astro-gold uppercase text-[8px] font-bold block">Ruler</span>
            <span className="text-astro-textMain">{data.ruler}</span>
          </div>
          <div>
            <span className="text-astro-gold uppercase text-[8px] font-bold block">Natural House</span>
            <span className="text-astro-textMain">{data.house}</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-astro-cardBorder border-opacity-10 pt-2.5">
          <div className="flex gap-2">
            <UserCheck className="h-3.5 w-3.5 text-astro-gold flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-astro-gold font-bold block">Strengths</span>
              <p className="text-[10px] text-astro-textMain">{data.strengths}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Shield className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-red-400 font-bold block">Vulnerabilities</span>
              <p className="text-[10px] text-astro-textMain">{data.weaknesses}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
