
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSfx = {
  // Premium crystalline hum expansion - deeper and richer
  bloom: () => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(40, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(120, t + 0.5);
    bodyGain.gain.setValueAtTime(0, t);
    bodyGain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmerOsc.type = 'sine';
    shimmerOsc.frequency.setValueAtTime(1400, t);
    shimmerOsc.frequency.exponentialRampToValueAtTime(2200, t + 0.4);
    shimmerGain.gain.setValueAtTime(0, t);
    shimmerGain.gain.linearRampToValueAtTime(0.03, t + 0.05);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);

    bodyOsc.start(t);
    shimmerOsc.start(t);
    bodyOsc.stop(t + 0.8);
    shimmerOsc.stop(t + 0.8);
  },
  
  // Clean, dry, digital 'tick' click
  click: () => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);
    
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.06);
  },

  // Subtle, calm, and warmer hover sound
  hover: () => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Lower frequency for a calmer, less "sharp" feel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    
    // Softer gain envelope with a very low peak for extreme subtlety
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.006, t + 0.02);
    gain.gain.linearRampToValueAtTime(0, t + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.1);
  },

  // Completion chime - Bright and rewarding
  success: () => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    
    const freqs = [523.25, 1046.50]; // C5, C6
    
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + (i * 0.05));
      
      gain.gain.setValueAtTime(0, t + (i * 0.05));
      gain.gain.linearRampToValueAtTime(0.05, t + (i * 0.05) + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i * 0.05) + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + (i * 0.05));
      osc.stop(t + (i * 0.05) + 0.3);
    });
  }
};
