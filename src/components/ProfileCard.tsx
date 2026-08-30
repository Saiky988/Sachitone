import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";
import { Avatar } from "./Avatar";

/** Floating identity card for the hero's right column. */
export function ProfileCard() {
  return (
    <div className="profile-card-float">
      <aside className="profile-card" aria-label="Sachitone identity card">
        <div className="pc-head">
          <span className="mono-label">Identity card</span>
          <span className="mono-label pc-no">No. 001</span>
        </div>
        <div className="pc-id">
          <span className="pc-avatar-wrap">
            <Avatar
              kind="headshot"
              alt="Sachitone's Roblox avatar headshot"
              className="pc-avatar"
              eager
            />
          </span>
          <div className="pc-name">
            <h2>{profile.name}</h2>
            <span className="mono-label">{profile.handle.toUpperCase()}</span>
          </div>
        </div>
        <dl className="pc-meta">
          <div className="pc-row">
            <dt>Platform</dt>
            <dd>{profile.platform}</dd>
          </div>
          <div className="pc-row">
            <dt>User ID</dt>
            <dd className="mono">{profile.roblox.userId}</dd>
          </div>
          <div className="pc-row">
            <dt>Status</dt>
            <dd className="pc-status">
              <span className="status-dot sm" aria-hidden="true" />
              Archived
            </dd>
          </div>
        </dl>
        <a
          className="btn btn-solid pc-btn"
          href={profile.roblox.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Roblox Profile
          <ArrowUpRight size={14} className="arr" aria-hidden="true" />
        </a>
      </aside>
    </div>
  );
}
