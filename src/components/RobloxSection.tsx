import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Avatar } from "./Avatar";
import { profile } from "../data/profile";

export function RobloxSection() {
  return (
    <section id="roblox" className="section container" aria-labelledby="roblox-title">
      <Reveal className="section-head">
        <p className="mono-label section-label">02 — Roblox</p>
        <h2 id="roblox-title">Player identity</h2>
      </Reveal>
      <Reveal>
        <div className="roblox-card panel">
          <div className="roblox-avatar">
            <div className="roblox-avatar-glow" aria-hidden="true" />
            <div className="roblox-avatar-frame corner">
              <Avatar
                kind="fullBody"
                alt="Sachitone's Roblox avatar render"
                className="roblox-avatar-img"
              />
            </div>
          </div>
          <div className="roblox-info">
            <p className="mono-label roblox-label">Roblox — archived identity</p>
            <h3>{profile.name}</h3>
            <dl className="roblox-meta">
              <div className="roblox-row">
                <dt>User ID</dt>
                <dd className="mono">{profile.roblox.userId}</dd>
              </div>
              <div className="roblox-row">
                <dt>Profile</dt>
                <dd className="mono">/users/{profile.roblox.userId}</dd>
              </div>
            </dl>
            <a
              className="btn roblox-btn"
              href={profile.roblox.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Roblox Profile
              <ArrowUpRight size={14} className="arr" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
