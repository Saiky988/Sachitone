import { useEffect, useRef, type MouseEvent } from "react";
import { Reveal } from "./Reveal";
import { ProfileCard } from "./ProfileCard";
import { SocialLinks } from "./SocialLinks";

type HeroProps = {
  /** Flips true when the loader lifts — triggers the entrance stagger. */
  ready: boolean;
};

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Gentle parallax + fade of the hero copy as it scrolls away.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const inner = section.querySelector<HTMLElement>(".hero-inner");
      if (!inner) return;
      const y = window.scrollY;
      inner.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      inner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--mx", String(((e.clientX - rect.left) / rect.width) * 2 - 1));
    section.style.setProperty("--my", String(((e.clientY - rect.top) / rect.height) * 2 - 1));
  };

  return (
    <section id="top" ref={sectionRef} className="hero" onMouseMove={onMouseMove}>
      <div className="container hero-inner">
        <Reveal active={ready}>
          <p className="status mono-label">
            <span className="status-dot" aria-hidden="true" />
            Archived profile — Roblox
          </p>
        </Reveal>
        <Reveal active={ready} delay={90}>
          <h1 className="hero-title">SACHITONE</h1>
        </Reveal>
        <div className="hero-lower">
          <Reveal active={ready} delay={180} className="hero-lower-left">
            <div className="hero-meta">
              <span className="hero-chip">Roblox</span>
              <span className="hero-sep" aria-hidden="true" />
              <p className="hero-desc">An archived profile of Sachitone.</p>
            </div>
            <SocialLinks />
          </Reveal>
          <Reveal active={ready} delay={300} className="hero-card-col">
            <ProfileCard />
          </Reveal>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
      <span className="edge-label" aria-hidden="true">
        Sachitone — Roblox — Archive
      </span>
    </section>
  );
}
