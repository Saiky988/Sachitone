import { useState } from "react";
import { Loader } from "./components/Loader";
import { Background } from "./components/Background";
import { CursorLight } from "./components/CursorLight";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ArchiveSection } from "./components/ArchiveSection";
import { RobloxSection } from "./components/RobloxSection";
import { SocialsSection } from "./components/SocialsSection";
import { Footer } from "./components/Footer";
import { MusicPlayer } from "./components/MusicPlayer";
import { MusicProvider } from "./music/MusicContext";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  return (
    <MusicProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader onReveal={() => setReady(true)} />
      <CursorLight />
      <Background />
      <Navigation />
      <main id="main">
        <Hero ready={ready} />
        <div className="page-body">
          <ArchiveSection />
          <RobloxSection />
          <SocialsSection />
        </div>
        <Footer />
      </main>
      <MusicPlayer />
      <div className="grain" aria-hidden="true" />
    </MusicProvider>
  );
}
