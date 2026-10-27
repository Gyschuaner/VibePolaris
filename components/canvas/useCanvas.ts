"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptyCanvas, type CanvasData } from "@/lib/canvas";
import { CanvasConflict, forkCloudCache, readCanvas, readCloudCache, writeCanvas, writeCloudCache } from "@/lib/canvas-storage";
import { cloudPollInterval, cloudRequest } from "@/lib/canvas-cloud";
import { mergeCanvas, sameCanvas } from "@/lib/canvas-sync";
import type { CloudCanvas } from "@/lib/account/canvas-store";

export function useCanvas(options: { storageKey?: string; owner?: string; remoteId?: string; autoSync?: boolean; onFork?: (canvas: CloudCanvas) => void } = {}) {
  const key = options.storageKey || "main", remoteId = options.remoteId, owner = options.owner;
  const [data, setData] = useState(emptyCanvas), [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved"), [error, setError] = useState("");
  const latest = useRef(data), revision = useRef(0), generation = useRef(0), pending = useRef(false);
  const saving = useRef<Promise<void> | null>(null), conflict = useRef(false), loaded = useRef(false);
  const base = useRef<CanvasData | undefined>(undefined), syncing = useRef(false), disposed = useRef(false);
  const reading = useRef(false);
  const [cloudStatus, setCloudStatus] = useState("自动同步已关闭");
  const optionsRef = useRef(options); optionsRef.current = options;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const channel = useRef<BroadcastChannel | null>(null);

  const flush = useCallback(async function persist() {
    clearTimeout(timer.current);
    if (saving.current) { await saving.current; if (pending.current) await persist(); return; }
    if (!pending.current || conflict.current) return;
    const snapshot = latest.current, at = generation.current;
    saving.current = (async () => {
      try {
        revision.current = await writeCanvas(snapshot, revision.current, key);
        latest.current = { ...latest.current, revision: revision.current };
        if (generation.current === at) pending.current = false;
        if (!disposed.current) { setData(latest.current); setStatus(pending.current ? "saving" : "saved"); setError(""); }
        channel.current?.postMessage("changed");
      } catch (cause) {
        conflict.current = cause instanceof CanvasConflict;
        if (!disposed.current) { setError(cause instanceof Error ? cause.message : "本地保存失败，草稿仍在当前页。"); setStatus("error"); }
      }
    })();
    await saving.current; saving.current = null;
  }, [key]);

  const reload = useCallback(async (discard = false) => {
    if (reading.current || saving.current || (pending.current && !discard)) return;
    reading.current = true;
    try {
      let value: CanvasData;
      if (remoteId && owner) {
        const cache = await readCloudCache(key);
        if (cache.data && cache.base) { value = cache.data; base.current = cache.base; }
        else {
          const remote = await cloudRequest(owner, { id: remoteId });
          if (!remote) throw new Error("云端画布暂不可用。");
          const localRevision = await writeCloudCache(key, remote.data, remote.data, 0);
          value = { ...remote.data, revision: localRevision }; base.current = remote.data;
        }
      } else value = await readCanvas(key);
      if (disposed.current) return;
      if (saving.current || (pending.current && !discard)) return;
      clearTimeout(timer.current); latest.current = value; revision.current = value.revision;
      pending.current = false; conflict.current = false; loaded.current = true;
      setData(value); setReady(true); setError(""); setStatus("saved");
    } catch (cause) { if (!disposed.current) setError(cause instanceof Error ? cause.message : "读取画布失败，请重试。"); }
    finally { reading.current = false; }
  }, [key, owner, remoteId]);

  const sync = useCallback(async (silent = false) => {
    if (!owner || !remoteId || !base.current || !loaded.current || syncing.current || conflict.current || disposed.current) return;
    syncing.current = true;
    if (!silent || !sameCanvas(latest.current, base.current)) setCloudStatus("同步中…");
    try {
      await flush();
      if (pending.current || disposed.current) { if (!disposed.current) setCloudStatus("本地草稿尚未保存，请先重试保存"); return; }
      const snapshot = latest.current, before = base.current;
      const remote = (await cloudRequest(owner, { id: remoteId, base: before }))?.data ?? before;
      if (disposed.current) return;
      const merged = mergeCanvas(before, snapshot, remote);
      let accepted: CanvasData;
      if (merged) {
        accepted = sameCanvas(merged, remote) ? remote : (await cloudRequest(owner, { method: "PUT", body: { id: remoteId, expected: remote.revision, data: merged }, base: remote }))!.data;
      } else accepted = remote;
      if (disposed.current) return;
      if (merged && accepted.revision === before.revision && sameCanvas(snapshot, accepted) && sameCanvas(latest.current, snapshot)) {
        setCloudStatus("已同步"); return;
      }
      let next = merged ? mergeCanvas(snapshot, latest.current, accepted) : null;
      if (!next) {
        await flush();
        const copy = latest.current;
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify({ nodes: copy.nodes, edges: copy.edges }))))).map(value => value.toString(16).padStart(2, "0")).join("");
        const source = `conflict:${remoteId}:${hash}`, name = `冲突副本 ${new Date().toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
        let fork = (await cloudRequest(owner, { method: "POST", body: { source, name, data: copy } }))!;
        if (disposed.current) return;
        let forkKey = `account:${owner}:${fork.id}`, cache = await readCloudCache(forkKey);
        const occupied = () => !sameCanvas(fork.data, copy) || (cache.data && cache.base && !sameCanvas(cache.data, cache.base) && !sameCanvas(cache.data, copy));
        if (occupied()) {
          // A previous copy may already have new edits; retry into a distinct, stable destination.
          fork = (await cloudRequest(owner, { method: "POST", body: { source: `${source}:${fork.data.revision}:${cache.data?.revision ?? 0}`, name, data: copy } }))!;
          forkKey = `account:${owner}:${fork.id}`; cache = await readCloudCache(forkKey);
          if (occupied()) throw new Error("已有的副本也在修改，当前草稿已保留，请稍后再次同步。");
        }
        let forkRevision = cache.data?.revision ?? 0;
        for (;;) {
          const at = generation.current;
          saving.current = (async () => {
            const result = await forkCloudCache(key, forkKey, latest.current, remote, fork.data, revision.current, forkRevision);
            revision.current = result.revision; forkRevision = result.forkRevision;
          })();
          try { await saving.current; } finally { saving.current = null; }
          if (disposed.current) return;
          if (at === generation.current) break;
        }
        latest.current = { ...remote, revision: revision.current }; base.current = remote; pending.current = false;
        optionsRef.current.onFork?.(fork); return;
      }
      // Rebase edits made during the request before acknowledging the cloud version locally.
      for (;;) {
        await flush();
        if (pending.current || disposed.current) return;
        const at = generation.current, here = latest.current;
        next = mergeCanvas(snapshot, here, accepted);
        if (!next) { setCloudStatus("检测到同时修改，请再次同步以保留副本"); return; }
        const toSave = next;
        saving.current = (async () => { revision.current = await writeCloudCache(key, toSave, accepted, revision.current); })();
        try { await saving.current; } finally { saving.current = null; }
        base.current = accepted;
        if (at !== generation.current) {
          const recent = mergeCanvas(here, latest.current, toSave);
          if (!recent) { conflict.current = true; setError("同步时又出现了同处修改，当前草稿已保留。请导出后重新载入。"); return; }
          latest.current = { ...recent, revision: revision.current }; pending.current = true;
          continue;
        }
        latest.current = { ...toSave, revision: revision.current }; pending.current = false;
        setData(latest.current); setStatus("saved"); setError("");
        channel.current?.postMessage("changed");
        setCloudStatus(sameCanvas(latest.current, accepted) ? "已同步" : "已保存在本地，待同步");
        break;
      }
    } catch (cause) {
      if (!disposed.current) {
        if (cause instanceof CanvasConflict) { conflict.current = true; setError(cause.message); }
        setCloudStatus((cause as { status?: number }).status === 409 ? "云端刚有更新，正在等待再次同步" : `已保存在本地 · ${cause instanceof Error ? cause.message : "等待联网同步"}`);
      }
    } finally { syncing.current = false; }
  }, [key, owner, remoteId, flush]);

  useEffect(() => {
    disposed.current = false;
    void reload();
    const refresh = () => { void reload(); };
    try { channel.current = new BroadcastChannel(`vibepolaris-canvas-changes:${key}`); channel.current.onmessage = refresh; } catch { /* Focus also refreshes a clean canvas. */ }
    const beforeUnload = (event: BeforeUnloadEvent) => { if (pending.current || saving.current) { event.preventDefault(); event.returnValue = ""; } };
    const hide = () => { if (document.hidden) void flush(); };
    const pagehide = () => { void flush(); };
    const beforeAccountChange = (event: Event) => {
      (event as CustomEvent<Promise<unknown>[]>).detail.push(flush().then(() => { if (pending.current) throw new Error("当前草稿尚未保存，请先导出或重试保存。"); }));
    };
    window.addEventListener("focus", refresh); window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("pagehide", pagehide); document.addEventListener("visibilitychange", hide);
    window.addEventListener("vp-account-before-change", beforeAccountChange);
    return () => {
      disposed.current = true;
      clearTimeout(timer.current); void flush(); channel.current?.close(); channel.current = null;
      window.removeEventListener("focus", refresh); window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("pagehide", pagehide); document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("vp-account-before-change", beforeAccountChange);
    };
  }, [reload, flush, key]);

  useEffect(() => {
    if (!remoteId || !ready) return;
    const dirty = base.current && !sameCanvas(latest.current, base.current);
    if (!options.autoSync) { setCloudStatus(dirty ? "自动同步已关闭 · 有本地修改" : "自动同步已关闭"); return; }
    if (!dirty) return;
    setCloudStatus("已保存在本地，待同步");
    const delay = setTimeout(() => void sync(), 3000);
    return () => clearTimeout(delay);
  }, [remoteId, ready, options.autoSync, data.nodes, data.edges, sync]);

  useEffect(() => {
    if (!remoteId || !ready || !options.autoSync) return;
    void sync(true);
    const poll = setInterval(() => { if (!document.hidden) void sync(true); }, cloudPollInterval);
    const online = () => { void sync(true); };
    window.addEventListener("online", online);
    return () => { clearInterval(poll); window.removeEventListener("online", online); };
  }, [remoteId, ready, options.autoSync, sync]);

  const update = useCallback((change: (value: CanvasData) => CanvasData, immediate = false) => {
    if (!loaded.current) return;
    const next = change(latest.current);
    if (next === latest.current) return;
    latest.current = next; generation.current++; pending.current = true; setData(next);
    if (!conflict.current) setStatus("saving");
    clearTimeout(timer.current);
    if (immediate) void flush(); else timer.current = setTimeout(() => void flush(), 450);
  }, [flush]);

  return { data, ready, status, error, update, flush, reload, sync, cloudStatus, hasPending: () => pending.current, isConflict: () => conflict.current };
}
