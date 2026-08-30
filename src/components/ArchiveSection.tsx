import { Reveal } from "./Reveal";
import { profile } from "../data/profile";

export function ArchiveSection() {
  return (
    <section id="archive" className="section container" aria-labelledby="archive-title">
      <Reveal className="section-head">
        <p className="mono-label section-label">01 — Archive</p>
        <h2 id="archive-title">The profile</h2>
      </Reveal>
      <div className="archive-grid">
        <Reveal className="archive-copy">
          <p className="lede">{profile.archiveNote}</p>
          <p className="archive-note">
            This page is a preservation, not a biography. What exists here is only what can
            be verified — a name, an ID, and the places it lived. Kept online so the name
            stays findable.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="manifest panel">
            <div className="manifest-head mono-label">Archive manifest</div>
            <dl className="manifest-list">
              <div className="manifest-row">
                <dt>Name</dt>
                <dd>{profile.name}</dd>
              </div>
              <div className="manifest-row">
                <dt>Platform</dt>
                <dd>{profile.platform}</dd>
              </div>
              <div className="manifest-row">
                <dt>User ID</dt>
                <dd className="mono">{profile.roblox.userId}</dd>
              </div>
              <div className="manifest-row">
                <dt>Links</dt>
                <dd>Roblox · Discord · YouTube · PlayerDuo</dd>
              </div>
              <div className="manifest-row">
                <dt>Audio</dt>
                <dd>{profile.music.title}</dd>
              </div>
              <div className="manifest-row">
                <dt>Status</dt>
                <dd className="pc-status">
                  <span className="status-dot sm" aria-hidden="true" />
                  Preserved
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
