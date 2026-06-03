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
