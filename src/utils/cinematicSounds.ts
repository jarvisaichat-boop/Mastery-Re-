const SOUND_PREF_KEY = 'mastery-dashboard-cinematic-sound';

export function getCinematicSoundEnabled(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    if (stored === null) return false;
    return stored === 'true';
  } catch {
    return false;
  }
}

export function setCinematicSoundEnabled(value: boolean): void {
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(value));
  } catch {}
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getAudioContext(): AudioContext | null {
  try {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    return new Ctor();
  } catch {
    return null;
  }
}

function createWhiteNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function playDrumRoll(durationMs: number): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const duration = durationMs / 1000;
  const noiseBuffer = createWhiteNoiseBuffer(ctx, duration);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 220;
  bandpass.Q.value = 0.8;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
  gainNode.gain.linearRampToValueAtTime(0.22, ctx.currentTime + duration * 0.75);
  gainNode.gain.linearRampToValueAtTime(0.45, ctx.currentTime + duration);

  const tremolo = ctx.createGain();
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(8, ctx.currentTime);
  lfo.frequency.linearRampToValueAtTime(32, ctx.currentTime + duration);

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.5;
  lfo.connect(lfoGain);
  lfoGain.connect(tremolo.gain);
  tremolo.gain.value = 0.5;

  source.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(tremolo);
  tremolo.connect(ctx.destination);
  lfo.start(ctx.currentTime);
  source.start(ctx.currentTime);

  return () => {
    try {
      source.stop();
      lfo.stop();
      ctx.close();
    } catch {}
  };
}

export function playCrash(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 2.2;
  const noiseBuffer = createWhiteNoiseBuffer(ctx, duration);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 3500;
  highpass.Q.value = 0.5;

  const shimmer = ctx.createBiquadFilter();
  shimmer.type = 'peaking';
  shimmer.frequency.value = 8000;
  shimmer.gain.value = 8;
  shimmer.Q.value = 1.5;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.9, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(highpass);
  highpass.connect(shimmer);
  shimmer.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(ctx.currentTime);

  const bodyBuffer = createWhiteNoiseBuffer(ctx, 0.15);
  const bodySource = ctx.createBufferSource();
  bodySource.buffer = bodyBuffer;

  const bodyFilter = ctx.createBiquadFilter();
  bodyFilter.type = 'bandpass';
  bodyFilter.frequency.value = 180;
  bodyFilter.Q.value = 1.2;

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.6, ctx.currentTime);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  bodySource.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  bodySource.start(ctx.currentTime);

  setTimeout(() => {
    try { ctx.close(); } catch {}
  }, (duration + 0.5) * 1000);
}

export function playLineHit(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.18;
  const noiseBuffer = createWhiteNoiseBuffer(ctx, duration);

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 280;
  filter.Q.value = 2;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(ctx.currentTime);

  setTimeout(() => {
    try { ctx.close(); } catch {}
  }, 500);
}
