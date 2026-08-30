import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";
import { BrandIcon } from "./icons";

/** Compact social pills used in the hero. */
export function SocialLinks() {
  return (
    <div className="social-row">
      {profile.links.map((link) => (
        <a
          key={link.id}
          className="btn pill"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} — ${link.description} (opens in a new tab)`}
        >
          <span className="pill-icon" aria-hidden="true">
            <BrandIcon id={link.id} size={15} />
          </span>
          <span>{link.label}</span>
          <ArrowUpRight size={13} className="arr" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
