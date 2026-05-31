import { useRef, useEffect, useCallback } from 'react';

const ANTHEM_SRC = import.meta.env.BASE_URL + 'anthem.mp3';

export function useAnthem() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.volume = 0.32;
      a.preload = 'auto';
      a.src = ANTHEM_SRC;
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  // Preload on mount
  useEffect(() => {
    getAudio();
  }, [getAudio]);

  // Call this on user gesture (button click) — guaranteed to work
  const play = useCallback(() => {
    const a = getAudio();
    a.muted = false;
    if (!startedRef.current) {
      startedRef.current = true;
      a.play().catch((e) => console.error('[Anthem]', e));
    } else {
      a.play().catch((e) => console.error('[Anthem]', e));
    }
  }, [getAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  return { play, pause };
}
