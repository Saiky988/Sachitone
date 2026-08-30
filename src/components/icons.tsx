import { siDiscord, siRoblox, siYoutube } from "simple-icons";
import { Gamepad2 } from "lucide-react";
import type { LinkId } from "../data/profile";

const brandPaths: Record<Exclude<LinkId, "playerduo">, string> = {
  roblox: siRoblox.path,
  discord: siDiscord.path,
  youtube: siYoutube.path,
};

export function BrandIcon({ id, size = 15 }: { id: LinkId; size?: number }) {
  if (id === "playerduo") {
    return <Gamepad2 size={size} strokeWidth={1.75} aria-hidden="true" />;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={brandPaths[id]} />
    </svg>
  );
}
