import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profile } from "../data/profile";

export type AudioFrequencyData = {
  bass: number;    // 0.0 to 1.0 (sub-bass & kick drum peak)
  mid: number;     // 0.0 to 1.0 (vocals, snare, chords)
  treble: number;  // 0.0 to 1.0 (hi-hats, sparkle)
  level: number;   // 0.0 to 1.0 (overall energy)
  isPlaying: boolean;
};

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
  getAudioData: () => AudioFrequencyData;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  // Local audio file with full same-origin Web Audio API analyser access
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

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceConnectedRef = useRef(false);

  // Initialize Web Audio API on first user play
  const initWebAudio = useCallback(() => {
    if (!audio || typeof window === "undefined" || sourceConnectedRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.72; // Snappy transient response

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      sourceConnectedRef.current = true;
    } catch {
      // Fallback seamlessly if any browser permission occurs
    }
  }, [audio]);

  useEffect(() => {
    if (!audio) return;
    const onPlay = () => {
      initWebAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume().catch(() => {});
      }
      setPlaying(true);
    };
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
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [audio, initWebAudio]);

  const toggle = useCallback(() => {
    if (!audio || error) return;
    if (audio.paused) {
      initWebAudio();
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  }, [audio, error, initWebAudio]);

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

  // Real-time Audio Spectrum extraction
  const getAudioData = useCallback((): AudioFrequencyData => {
    if (!playing || !audio) {
      return { bass: 0, mid: 0, treble: 0, level: 0, isPlaying: false };
    }

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray as any);

      // 1. Sub-bass & Kick (bins 1-8: ~20Hz - 180Hz)
      let bassSum = 0;
      const bassCount = 8;
      for (let i = 1; i <= bassCount; i++) {
        bassSum += dataArray[i];
      }
      const rawBass = bassSum / (bassCount * 255);
      // Power curve for punchy, impactful kick beats
      const bass = Math.pow(rawBass, 1.6) * 1.35;

      // 2. Mids / Vocals / Snare (bins 9-36: ~200Hz - 1600Hz)
      let midSum = 0;
      const midCount = 28;
      for (let i = 9; i <= 9 + midCount; i++) {
        midSum += dataArray[i];
      }
      const mid = Math.pow(midSum / (midCount * 255), 1.2);

      // 3. Treble / Hi-hats / Air (bins 37-120: ~1700Hz - 9000Hz)
      let trebleSum = 0;
      const trebleCount = 60;
      for (let i = 37; i <= 37 + trebleCount; i++) {
        trebleSum += dataArray[i];
      }
      const treble = Math.pow(trebleSum / (trebleCount * 255), 1.1) * 1.2;

      const level = Math.min(1.0, bass * 0.5 + mid * 0.35 + treble * 0.15);

      return {
        bass: Math.min(1.2, bass),
        mid: Math.min(1.0, mid),
        treble: Math.min(1.0, treble),
        level: Math.min(1.0, level),
        isPlaying: true,
      };
    }

    return { bass: 0, mid: 0, treble: 0, level: 0, isPlaying: true };
  }, [playing, audio]);

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
      getAudioData,
    }),
    [playing, currentTime, duration, muted, volume, error, toggle, seek, setMuted, setVolume, getAudioData],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
