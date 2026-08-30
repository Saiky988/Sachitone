import { useRef, useState } from "react";
import { profile } from "../data/profile";

type AvatarKind = "headshot" | "fullBody";

const API_ENDPOINT: Record<AvatarKind, string> = {
  headshot: "avatar-headshot",
  fullBody: "avatar",
};

type AvatarProps = {
  kind: AvatarKind;
  alt: string;
  className?: string;
  eager?: boolean;
};

/**
 * Resilient Roblox avatar. Tries the cached CDN URL first, then a live lookup
 * against thumbnails.roblox.com, then an initials placeholder — a broken
 * image icon never reaches the screen.
 */
export function Avatar({ kind, alt, className = "", eager = false }: AvatarProps) {
  const cdnUrl =
    kind === "headshot" ? profile.roblox.headshotUrl : profile.roblox.fullBodyUrl;
  const [src, setSrc] = useState<string | null>(cdnUrl);
  const [failed, setFailed] = useState(false);
  const triedApi = useRef(false);

  const tryApi = async () => {
    triedApi.current = true;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        `https://thumbnails.roblox.com/v1/users/${API_ENDPOINT[kind]}?userIds=${profile.roblox.userId}&size=420x420&format=Png&isCircular=false`,
        { signal: ctrl.signal },
      );
      clearTimeout(timer);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as { data?: Array<{ imageUrl?: string | null }> };
      const url = json.data?.[0]?.imageUrl;
      if (!url) throw new Error("no imageUrl");
      setSrc(url);
    } catch {
      setFailed(true);
    }
  };

  const onError = () => {
    if (!triedApi.current) {
      void tryApi();
    } else {
      setFailed(true);
    }
  };

  if (failed || !src) {
    return (
      <div className={`avatar-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <span aria-hidden="true">S</span>
      </div>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={onError}
    />
  );
}
