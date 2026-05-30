import { useRef, useCallback, useEffect } from 'react';

const ANTHEM_SRC = import.meta.env.BASE_URL + 'anthem.mp3';

export function useAnthem() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio(ANTHEM_SRC);
      a.loop = true;
      a.volume = 0.65;
      a.preload = 'auto';
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  const start = useCallback(() => {
    const a = getAudio();
    a.currentTime = 0;
    a.play().catch(() => {});
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
