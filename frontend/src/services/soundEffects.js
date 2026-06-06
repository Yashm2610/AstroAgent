let isMuted = localStorage.getItem('astroagent_muted') === 'true';

export const toggleMuteStatus = () => {
  isMuted = !isMuted;
  localStorage.setItem('astroagent_muted', String(isMuted));
  return isMuted;
};

export const getMuteStatus = () => {
  return isMuted;
};

export const playCosmicChime = () => {
  if (isMuted) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    
    // Play a beautiful, layered major chord (C5, E5, G5, C6) for a crystal celestial sound
    const now = ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; 

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Attack: very quick, Decay: smooth exponential decay
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 / frequencies.length, now + 0.05); 
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5 + idx * 0.1);
    });
  } catch (err) {
    console.warn("Failed to play audio chime:", err);
  }
};

export const playMessageChime = () => {
  if (isMuted) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Soft double ascending beep/chime: G5 then C6
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(783.99, now); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.08); // C6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (err) {
    console.warn("Failed to play message chime:", err);
  }
};

let ambientNodes = [];
let ambientCtx = null;

export const getDominantElement = (chart) => {
  if (!chart || !chart.planets) return 'water';
  
  const SIGN_ELEMENTS = {
    Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
    Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
    Gemini: 'air', Libra: 'air', Aquarius: 'air',
    Cancer: 'water', Scorpio: 'water', Pisces: 'water'
  };
  
  const points = { fire: 0, earth: 0, air: 0, water: 0 };
  
  if (chart.ascendant && SIGN_ELEMENTS[chart.ascendant]) {
    points[SIGN_ELEMENTS[chart.ascendant]] += 2;
  }
  
  Object.entries(chart.planets).forEach(([key, planet]) => {
    const element = SIGN_ELEMENTS[planet.sign];
    if (element) {
      const weight = (key === 'sun' || key === 'moon') ? 2 : 1;
      points[element] += weight;
    }
  });
  
  let dominant = 'water';
  let maxVal = -1;
  Object.entries(points).forEach(([elem, val]) => {
    if (val > maxVal) {
      maxVal = val;
      dominant = elem;
    }
  });
  
  return dominant;
};

export const startAmbientDrone = (dominantElement) => {
  if (isMuted) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    stopAmbientDrone();
    
    ambientCtx = new AudioContext();
    const now = ambientCtx.currentTime;
    
    let freqs = [];
    let oscType = 'sine';
    let filterFreq = 400;
    let volumeValue = 0.025; // extremely low background gain
    
    const element = (dominantElement || 'water').toLowerCase();
    
    if (element === 'fire') {
      freqs = [87.31, 130.81, 174.61]; // F2, C3, F3 warm saw chords
      oscType = 'sawtooth';
      filterFreq = 180;
    } else if (element === 'water') {
      freqs = [110.00, 165.00, 220.00]; // A2, E3, A3 smooth sine wave
      oscType = 'sine';
      filterFreq = 300;
    } else if (element === 'air') {
      freqs = [146.83, 220.00, 293.66]; // D3, A3, D4 wind-like triangle
      oscType = 'triangle';
      filterFreq = 500;
    } else { // earth
      freqs = [65.41, 98.00, 130.81]; // C2, G2, C3 deep triangle
      oscType = 'triangle';
      filterFreq = 150;
    }
    
    const filterNode = ambientCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(filterFreq, now);
    
    // Slow resonance frequency sweep
    filterNode.frequency.linearRampToValueAtTime(filterFreq * 1.3, now + 8);
    filterNode.frequency.linearRampToValueAtTime(filterFreq * 0.8, now + 16);
    
    const masterGain = ambientCtx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volumeValue, now + 2.5); // Fade in over 2.5s
    
    freqs.forEach((freq, idx) => {
      const osc = ambientCtx.createOscillator();
      const gain = ambientCtx.createGain();
      
      osc.type = oscType;
      // Slightly detune to create thick rich texture
      osc.frequency.setValueAtTime(freq + (idx * 0.4 - 0.2), now);
      
      gain.connect(filterNode);
      osc.connect(gain);
      ambientNodes.push(osc);
    });
    
    filterNode.connect(masterGain);
    masterGain.connect(ambientCtx.destination);
    
    ambientNodes.forEach(osc => {
      osc.start(now);
    });
    
    // Track gains for cleanup
    ambientNodes.push(masterGain, filterNode);
  } catch (err) {
    console.warn("Failed to start ambient drone:", err);
  }
};

export const stopAmbientDrone = () => {
  try {
    if (ambientNodes.length > 0) {
      ambientNodes.forEach(node => {
        if (node.stop) {
          try { node.stop(); } catch(e) {}
        }
      });
      ambientNodes = [];
    }
    if (ambientCtx && ambientCtx.state !== 'closed') {
      ambientCtx.close();
      ambientCtx = null;
    }
  } catch(err) {
    console.warn("Failed to stop ambient drone:", err);
  }
};
