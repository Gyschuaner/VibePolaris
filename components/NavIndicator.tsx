"use client";

import { useLayoutEffect, useRef } from "react";

type Position = { left: number; top: number; width: number; height: number; viewport: number };
// Page-level headers remount during navigation; retain only the last visible slider position.
const positions = new Map<string, Position>();

export function NavIndicator({ active, slot }: { active: string | null; slot: "desktop" | "mobile" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const indicator = ref.current;
    const track = indicator?.parentElement;
    if (!indicator || !track) return;
    let animation: Animation | undefined;
    let target: Position | undefined;
    const measure = (animate: boolean) => {
      const item = track.querySelector<HTMLElement>('[data-nav-active="true"]');
      const rect = item?.getBoundingClientRect();
      if (!rect?.width || !rect.height) {
        indicator.hidden = true;
        positions.delete(slot);
        target = undefined;
        animation?.cancel();
        return;
      }
      const padding = slot === "desktop" ? 10 : 5;
      const next = { left: rect.left - padding, top: rect.top - 7, width: rect.width + padding * 2, height: rect.height + 14, viewport: window.innerWidth };
      if (target && target.left === next.left && target.top === next.top && target.width === next.width && target.height === next.height && target.viewport === next.viewport) return;
      const previous = positions.get(slot);
      const origin = track.getBoundingClientRect();
      animation?.cancel();
      indicator.hidden = false;
      Object.assign(indicator.style, { left: `${next.left - origin.left}px`, top: `${next.top - origin.top}px`, width: `${next.width}px`, height: `${next.height}px` });
      if (animate && previous?.viewport === next.viewport && typeof indicator.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation = indicator.animate([
          { transform: `translate(${previous.left - next.left}px, ${previous.top - next.top}px)`, width: `${previous.width}px`, height: `${previous.height}px` },
          { transform: "translate(0, 0)", width: `${next.width}px`, height: `${next.height}px` },
        ], { duration: 360, easing: "cubic-bezier(.22, 1, .36, 1)" });
      }
      target = next;
      positions.set(slot, next);
    };
    measure(true);
    const resize = () => measure(false);
    const observer = new ResizeObserver(resize);
    observer.observe(track);
    window.addEventListener("resize", resize);
    return () => {
      if (!indicator.hidden) {
        const rect = indicator.getBoundingClientRect();
        if (rect.width) positions.set(slot, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, viewport: window.innerWidth });
      }
      animation?.cancel();
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [active, slot]);
  return <span ref={ref} className="nav-indicator" data-nav-indicator={slot} hidden aria-hidden="true" />;
}
