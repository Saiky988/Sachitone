import { useEffect } from "react";

/**
 * Custom Virtual Momentum Smooth Scroll Engine:
 * - Intercepts mouse wheel / trackpad signals
 * - Computes target scroll with momentum and smoothly lerps window scroll position
 * - Smooth anchor navigation for #archive, #roblox, #socials, #top
 * - Fluid, responsive, and handles keyboard / scrollbar dragging
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let isWheeling = false;
    let wheelTimeout: number | undefined;
    let rafId: number;

    const getScrollMax = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // Continuous smooth animation loop
    const loop = () => {
      const max = getScrollMax();
      targetScroll = Math.max(0, Math.min(max, targetScroll));

      const diff = targetScroll - currentScroll;

      // Smooth damped lerp interpolation (0.075 = fluid, slow and premium)
      if (Math.abs(diff) > 0.3) {
        currentScroll += diff * 0.075;
        window.scrollTo(0, currentScroll);
      } else if (currentScroll !== targetScroll) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Intercept mouse wheel events and calculate target scroll with momentum
    const onWheel = (e: WheelEvent) => {
      // Allow scrolling inside sub-containers with scrollbars
      let targetNode = e.target as HTMLElement | null;
      while (targetNode && targetNode !== document.body && targetNode !== document.documentElement) {
        const style = window.getComputedStyle(targetNode);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          targetNode.scrollHeight > targetNode.clientHeight
        ) {
          return;
        }
        targetNode = targetNode.parentElement;
      }

      e.preventDefault();
      isWheeling = true;
      clearTimeout(wheelTimeout);
      wheelTimeout = window.setTimeout(() => {
        isWheeling = false;
      }, 150);

      // Normalize wheel delta across Windows / macOS
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        // Line mode (common on Windows mouse wheel)
        delta *= 32;
      } else if (e.deltaMode === 2) {
        // Page mode
        delta *= window.innerHeight;
      }

      // Slightly scale delta for smooth, controllable speed
      targetScroll += delta * 0.9;
      targetScroll = Math.max(0, Math.min(getScrollMax(), targetScroll));
    };

    // Smooth navigation on anchor clicks (#archive, #roblox, #socials, etc.)
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const targetEl = document.querySelector(hash) as HTMLElement | null;
      if (targetEl) {
        e.preventDefault();
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
        targetScroll = Math.max(0, Math.min(getScrollMax(), top));
        history.pushState(null, "", hash);
      }
    };

    // Keep target synchronized when user drags native scrollbar or uses keyboard
    const onNativeScroll = () => {
      if (!isWheeling && Math.abs(window.scrollY - currentScroll) > 50) {
        targetScroll = window.scrollY;
        currentScroll = window.scrollY;
      }
    };

    // Handle keyboard navigation (PageDown, PageUp, Space, Arrows)
    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
        return;
      }

      let step = 0;
      if (e.key === "ArrowDown") step = 80;
      else if (e.key === "ArrowUp") step = -80;
      else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) step = window.innerHeight * 0.85;
      else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) step = -window.innerHeight * 0.85;
      else if (e.key === "Home") {
        e.preventDefault();
        targetScroll = 0;
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        targetScroll = getScrollMax();
        return;
      }

      if (step !== 0) {
        e.preventDefault();
        targetScroll += step;
        targetScroll = Math.max(0, Math.min(getScrollMax(), targetScroll));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(wheelTimeout);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
