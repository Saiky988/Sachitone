# SACHITONE — Archived Roblox Profile

A dark, cinematic digital archive preserving the Roblox identity of Sachitone.
Built with React 19 + Vite + TypeScript + Tailwind CSS 4.

## Run

```bash
npm install
npm run dev       # development at http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve dist/ locally
```

> Note: this machine has no global Node.js — a portable Node 22 is used from
> `C:\Users\Admin\Downloads\node-portable\node-v22.23.2-win-x64` (add its
> folder to `PATH` before running the commands above).

## Architecture

```
src/
├── data/profile.ts          # ALL profile facts & asset URLs — edit here only
├── music/MusicContext.tsx   # single Audio() instance, shared player state
├── components/
│   ├── Background.tsx       # fixed video + gradient scrims + visibility pause
│   ├── Loader.tsx           # ~1.8s boot sequence ("SACHITONE / ARCHIVING")
│   ├── CursorLight.tsx      # desktop-only radial cursor light (rAF, lerped)
│   ├── Navigation.tsx       # minimal floating nav + music toggle
│   ├── Hero.tsx             # title + copy + identity card, mouse parallax
│   ├── ProfileCard.tsx      # floating identity card (No. 001)
│   ├── Avatar.tsx           # Roblox avatar: CDN URL → live API → initials
│   ├── SocialLinks.tsx      # hero social pills
│   ├── ArchiveSection.tsx   # archive copy + manifest panel
│   ├── RobloxSection.tsx    # full-body avatar render + ID card
│   ├── SocialsSection.tsx   # link directory
│   ├── MusicPlayer.tsx      # floating player: disc, seek, volume, EQ
│   ├── VideoControls.tsx    # background video pause/mute
│   ├── Footer.tsx
│   ├── Reveal.tsx           # scroll reveal (IntersectionObserver)
│   └── icons.tsx            # brand icons (simple-icons / lucide)
└── index.css                # design system (dark, grain, panels, motion)
```

## External assets (all verified live)

| Asset | URL |
| --- | --- |
| Background video (4K, 12s loop) | `https://r2.guns.lol/6b3a753e-...mov` |
| Favorite song (4:45 MP3) | `https://r2.guns.lol/23ea2c17-...mp3` |
| Roblox profile | `https://roblox.com/users/665880562/profile` |
| Discord / YouTube / PlayerDuo | see `src/data/profile.ts` |

- Avatar is fetched from Roblox's public thumbnail service (user `665880562`),
  with the CDN URL embedded as first attempt and an initials placeholder as
  final fallback — a broken image never renders.
- The video `<source>` intentionally has **no `type` attribute**: the CDN
  labels the stream `video/quicktime` although it is H.264-in-MP4, and the
  mismatched label made Chrome reject the source before sniffing it.
- Music never autoplays — it waits for an explicit user gesture.

## Deployment

Static site — upload `dist/` anywhere (sachitone.lol). `public/` carries
`robots.txt`, `sitemap.xml`, `site.webmanifest` and `/assets/*` icons.
