"use client";

import { useEffect, useRef } from "react";

type BrandMarkProps = {
  size: "nav" | "hero" | "footer";
  intro?: boolean;
};

export function BrandMark({ size, intro = false }: BrandMarkProps) {
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    if (!mark || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const replay = (className: string) => {
      mark.classList.remove(className);
      requestAnimationFrame(() => mark.classList.add(className));
    };
    const link = mark.closest("a");
    const glint = () => replay("is-glinting");

    if (intro) requestAnimationFrame(() => replay("is-arriving"));
    link?.addEventListener("pointerenter", glint);
    link?.addEventListener("focus", glint);

    return () => {
      link?.removeEventListener("pointerenter", glint);
      link?.removeEventListener("focus", glint);
    };
  }, [intro]);

  return (
    <span ref={markRef} className={`brand-mark brand-mark--${size}`} aria-hidden="true">
      <span className="brand-trail" />
      <span className="brand-star" />
    </span>
  );
}
