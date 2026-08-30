import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";
import { useMusic } from "../music/MusicContext";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const music = useMusic();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="brand" href="#top" aria-label="Sachitone — back to top">
          SACHITONE
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#archive">Archive</a>
          <a href="#roblox">Roblox</a>
          <a href="#socials">Socials</a>
        </nav>
        <button
          type="button"
          className={`nav-music ${music.playing ? "nav-music-on" : ""}`}
          onClick={music.toggle}
          aria-pressed={music.playing}
          aria-label={music.playing ? "Pause music" : "Play music"}
        >
          <Music2 size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="nav-music-label" aria-hidden="true">
            Music
          </span>
          <span className="nav-music-dot" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
