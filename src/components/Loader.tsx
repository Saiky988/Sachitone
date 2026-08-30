import { useEffect, useState } from "react";

/**
 * Cinematic boot sequence: name, thin progress line, "ARCHIVING" — gone in
 * ~1.8s. Calls onReveal as the overlay starts fading so the hero can rise
 * underneath. Reduced motion shortens the whole sequence.
 */
export function Loader({ onReveal }: { onReveal: () => void }) {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fadeAt = reduce ? 150 : 1300;
    const goneAt = reduce ? 400 : 1850;
    const t1 = setTimeout(() => {
      setPhase("fade");
      onReveal();
    }, fadeAt);
    const t2 = setTimeout(() => setPhase("gone"), goneAt);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onReveal]);

  if (phase === "gone") return null;

  return (
    <div
      className={`loader ${phase === "fade" ? "loader-fade" : ""}`}
      role="status"
      aria-label="Loading archive"
    >
      <span className="loader-name">SACHITONE</span>
      <span className="loader-bar" aria-hidden="true">
        <i />
      </span>
      <span className="loader-sub">
        ARCHIVING<i className="loader-caret" aria-hidden="true">_</i>
      </span>
    </div>
  );
}
