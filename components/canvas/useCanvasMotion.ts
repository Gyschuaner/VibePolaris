"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import "./canvas-motion.css";

export function useCanvasMotion(documentId: string | null, title: string | undefined, preview: RefObject<HTMLElement | null>, page: RefObject<HTMLElement | null>) {
  const motion = useRef<ViewTransition | null>(null);
  const pending = useRef<{ target: string | null; resolve: () => void } | null>(null);

  function markHeading() {
    const heading = page.current?.querySelector<HTMLElement>("article h1");
    if (!heading) return;
    const bounds = heading.getBoundingClientRect();
    const singleLine = bounds.height <= parseFloat(getComputedStyle(heading).lineHeight) * 1.1;
    // Metadata is independent of Markdown; only share a visible, matching title.
    heading.style.viewTransitionName = singleLine && heading.textContent?.trim() === title && bounds.top >= 65 && bounds.bottom <= innerHeight ? "canvas-title" : "none";
  }

  useLayoutEffect(markHeading);
  useLayoutEffect(() => {
    const waiting = pending.current;
    if (!waiting) return;
    if (waiting.target !== documentId) motion.current?.skipTransition();
    // View transitions suppress painting while waiting, so do not await a frame here.
    waiting.resolve();
  }, [documentId]);

  useEffect(() => {
    const cancel = () => { motion.current?.skipTransition(); pending.current?.resolve(); };
    window.addEventListener("resize", cancel);
    window.addEventListener("pagehide", cancel);
    return () => {
      cancel();
      window.removeEventListener("resize", cancel);
      window.removeEventListener("pagehide", cancel);
    };
  }, []);

  return function navigate(target: string | null, update: () => void, animate = true) {
    motion.current?.skipTransition();
    pending.current?.resolve();
    const source = documentId ? page.current : preview.current;
    if (!animate || !source || !document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); return; }
    markHeading();
    const root = document.documentElement;
    root.dataset.canvasTransition = target ? "open" : "close";
    let timer: ReturnType<typeof setTimeout>;
    const transition = document.startViewTransition(() => new Promise<void>(resolve => {
      const done = () => {
        clearTimeout(timer);
        if (pending.current?.resolve === done) pending.current = null;
        resolve();
      };
      pending.current = { target, resolve: done };
      // A failed or interrupted route must never leave a frozen snapshot on screen.
      timer = setTimeout(() => { transition.skipTransition(); done(); }, 1500);
      update();
    }));
    motion.current = transition;
    void transition.ready.catch(() => {});
    void transition.finished.catch(() => {}).finally(() => {
      if (motion.current !== transition) return;
      motion.current = null;
      delete root.dataset.canvasTransition;
      if (pending.current || page.current?.querySelector("textarea")) return;
      const destination = target ? page.current?.querySelector<HTMLElement>("button") : preview.current?.querySelector<HTMLElement>("[data-open-document]");
      destination?.focus({ preventScroll: true });
    });
  };
}
