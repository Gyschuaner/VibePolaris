"use client";

import { useEffect, useRef } from "react";
import styles from "./PointerFeedback.module.css";

const nativeTargets = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-native], :disabled, [aria-disabled="true"]';
const interactiveTargets = 'a[href], button, summary, [role="button"], [role="link"]';
const rippleSlots = Array.from({ length: 16 }, (_, index) => index);

export function PointerFeedback() {
  const halo = useRef<HTMLDivElement>(null);
  const ripples = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = halo.current!;
    const rings = Array.from(ripples.current!.children) as HTMLDivElement[];
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const pulses: Animation[] = [];
    let nextRing = 0;
    let pressed = false;
    let lastRipple: { x: number; y: number; time: number } | undefined;
    let removeListeners = () => {};

    const hideHalo = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      light.dataset.visible = "false";
      light.dataset.pressed = "false";
    };
    const hide = () => {
      hideHalo();
      pressed = false;
      lastRipple = undefined;
      pulses.forEach(pulse => pulse.cancel());
    };

    const emitRipple = (event: PointerEvent) => {
      const index = nextRing++ % rings.length, ring = rings[index];
      pulses[index]?.cancel();
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      pulses[index] = ring.animate([
        { transform: "scale(.35)", opacity: .7, offset: 0 },
        { transform: "scale(1.25)", opacity: .45, offset: .6 },
        { transform: "scale(1.75)", opacity: 0, offset: 1 },
      ], { duration: 650, easing: "ease-out" });
      lastRipple = { x: event.clientX, y: event.clientY, time: event.timeStamp };
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
        light.dataset.pressed = String(pressed);
        light.dataset.interactive = String(Boolean((event.target as Element).closest(interactiveTargets)));
        if (!frame) frame = requestAnimationFrame(() => {
          light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          light.dataset.visible = "true";
          frame = 0;
        });
      };

      const move = (event: PointerEvent) => {
        if (usesNativePointer(event)) { hideHalo(); return; }
        if (event.buttons & 1 && pressed) {
          show(event);
          // Bound emission while allowing each ring to finish independently.
          if (lastRipple && event.timeStamp-lastRipple.time >= 45 && Math.hypot(event.clientX-lastRipple.x,event.clientY-lastRipple.y) >= 8) emitRipple(event);
          return;
        }
        pressed = false;
        if (event.buttons || window.getSelection()?.isCollapsed === false) { hideHalo(); return; }
        show(event);
      };

      const press = (event: PointerEvent) => {
        if (event.button !== 0 || usesNativePointer(event)) { hide(); return; }
        pressed = true;
        show(event);
        emitRipple(event);
      };

      const release = (event: PointerEvent) => {
        pressed = false;
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
    <div ref={ripples}>{rippleSlots.map(slot => <div key={slot} className={styles.ripple} />)}</div>
  </div>;
}
