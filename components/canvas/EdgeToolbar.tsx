"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowsLeftRight, Minus, Trash, X } from "@phosphor-icons/react";
import type { CanvasEdge } from "@/lib/canvas";
import styles from "./CanvasWorkspace.module.css";

type Point = { x: number; y: number };
const directions = [
  { value: "none", label: "无箭头", Icon: Minus },
  { value: "start", label: "起点箭头", Icon: ArrowLeft },
  { value: "end", label: "终点箭头", Icon: ArrowRight },
  { value: "both", label: "双向箭头", Icon: ArrowsLeftRight },
] as const;

export function EdgeToolbar({ edge, at, size, onChange, onRemove, onClose }: {
  edge: CanvasEdge; at: Point; size: { width: number; height: number };
  onChange: (patch: Partial<Pick<CanvasEdge, "direction" | "dashed">>) => void;
  onRemove: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.left = `${Math.max(8, Math.min(at.x + 12, size.width - element.offsetWidth - 8))}px`;
    element.style.top = `${Math.max(8, Math.min(at.y + 12, size.height - element.offsetHeight - 8))}px`;
  }, [at, size]);
  useLayoutEffect(() => { ref.current?.querySelector<HTMLButtonElement>("button[aria-pressed='true']")?.focus({ preventScroll: true }); }, [edge.id]);
  return <div ref={ref} className={styles.edgeToolbar} role="toolbar" aria-label="连线设置" data-canvas-ui onKeyDown={event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowLeft" ? -1 : 1) + buttons.length) % buttons.length]?.focus();
  }}>
    {directions.map(({ value, label, Icon }) => <button key={value} aria-label={label} title={label} aria-pressed={(edge.direction ?? "none") === value} onClick={() => onChange({ direction: value })}><Icon size={18} /></button>)}
    <span className={styles.edgeSeparator} />
    <button aria-label="虚线" title={edge.dashed ? "改为实线" : "改为虚线"} aria-pressed={edge.dashed ?? false} onClick={() => onChange({ dashed: !edge.dashed })}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M 1 9 H 17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" /></svg></button>
    <button aria-label="删除连线" title="删除连线" onClick={onRemove}><Trash size={17} /></button>
    <button aria-label="关闭连线设置" title="关闭" onClick={onClose}><X size={17} /></button>
  </div>;
}
