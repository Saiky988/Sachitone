import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { profile } from "../data/profile";

type MusicContextValue = {
  playing: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
  volume: number;
  error: boolean;
  toggle: () => void;
  seek: (t: number) => void;
  setMuted: (m: boolean) => void;
  setVolume: (v: number) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  // The audio element is created once, lazily, without autoplay: music only
  // starts after an explicit user interaction (browser policies block the rest).
  const [audio] = useState(() => {
    if (typeof window === "undefined") return null;
    const el = new Audio(profile.music.src);
    el.preload = "metadata";
    el.volume = 0.8;
    return el;
  });

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMutedState] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onError = () => setError(true);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [audio]);

  const toggle = useCallback(() => {
    if (!audio || error) return;
    if (audio.paused) {
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  }, [audio, error]);

  const seek = useCallback(
    (t: number) => {
      if (!audio || !Number.isFinite(t)) return;
      const max = Number.isFinite(audio.duration) ? audio.duration : t;
      audio.currentTime = Math.min(Math.max(t, 0), max);
      setCurrentTime(audio.currentTime);
    },
    [audio],
  );

  const setMuted = useCallback(
    (m: boolean) => {
      if (!audio) return;
      audio.muted = m;
      setMutedState(m);
    },
    [audio],
  );

  const setVolume = useCallback(
    (v: number) => {
      if (!audio) return;
      const clamped = Math.min(Math.max(v, 0), 1);
      audio.volume = clamped;
      setVolumeState(clamped);
    },
    [audio],
  );

  const value = useMemo(
    () => ({
      playing,
      currentTime,
      duration,
      muted,
      volume,
      error,
      toggle,
      seek,
      setMuted,
      setVolume,
    }),
    [playing, currentTime, duration, muted, volume, error, toggle, seek, setMuted, setVolume],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
