"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./PointerFeedback.module.css";

const nativeTargets = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-pointer-native], [data-selection-toolbar], :disabled, [aria-disabled="true"]';
const interactiveTargets = 'a[href], button, summary, [role="button"], [role="link"]';
type Point = { x: number; y: number; time: number };
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Merge the filled surface before outlining it; samples have no visible rings.
function envelopePath(points: Point[], progress: number) {
  const samples: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)];
    const steps = Math.max(1, Math.ceil(Math.hypot(c.x - b.x, c.y - b.y) / 4));
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const value = (key: "x" | "y") => .5 * (2 * b[key] + (-a[key] + c[key]) * t + (2 * a[key] - 5 * b[key] + 4 * c[key] - d[key]) * t * t + (-a[key] + 3 * b[key] - 3 * c[key] + d[key]) * t * t * t);
      samples.push({ x: value("x"), y: value("y") });
    }
  }
  samples.push(points[points.length - 1]);
  const format = (n: number) => n.toFixed(2);
  return samples.map((point, i) => {
    const u = samples.length > 1 ? i / (samples.length - 1) : 1;
    const taper = .12 + .88 * smoothstep(Math.min(1, u * 3));
    const radius = (23 * taper * (1 + .42 * Math.sin(Math.PI * u)) + 17 * smoothstep(progress)) * (samples.length === 1 ? .8 : 1);
    return `M${format(point.x - radius)},${format(point.y)}a${format(radius)},${format(radius)} 0 1 0 ${format(2 * radius)},0a${format(radius)},${format(radius)} 0 1 0 ${format(-2 * radius)},0Z`;
  }).join("");
}

export function PointerFeedback() {
  const halo = useRef<HTMLDivElement>(null);
  const water = useRef<SVGPathElement>(null);
  const filterId = useId();

  useEffect(() => {
    const light = halo.current!, shape = water.current!;
    const surface = shape.ownerSVGElement!;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let haloFrame = 0, waterFrame = 0;
    let pressed = false;
    let points: Point[] = [];
    let pending: Point | undefined;
    let releasedAt: number | undefined;
    let removeListeners = () => {};

    const hideHalo = () => {
      cancelAnimationFrame(haloFrame);
      haloFrame = 0;
      light.dataset.visible = "false";
      light.dataset.pressed = "false";
    };
    const clearWater = () => {
      cancelAnimationFrame(waterFrame);
      waterFrame = 0;
      pending = undefined;
      releasedAt = undefined;
      points = [];
      shape.setAttribute("d", "");
      surface.dataset.selecting = "false";
    };
    const hide = () => { hideHalo(); clearWater(); pressed = false; };
    const hasTextSelection = () => Boolean(window.getSelection()?.toString().trim());
    const softenSelection = () => {
      if (!hasTextSelection()) return;
      // Keep water throughout this gesture, with selection as the primary cue.
      surface.dataset.selecting = "true";
      hideHalo();
    };

    const drawWater = (now: number) => {
      waterFrame = 0;
      softenSelection();
      if (pending) {
        const last = points[points.length - 1];
        if (!last || Math.hypot(pending.x - last.x, pending.y - last.y) > 2) points.push(pending);
        pending = undefined;
        // Bound source history and total distance, including fast pointer jumps.
        let distance = 0;
        for (let i = points.length - 1; i > 0; i--) {
          const a = points[i - 1], b = points[i];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          if (distance + length > 900 || points.length - i >= 96) {
            const ratio = Math.min(1, (900 - distance) / Math.max(1, length));
            points = [{ x: b.x + (a.x - b.x) * ratio, y: b.y + (a.y - b.y) * ratio, time: b.time + (a.time - b.time) * ratio }, ...points.slice(i)];
            break;
          }
          distance += length;
        }
      }
      if (!points.length) return;
      if (releasedAt === undefined) {
        const cutoff = now - 840;
        while (points.length > 1 && points[1].time <= cutoff) points.shift();
        if (points.length > 1 && points[0].time < cutoff) {
          const a = points[0], b = points[1];
          const ratio = (cutoff - a.time) / Math.max(1, b.time - a.time);
          points[0] = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio, time: cutoff };
        }
      }
      const progress = releasedAt === undefined ? 0 : Math.min(1, (now - releasedAt) / 780);
      if (progress === 1) { clearWater(); return; }
      shape.setAttribute("d", envelopePath(points, progress));
      shape.setAttribute("opacity", String(.76 * (1 - smoothstep(progress))));
      if (releasedAt !== undefined || points.length > 1) waterFrame = requestAnimationFrame(drawWater);
    };
    const queueWater = () => { if (!waterFrame) waterFrame = requestAnimationFrame(drawWater); };
    const extendWater = (event: PointerEvent) => {
      pending = { x: event.clientX, y: event.clientY, time: performance.now() };
      queueWater();
    };
    const finishWater = () => {
      if (!pressed) return;
      pressed = false;
      releasedAt = performance.now();
      queueWater();
    };

    const configure = () => {
      removeListeners();
      hide();
      if (!media.matches) return;
      const controller = new AbortController();
      const options = { signal: controller.signal, passive: true, capture: true };
      let x = 0, y = 0;
      const usesNativePointer = (event: PointerEvent) => event.pointerType !== "mouse" || !(event.target instanceof Element) || Boolean(event.target.closest(nativeTargets));
      const show = (event: PointerEvent) => {
        if (hasTextSelection()) { hideHalo(); return; }
        x = event.clientX;
        y = event.clientY;
        light.dataset.pressed = String(pressed);
        light.dataset.interactive = String(Boolean((event.target as Element).closest(interactiveTargets)));
        if (!haloFrame) haloFrame = requestAnimationFrame(() => {
          light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          light.dataset.visible = "true";
          haloFrame = 0;
        });
      };
      const move = (event: PointerEvent) => {
        if (usesNativePointer(event)) { hide(); return; }
        if (event.buttons & 1 && pressed) { show(event); extendWater(event); return; }
        finishWater();
        if (event.buttons || hasTextSelection()) { hideHalo(); return; }
        show(event);
      };
      const press = (event: PointerEvent) => {
        if (event.button !== 0 || usesNativePointer(event)) { hide(); return; }
        clearWater();
        pressed = true;
        show(event);
        extendWater(event);
      };
      const release = (event: PointerEvent) => {
        if (event.button !== 0) return;
        finishWater();
        move(event);
      };
      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      document.addEventListener("pointermove", move, options);
      document.addEventListener("pointerover", move, options);
      document.addEventListener("pointerup", release, options);
      document.addEventListener("pointerdown", press, options);
      document.addEventListener("pointercancel", hide, options);
      document.addEventListener("pointerout", leave, options);
      document.addEventListener("selectionchange", softenSelection, options);
      document.addEventListener("keydown", hide, options);
      document.addEventListener("scroll", hide, options);
      document.addEventListener("visibilitychange", hide, options);
      window.addEventListener("blur", hide, { signal: controller.signal, passive: true });
      window.addEventListener("resize", hide, { signal: controller.signal, passive: true });
      removeListeners = () => controller.abort();
    };

    configure();
    media.addEventListener("change", configure);
    return () => { removeListeners(); media.removeEventListener("change", configure); hide(); };
  }, []);

  return <div className={styles.layer} aria-hidden="true">
    <div ref={halo} className={styles.halo}><span /></div>
    <svg className={styles.water}>
      <defs>
        <filter id={filterId} x="-20%" y="-35%" width="140%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 20 -9" result="body" />
          <feMorphology in="body" operator="erode" radius="1.3" result="inside" />
          <feComposite in="body" in2="inside" operator="out" result="edge" />
          <feFlood floodColor="var(--accent)" result="ink" />
          <feComposite in="ink" in2="edge" operator="in" result="line" />
          <feFlood floodColor="var(--brand-star)" floodOpacity=".045" result="tint" />
          <feComposite in="tint" in2="body" operator="in" result="fill" />
          <feMerge><feMergeNode in="fill" /><feMergeNode in="line" /></feMerge>
        </filter>
      </defs>
      <path ref={water} data-pointer-water="" fill="white" filter={`url(#${filterId})`} />
    </svg>
  </div>;
}
