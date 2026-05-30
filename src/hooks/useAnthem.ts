import { useRef, useCallback, useEffect } from 'react';

const ANTHEM_SRC = import.meta.env.BASE_URL + 'anthem.mp3';

export function useAnthem() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create and preload on first use
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.volume = 0.32;
      a.preload = 'auto';
      a.src = ANTHEM_SRC;
      a.load();
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  // Preload immediately on mount so it's ready when user clicks
  useEffect(() => {
    getAudio();
  }, [getAudio]);

  const start = useCallback(() => {
    const a = getAudio();
    a.currentTime = 0;
    const p = a.play();
    if (p) {
      p.catch((err) => console.error('[Anthem] play() failed:', err, 'src:', a.src, 'readyState:', a.readyState));
    }
  }, [getAudio]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    const a = audioRef.current;
    if (a) a.muted = muted;
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  return { start, stop, setMuted };
}
