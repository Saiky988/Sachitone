import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { BrandIcon } from "./icons";
import { profile } from "../data/profile";

export function SocialsSection() {
  return (
    <section id="socials" className="section container" aria-labelledby="socials-title">
      <Reveal className="section-head">
        <p className="mono-label section-label">03 — Directory</p>
        <h2 id="socials-title">Socials</h2>
      </Reveal>
      <ul className="dir">
        {profile.links.map((link, index) => (
          <li key={link.id}>
            <Reveal delay={index * 70}>
              <a
                className="dir-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} — ${link.description} (opens in a new tab)`}
              >
                <span className="dir-idx mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="dir-icon" aria-hidden="true">
                  <BrandIcon id={link.id} size={17} />
                </span>
                <span className="dir-text">
                  <span className="dir-name">{link.label}</span>
                  <span className="dir-desc">{link.description}</span>
                </span>
                <ArrowUpRight size={16} className="dir-arrow" aria-hidden="true" />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
