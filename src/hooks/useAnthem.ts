import { useRef, useEffect, useCallback } from 'react';

const ANTHEM_SRC = import.meta.env.BASE_URL + 'anthem.mp3';

export function useAnthem() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.volume = 0.32;
      a.muted = true; // start muted — browsers allow muted autoplay
      a.preload = 'auto';
      a.src = ANTHEM_SRC;
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  // Play (muted) immediately on mount — no gesture needed for muted audio
  useEffect(() => {
    const a = getAudio();
    a.play().catch(() => {});

    // On first user gesture: unmute
    const unmute = () => {
      if (!a.muted) return; // already unmuted
      a.muted = false;
      window.removeEventListener('pointerup', unmute);
      window.removeEventListener('keydown', unmute);
    };
    window.addEventListener('pointerup', unmute);
    window.addEventListener('keydown', unmute);
    return () => {
      window.removeEventListener('pointerup', unmute);
      window.removeEventListener('keydown', unmute);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    const a = audioRef.current;
    if (a) a.muted = muted;
  }, []);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  return { setMuted };
}
