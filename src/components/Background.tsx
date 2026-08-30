import { useEffect, type RefObject } from "react";
import { profile } from "../data/profile";

type BackgroundProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoError: () => void;
};

/**
 * Fixed cinematic backdrop: the provided MOV behind a stack of gradient
 * scrims, with a pure-CSS fallback that is always rendered underneath so a
 * failed or unsupported video degrades into a dark gradient, never a blank.
 */
export function Background({ videoRef, onVideoError }: BackgroundProps) {
  useEffect(() => {
    const wasPlaying = { current: false };
    const onVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        wasPlaying.current = !video.paused && !video.ended;
        if (!video.paused) video.pause();
      } else if (wasPlaying.current && video.paused) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [videoRef]);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-fallback" />
      <video
        ref={videoRef}
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onPlaying={(e) => e.currentTarget.classList.add("on")}
        onError={onVideoError}
      >
        {/* No `type` attribute: the CDN serves this as video/quicktime even
            though the stream is plain H.264-in-MP4, and a mismatched type makes
            browsers refuse the source before sniffing it. */}
        <source src={profile.backgroundVideo.src} onError={onVideoError} />
      </video>
      <div className="bg-overlay" />
    </div>
  );
}
