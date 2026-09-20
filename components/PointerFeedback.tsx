"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./PointerFeedback.module.css";

const nativeTargets = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-native], :disabled, [aria-disabled="true"]';
const interactiveTargets = 'a[href], button, summary, [role="button"], [role="link"]';

export function PointerFeedback() {
  const halo = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const light = halo.current!;
    const ring = ripple.current!;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let pulse: Animation | undefined;
    let removeListeners = () => {};

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      light.dataset.visible = "false";
      pulse?.cancel();
    };

    const configure = () => {
      removeListeners();
      hide();
      if (!media.matches) return;
      const controller = new AbortController();
      const options = { signal: controller.signal, passive: true, capture: true };
      let x = 0;
      let y = 0;

      const move = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        if (event.pointerType !== "mouse" || event.buttons || !target || target.closest(nativeTargets) || window.getSelection()?.isCollapsed === false) {
          hide();
          return;
        }
        x = event.clientX;
        y = event.clientY;
        light.dataset.interactive = String(Boolean(target.closest(interactiveTargets)));
        if (!frame) frame = requestAnimationFrame(() => {
          light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          light.dataset.visible = "true";
          frame = 0;
        });
      };

      const click = (event: MouseEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        if (!event.detail || event.button !== 0 || (event instanceof PointerEvent && event.pointerType !== "mouse") || !target?.closest(interactiveTargets) || target.closest(nativeTargets)) return;
        pulse?.cancel();
        ring.style.left = `${event.clientX}px`;
        ring.style.top = `${event.clientY}px`;
        pulse = ring.animate([
          { transform: "scale(.45)", opacity: .35 },
          { transform: "scale(1.35)", opacity: 0 },
        ], { duration: 380, easing: "cubic-bezier(.2,.65,.3,1)" });
      };

      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      document.addEventListener("pointermove", move, options);
      document.addEventListener("pointerover", move, options);
      document.addEventListener("pointerup", move, options);
      document.addEventListener("pointerdown", hide, options);
      document.addEventListener("pointercancel", hide, options);
      document.addEventListener("pointerout", leave, options);
      document.addEventListener("click", click, options);
      document.addEventListener("keydown", hide, options);
      document.addEventListener("scroll", hide, options);
      document.addEventListener("visibilitychange", hide, options);
      window.addEventListener("blur", hide, options);
      removeListeners = () => controller.abort();
    };

    configure();
    media.addEventListener("change", configure);
    return () => {
      removeListeners();
      media.removeEventListener("change", configure);
      hide();
    };
  }, [pathname]);

  return <div className={styles.layer} aria-hidden="true">
    <div ref={halo} className={styles.halo}><span /></div>
    <div ref={ripple} className={styles.ripple} />
  </div>;
}
