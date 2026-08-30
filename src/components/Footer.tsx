import { profile } from "../data/profile";

const footerLinks = profile.links.filter(
  (l) => l.id === "roblox" || l.id === "discord" || l.id === "youtube",
);

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="mono-label footer-brand">Sachitone — archived. © 2026</span>
        <nav className="footer-links" aria-label="Footer links">
          {footerLinks.map((link) => (
            <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
        <span className="mono-label footer-note">Not affiliated with Roblox Corporation.</span>
      </div>
    </footer>
  );
}
