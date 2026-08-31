/**
 * Canonical profile data for the Sachitone archive.
 * Everything the UI renders about Sachitone lives here — only verified facts,
 * no invented biography, statistics or accounts.
 */

export type LinkId = "roblox" | "discord" | "youtube" | "playerduo";

export type ProfileLink = {
  id: LinkId;
  label: string;
  description: string;
  href: string;
};

const ROBLOX_USER_ID = "665880562";

/**
 * Avatar CDN URLs returned by Roblox's public thumbnail service
 * (thumbnails.roblox.com) for user 665880562. These "30DAY" URLs rotate
 * roughly monthly, so the UI treats them as a first attempt and falls back to
 * a live API lookup, then to an initials placeholder — never a broken image.
 */
const ROBLOX_HEADSHOT_URL =
  "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-1273E3BE3C16DA914A38D7943172416B-Png/420/420/AvatarHeadshot/Png/noFilter";
const ROBLOX_FULLBODY_URL =
  "https://tr.rbxcdn.com/30DAY-Avatar-1273E3BE3C16DA914A38D7943172416B-Png/420/420/Avatar/Png/noFilter";

export const profile = {
  name: "Sachitone",
  handle: "@Sachitone",
  platform: "Roblox",
  tagline: "An archived profile of Sachitone.",
  archiveNote:
    "An archived Roblox identity preserved from an earlier era of the internet.",
  roblox: {
    userId: ROBLOX_USER_ID,
    profileUrl: `https://roblox.com/users/${ROBLOX_USER_ID}/profile`,
    headshotUrl: ROBLOX_HEADSHOT_URL,
    fullBodyUrl: ROBLOX_FULLBODY_URL,
  },
  links: [
    {
      id: "roblox",
      label: "Roblox",
      description: "Player profile",
      href: `https://roblox.com/users/${ROBLOX_USER_ID}/profile`,
    },
    {
      id: "discord",
      label: "Discord",
      description: "Community server",
      href: "https://discord.gg/FBK9RNyec5",
    },
    {
      id: "youtube",
      label: "YouTube",
      description: "@Sachitone",
      href: "https://m.youtube.com/@Sachitone#bottom-sheet",
    },
    {
      id: "playerduo",
      label: "PlayerDuo",
      description: "Player profile",
      href: "https://playerduo.net/24765964",
    },
  ] as ProfileLink[],
  music: {
    title: "Favorite Song",
    src: "/music.mp3",
  },
} as const;
