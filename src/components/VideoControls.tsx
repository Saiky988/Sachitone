import { useEffect, useState, type RefObject } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type VideoControlsProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

/** Subtle fixed controls for the cinematic background video (pause + mute). */
export function VideoControls({ videoRef }: VideoControlsProps) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRefCurrent = videoRef;

  useEffect(() => {
    const video = videoRefCurrent.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setMuted(video.muted);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolume);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolume);
    };
  }, [videoRefCurrent]);

  const toggleVideo = () => {
    const video = videoRefCurrent.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRefCurrent.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  return (
    <div className="video-controls">
      <button
        type="button"
        className="icon-btn"
        onClick={toggleVideo}
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleMute}
        aria-label={muted ? "Unmute background video" : "Mute background video"}
        aria-pressed={muted}
      >
        {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}
