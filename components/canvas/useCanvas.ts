"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptyCanvas, type CanvasData } from "@/lib/canvas";
import { CanvasConflict, readCanvas, writeCanvas } from "@/lib/canvas-storage";

export function useCanvas() {
  const [data, setData] = useState(emptyCanvas), [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved"), [error, setError] = useState("");
  const latest = useRef(data), revision = useRef(0), generation = useRef(0), pending = useRef(false);
  const saving = useRef(false), again = useRef(false), conflict = useRef(false), loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const channel = useRef<BroadcastChannel | null>(null);

  const flush = useCallback(async function persist() {
    clearTimeout(timer.current);
    if (saving.current) { again.current = true; return; }
    if (!pending.current || conflict.current) return;
    saving.current = true;
    const snapshot = latest.current, at = generation.current;
    try {
      revision.current = await writeCanvas(snapshot, revision.current);
      latest.current = { ...latest.current, revision: revision.current };
      if (generation.current === at) pending.current = false;
      setStatus(pending.current ? "saving" : "saved"); setError("");
      channel.current?.postMessage("changed");
    } catch (cause) {
      conflict.current = cause instanceof CanvasConflict;
      setError(cause instanceof Error ? cause.message : "本地保存失败，草稿仍在当前页。"); setStatus("error");
    } finally {
      saving.current = false;
      if (again.current) { again.current = false; void persist(); }
    }
  }, []);

  const reload = useCallback(async (discard = false) => {
    if (saving.current || (pending.current && !discard)) return;
    try {
      const value = await readCanvas();
      if (saving.current || (pending.current && !discard)) return;
      clearTimeout(timer.current); latest.current = value; revision.current = value.revision;
      pending.current = false; conflict.current = false; loaded.current = true;
      setData(value); setReady(true); setError(""); setStatus("saved");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "读取画布失败，请重试。"); }
  }, []);

  useEffect(() => {
    void reload();
    const refresh = () => { void reload(); };
    try { channel.current = new BroadcastChannel("vibepolaris-canvas-changes"); channel.current.onmessage = refresh; } catch { /* Focus also refreshes a clean canvas. */ }
    const beforeUnload = (event: BeforeUnloadEvent) => { if (pending.current || saving.current) { event.preventDefault(); event.returnValue = ""; } };
    const hide = () => { if (document.hidden) void flush(); };
    const pagehide = () => { void flush(); };
    window.addEventListener("focus", refresh); window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("pagehide", pagehide); document.addEventListener("visibilitychange", hide);
    return () => {
      clearTimeout(timer.current); void flush(); channel.current?.close(); channel.current = null;
      window.removeEventListener("focus", refresh); window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("pagehide", pagehide); document.removeEventListener("visibilitychange", hide);
    };
  }, [reload, flush]);

  const update = useCallback((change: (value: CanvasData) => CanvasData, immediate = false) => {
    if (!loaded.current) return;
    const next = change(latest.current);
    if (next === latest.current) return;
    latest.current = next; generation.current++; pending.current = true; setData(next);
    if (!conflict.current) setStatus("saving");
    clearTimeout(timer.current);
    if (immediate) void flush(); else timer.current = setTimeout(() => void flush(), 450);
  }, [flush]);

  return { data, ready, status, error, update, flush, reload, hasPending: () => pending.current, isConflict: () => conflict.current };
}
