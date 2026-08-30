import type { CSSProperties } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "../music/MusicContext";
import { profile } from "../data/profile";

const EQ_BARS = [
  { d: 0.72, delay: -0.1 },
  { d: 1.05, delay: -0.35 },
  { d: 0.85, delay: -0.6 },
  { d: 1.18, delay: -0.2 },
  { d: 0.66, delay: -0.5 },
  { d: 0.94, delay: -0.05 },
];

function fmt(t: number): string {
  if (!Number.isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Persistent floating player for Sachitone's favorite song. Compact disc
 * playback control, seekable progress, time readout, and an animated
 * equalizer — audio only ever starts from an explicit user interaction.
 */
export function MusicPlayer() {
  const m = useMusic();
  const pct = m.duration > 0 ? Math.min(100, (m.currentTime / m.duration) * 100) : 0;

  return (
    <div
      className={`player ${m.error ? "player-error" : ""}`}
      data-playing={m.playing ? "true" : undefined}
      data-error={m.error ? "true" : undefined}
      role="group"
      aria-label={`Music player — ${profile.music.title}`}
    >
      <button
        type="button"
        className="disc"
        onClick={m.toggle}
        disabled={m.error}
        aria-label={m.playing ? "Pause music" : "Play music"}
      >
        <span className="disc-face" aria-hidden="true" />
        <span className="disc-glyph" aria-hidden="true">
          {m.playing ? <Pause size={11} /> : <Play size={11} className="disc-play" />}
        </span>
      </button>

      <div className="player-main">
        <div className="player-top">
          <span className="player-title">{profile.music.title}</span>
          <span className="player-time mono">
            {m.error ? "--:--" : `${fmt(m.currentTime)} / ${fmt(m.duration)}`}
          </span>
        </div>
        <input
          type="range"
          className="range progress"
          min={0}
          max={m.duration || 0}
          step={0.1}
          value={Math.min(m.currentTime, m.duration || 0)}
          disabled={m.error || !m.duration}
          onChange={(e) => m.seek(Number(e.target.value))}
          aria-label="Seek"
          style={{ "--fill": `${pct}%` } as CSSProperties}
        />
      </div>

      <div className="eq" aria-hidden="true">
        {EQ_BARS.map((bar, i) => (
          <span
            key={i}
            style={{ "--d": `${bar.d}s`, "--dl": `${bar.delay}s` } as CSSProperties}
          />
        ))}
      </div>

      <div className="player-volume">
        <button
          type="button"
          className="icon-btn sm"
          onClick={() => m.setMuted(!m.muted)}
          disabled={m.error}
          aria-label={m.muted ? "Unmute music" : "Mute music"}
          aria-pressed={m.muted}
        >
          {m.muted ? <VolumeX size={13} aria-hidden="true" /> : <Volume2 size={13} aria-hidden="true" />}
        </button>
        <input
          type="range"
          className="range volume"
          min={0}
          max={1}
          step={0.01}
          value={m.muted ? 0 : m.volume}
          disabled={m.error}
          onChange={(e) => {
            const v = Number(e.target.value);
            m.setVolume(v);
            if (v > 0) m.setMuted(false);
          }}
          aria-label="Volume"
          style={{ "--fill": `${(m.muted ? 0 : m.volume) * 100}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}
