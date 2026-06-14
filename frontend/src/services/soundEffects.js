let isMuted = localStorage.getItem('astroagent_muted') === 'true';
let currentVolume = parseFloat(localStorage.getItem('astroagent_volume') || '0.5');
let currentTrack = localStorage.getItem('astroagent_track') || 'element';

let ambientNodes = [];
let ambientCtx = null;
let masterGainNode = null;
let activeElement = 'water';

export const toggleMuteStatus = () => {
  isMuted = !isMuted;
  localStorage.setItem('astroagent_muted', String(isMuted));
  return isMuted;
};

export const getMuteStatus = () => {
  return isMuted;
};

export const getSoundVolume = () => {
  return currentVolume;
};

export const getSoundTrack = () => {
  return currentTrack;
};

export const setSoundVolume = (vol) => {
  currentVolume = vol;
  localStorage.setItem('astroagent_volume', String(vol));
  if (masterGainNode && ambientCtx) {
    try {
      masterGainNode.gain.setValueAtTime(vol * 0.05, ambientCtx.currentTime);
    } catch (e) {
      console.warn("Failed to set gain value:", e);
    }
  }
};

export const setSoundTrack = (track) => {
  currentTrack = track;
  localStorage.setItem('astroagent_track', track);
  if (ambientCtx) {
    startAmbientDrone(activeElement);
  }
};

export const playCosmicChime = () => {
  if (isMuted) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    // Layered chords
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; 

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      // Incorporate user volume setting into chimes too!
      gain.gain.linearRampToValueAtTime((0.08 / frequencies.length) * currentVolume * 2, now + 0.05); 
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

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(783.99, now); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.08); // C6

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04 * currentVolume * 2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch (err) {
    console.warn("Failed to play message chime:", err);
  }
};

export const startAmbientDrone = (dominantElement) => {
  if (isMuted) return;
  if (dominantElement) {
    activeElement = dominantElement;
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    stopAmbientDrone();

    ambientCtx = new AudioContext();
    const now = ambientCtx.currentTime;

    let freqs = [];
    let oscType = 'sine';
    let filterFreq = 300;

    // Track selections
    if (currentTrack === 'cosmic') {
      freqs = [108.00, 162.00, 216.00]; // 432Hz related (A2, E3, A3)
      oscType = 'sine';
      filterFreq = 250;
    } else if (currentTrack === 'solfeggio') {
      freqs = [132.00, 264.00, 528.00]; // Solfeggio 528Hz related
      oscType = 'sine';
      filterFreq = 400;
    } else if (currentTrack === 'theta') {
      freqs = [60.00, 90.00, 120.00]; // Deep Theta
      oscType = 'triangle';
      filterFreq = 120;
    } else {
      // Default: element-based
      const element = (activeElement || 'water').toLowerCase();
      if (element === 'fire') {
        freqs = [87.31, 130.81, 174.61]; // F2, C3, F3 warm saw
        oscType = 'sawtooth';
        filterFreq = 180;
      } else if (element === 'water') {
        freqs = [110.00, 165.00, 220.00]; // A2, E3, A3 smooth sine
        oscType = 'sine';
        filterFreq = 300;
      } else if (element === 'air') {
        freqs = [146.83, 220.00, 293.66]; // D3, A3, D4 wind triangle
        oscType = 'triangle';
        filterFreq = 500;
      } else { // earth
        freqs = [65.41, 98.00, 130.81]; // C2, G2, C3 deep triangle
        oscType = 'triangle';
        filterFreq = 150;
      }
    }

    const filterNode = ambientCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(filterFreq, now);

    masterGainNode = ambientCtx.createGain();
    masterGainNode.gain.setValueAtTime(0, now);
    masterGainNode.gain.linearRampToValueAtTime(currentVolume * 0.05, now + 2.5);

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

    filterNode.connect(masterGainNode);
    masterGainNode.connect(ambientCtx.destination);

    ambientNodes.forEach(osc => {
      osc.start(now);
    });
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
    masterGainNode = null;
  } catch(err) {
    console.warn("Failed to stop ambient drone:", err);
  }
};
