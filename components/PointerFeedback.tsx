"use client";

import { useEffect, useRef } from "react";
import styles from "./PointerFeedback.module.css";

const nativeTargets = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-native], :disabled, [aria-disabled="true"]';
const interactiveTargets = 'a[href], button, summary, [role="button"], [role="link"]';

export function PointerFeedback() {
  const halo = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = halo.current!;
    const ring = ripple.current!;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let pulse: Animation | undefined;
    let pressedAt: { x: number; y: number } | undefined;
    let removeListeners = () => {};

    const hideHalo = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      light.dataset.visible = "false";
      light.dataset.pressed = "false";
    };
    const hide = () => {
      hideHalo();
      pressedAt = undefined;
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

      const usesNativePointer = (event: PointerEvent) => event.pointerType !== "mouse" || !(event.target instanceof Element) || Boolean(event.target.closest(nativeTargets));
      const show = (event: PointerEvent) => {
        x = event.clientX;
        y = event.clientY;
        light.dataset.interactive = String(Boolean((event.target as Element).closest(interactiveTargets)));
        if (!frame) frame = requestAnimationFrame(() => {
          light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          light.dataset.visible = "true";
          frame = 0;
        });
      };

      const move = (event: PointerEvent) => {
        if (usesNativePointer(event) || window.getSelection()?.isCollapsed === false) { hide(); return; }
        if (event.buttons) {
          // A little mouse jitter is still a press; a real drag uses native feedback.
          if (!pressedAt || Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y) > 6) hide();
          return;
        }
        show(event);
      };

      const press = (event: PointerEvent) => {
        if (event.button !== 0 || usesNativePointer(event)) { hide(); return; }
        pressedAt = { x: event.clientX, y: event.clientY };
        show(event);
        light.dataset.pressed = "true";
        pulse?.cancel();
        ring.style.left = `${event.clientX}px`;
        ring.style.top = `${event.clientY}px`;
        pulse = ring.animate([
          { transform: "scale(.35)", opacity: .7, offset: 0 },
          { transform: "scale(1.25)", opacity: .45, offset: .6 },
          { transform: "scale(1.75)", opacity: 0, offset: 1 },
        ], { duration: 650, easing: "ease-out" });
      };

      const release = (event: PointerEvent) => {
        pressedAt = undefined;
        light.dataset.pressed = "false";
        move(event);
      };
      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      document.addEventListener("pointermove", move, options);
      document.addEventListener("pointerover", move, options);
      document.addEventListener("pointerup", release, options);
      document.addEventListener("pointerdown", press, options);
      document.addEventListener("pointercancel", hide, options);
      document.addEventListener("pointerout", leave, options);
      document.addEventListener("keydown", hide, options);
      document.addEventListener("scroll", hideHalo, options);
      document.addEventListener("visibilitychange", hide, options);
      // Only leaving the window cancels feedback, not focus moving between controls.
      window.addEventListener("blur", hide, { signal: controller.signal, passive: true });
      removeListeners = () => controller.abort();
    };

    configure();
    media.addEventListener("change", configure);
    return () => {
      removeListeners();
      media.removeEventListener("change", configure);
      hide();
    };
  }, []);

  return <div className={styles.layer} aria-hidden="true">
    <div ref={halo} className={styles.halo}><span /></div>
    <div ref={ripple} className={styles.ripple} />
  </div>;
}
