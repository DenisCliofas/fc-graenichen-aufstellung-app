import { useRef, useCallback, useEffect } from 'react';

// Note frequencies (Hz)
const C3 = 130.81, G3 = 196.00, C4 = 261.63;
const E4 = 329.63, G4 = 392.00, A4 = 440.00, B4 = 493.88;
const C5 = 523.25, D5 = 587.33;

// Tempo: ~133 BPM
const BEAT = 0.45;

// Heroic fanfare melody (freq, beat_start, beat_duration)
const MELODY: [number, number, number][] = [
  [G4, 0, 0.5], [G4, 0.5, 0.5], [G4, 1, 0.5], [E4, 1.5, 1.5],
  [G4, 3, 0.5], [G4, 3.5, 0.5], [G4, 4, 0.5], [C5, 4.5, 3.5],
  [D5, 8, 0.5], [D5, 8.5, 0.5], [D5, 9, 0.5], [B4, 9.5, 1.5],
  [C5, 11, 0.5], [B4, 11.5, 0.5], [A4, 12, 0.5], [G4, 12.5, 3.5],
];

// Bass harmony
const BASS: [number, number, number][] = [
  [C3, 0, 2], [G3, 2, 2], [C4, 4, 4],
  [G3, 8, 2], [C3, 10, 2], [G3, 12, 4],
];

function playBrassNote(
  ctx: AudioContext,
  master: GainNode,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
) {
  // Two slightly detuned sawtooth oscillators → rich brass-like timbre
  [1, 2.005].forEach((mult, i) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = freq * mult;

    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    const g = gain / (i + 1);
    const attack = 0.03, decay = 0.1, release = 0.12;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(g, startTime + attack);
    gainNode.gain.linearRampToValueAtTime(g * 0.7, startTime + attack + decay);
    gainNode.gain.setValueAtTime(g * 0.7, startTime + duration - release);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(master);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  });
}

function playKick(ctx: AudioContext, master: GainNode, startTime: number) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, startTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.4);
  gainNode.gain.setValueAtTime(0.7, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
  osc.connect(gainNode);
  gainNode.connect(master);
  osc.start(startTime);
  osc.stop(startTime + 0.5);
}

function playSnare(ctx: AudioContext, master: GainNode, startTime: number) {
  const bufLen = Math.floor(ctx.sampleRate * 0.15);
  const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.22, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(master);
  source.start(startTime);
}

export function useAnthem() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);
  const mutedRef = useRef(false);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.38;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return { ctx: ctxRef.current, master: masterRef.current! };
  }, []);

  const scheduleLoop = useCallback((startTime: number) => {
    const { ctx, master } = ensureCtx();
    const loopDuration = BEAT * 16;

    MELODY.forEach(([freq, beat, dur]) =>
      playBrassNote(ctx, master, freq, startTime + beat * BEAT, dur * BEAT, 0.22));

    BASS.forEach(([freq, beat, dur]) =>
      playBrassNote(ctx, master, freq, startTime + beat * BEAT, dur * BEAT, 0.14));

    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) playKick(ctx, master, startTime + i * BEAT);
      if (i % 4 === 2) playSnare(ctx, master, startTime + i * BEAT);
    }

    const nextStart = startTime + loopDuration;
    const delayMs = Math.max(50, (nextStart - ctx.currentTime - 0.15) * 1000);
    loopTimerRef.current = setTimeout(() => {
      if (playingRef.current) scheduleLoop(nextStart);
    }, delayMs);
  }, [ensureCtx]);

  const start = useCallback(() => {
    if (playingRef.current) return;
    playingRef.current = true;
    mutedRef.current = false;
    const { ctx, master } = ensureCtx();
    master.gain.setTargetAtTime(0.38, ctx.currentTime, 0.1);
    if (ctx.state === 'suspended') ctx.resume();
    scheduleLoop(ctx.currentTime + 0.05);
  }, [ensureCtx, scheduleLoop]);

  const stop = useCallback(() => {
    playingRef.current = false;
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setTimeout(() => {
        ctx.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, 800);
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.setTargetAtTime(muted ? 0 : 0.38, ctx.currentTime, 0.2);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { stop(); }, [stop]);

  return { start, stop, setMuted };
}
