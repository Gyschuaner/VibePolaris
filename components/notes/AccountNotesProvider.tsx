"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ownerHeaders, useAccount } from "@/components/account/AccountProvider";
import { accountNotesCache, type AccountNotesCache } from "@/lib/account-notes-cache";
import { readNotes } from "@/lib/reading-notes-storage";
import { mergeNotes, type ReadingNote } from "@/lib/reading-notes";
import { mergeReadingNotes, notesSnapshotSchema, type NotesSnapshot } from "@/lib/reading-notes-sync";
import { sameValue } from "@/lib/canvas-sync";
import { cloudPollInterval } from "@/lib/canvas-cloud";
import { NotesProvider, type NotesStorage } from "./NotesProvider";
import styles from "./ReadingNotes.module.css";
import { siteModules } from "@/lib/site-modules";

async function requestNotes(owner: string, base: NotesSnapshot, notes?: ReadingNote[]) {
  const response = await fetch("/api/account/notes", {
    method: notes ? "PUT" : "GET", cache: "no-store", signal: AbortSignal.timeout(30000),
    headers: { ...ownerHeaders(owner), ...(notes ? { "Content-Type": "application/json" } : { "If-None-Match": `"${base.revision}"` }) },
    body: notes ? JSON.stringify({ expected: base.revision, notes }) : undefined,
  });
  if (response.status === 304) return base;
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "云端笔记暂不可用。");
  return notesSnapshotSchema.parse(result);
}

export function AccountNotesProvider({ children }: { children: ReactNode }) {
  const { account, ready, openAccount } = useAccount();
  if (!siteModules.notes) return <NotesProvider enabled={false}>{children}</NotesProvider>;
  if (!account) return <NotesProvider enabled={ready} syncControls={<div className={styles.syncControls}><button onClick={openAccount}>登录并选择云端同步</button></div>}>{children}</NotesProvider>;
  return <AccountNotebook key={account.id} owner={account.id}>{children}</AccountNotebook>;
}

function AccountNotebook({ owner, children }: { owner: string; children: ReactNode }) {
  const { notesAutoSync, setNotesAutoSync } = useAccount();
  const [revision, setRevision] = useState(0), [changes, setChanges] = useState(0);
  const [status, setStatus] = useState("正在读取账号笔记…"), [busy, setBusy] = useState(false), [guestCount, setGuestCount] = useState(0);
  const alive = useRef(true), running = useRef(false), enabled = useRef(notesAutoSync), channel = useRef<BroadcastChannel | null>(null);
  useLayoutEffect(() => { enabled.current = notesAutoSync; }, [notesAutoSync]);
  const changed = useCallback((cache: AccountNotesCache) => {
    if (alive.current) {
      setRevision(cache.revision); setChanges(value => value + 1);
      if (!sameValue(cache.notes, cache.base.notes)) setStatus("已保存在本地，待同步");
    }
  }, []);
  const storage = useMemo<NotesStorage>(() => {
    const change = async (apply: (notes: ReadingNote[]) => ReadingNote[]) => {
      const cache = await accountNotesCache(owner, value => ({ ...value, notes: apply(value.notes) }));
      changed(cache); return cache.notes;
    };
    return {
      read: async () => (await accountNotesCache(owner)).notes,
      write: async note => { await change(notes => [...notes.filter(item => item.id !== note.id), note]); },
      remove: async id => { await change(notes => notes.filter(note => note.id !== id)); },
      import: incoming => change(notes => mergeNotes(notes, incoming, () => crypto.randomUUID())),
    };
  }, [owner, changed]);

  const sync = useCallback(async (mode: "read" | "auto" | "manual", silent = false) => {
    if (running.current || !alive.current || (mode === "auto" && !enabled.current)) return;
    running.current = true;
    try {
      const snapshot = await accountNotesCache(owner);
      if (mode === "auto" && !silent && sameValue(snapshot.notes, snapshot.base.notes)) return;
      setBusy(true); if (!silent) setStatus("同步中…");
      const remote = await requestNotes(owner, snapshot.base);
      if (!alive.current || (mode === "auto" && !enabled.current)) return;
      const merged = mergeReadingNotes(snapshot.base.notes, snapshot.notes, remote.notes, () => crypto.randomUUID());
      const accepted = mode === "read" || sameValue(merged.notes, remote.notes) ? remote : await requestNotes(owner, remote, merged.notes);
      if (!alive.current) return;
      let conflicts = merged.conflicts;
      const next = await accountNotesCache(owner, current => {
        const rebased = mergeReadingNotes(snapshot.notes, current.notes, mode === "read" ? merged.notes : accepted.notes, () => crypto.randomUUID());
        conflicts += rebased.conflicts;
        return { ...current, notes: rebased.notes, base: accepted };
      });
      if (!alive.current) return;
      setRevision(next.revision); channel.current?.postMessage("changed");
      if (!sameValue(next.notes, accepted.notes)) setChanges(value => value + 1);
      setStatus(conflicts ? "同时修改的版本均已保留" : sameValue(next.notes, accepted.notes) ? "已同步" : "已保存在本地，待同步");
    } catch (error) { if (alive.current) setStatus(`本地笔记已保留 · ${error instanceof Error ? error.message : "等待联网同步"}`); }
    finally { running.current = false; if (alive.current) setBusy(false); }
  }, [owner]);

  useEffect(() => {
    alive.current = true;
    void readNotes().then(notes => { if (alive.current) setGuestCount(notes.length); }).catch(() => {});
    queueMicrotask(() => void sync("read"));
    try {
      channel.current = new BroadcastChannel("vibepolaris-note-changes");
      channel.current.onmessage = () => { void accountNotesCache(owner).then(changed).catch(() => {}); };
    } catch { /* Local writes still schedule synchronization. */ }
    return () => { alive.current = false; channel.current?.close(); };
  }, [owner, sync, changed]);
  useEffect(() => {
    if (!notesAutoSync) return;
    const timer = setTimeout(() => void sync("auto"), 3000);
    return () => clearTimeout(timer);
  }, [changes, notesAutoSync, sync]);
  useEffect(() => {
    if (!notesAutoSync) return;
    const poll = setInterval(() => { if (!document.hidden) void sync("auto", true); }, cloudPollInterval);
    const online = () => void sync("auto", true);
    window.addEventListener("online", online);
    return () => { clearInterval(poll); window.removeEventListener("online", online); };
  }, [notesAutoSync, sync]);

  async function importGuest() {
    setBusy(true);
    try {
      await storage.import(await readNotes()); channel.current?.postMessage("changed");
      setStatus("本地笔记已合并，重复内容已跳过；本地原件保留。"); setGuestCount(0);
    } catch (error) { setStatus(error instanceof Error ? error.message : "合并失败，原笔记未改动。"); }
    finally { setBusy(false); }
  }
  return <NotesProvider storage={storage} revision={revision} description="笔记仅当前账号可见。开启自动同步后，可在不同浏览器继续阅读和批注。" syncControls={<div className={styles.syncControls} aria-label="笔记保存与同步">
    <label><input type="checkbox" checked={notesAutoSync} onChange={event => { try { setNotesAutoSync(event.target.checked); } catch (error) { setStatus((error as Error).message); } }} />自动同步笔记到云端</label>
    <button disabled={busy} onClick={() => void sync("manual")}>立即同步笔记</button>
    <p role="status">{status}{!notesAutoSync && " · 自动同步已关闭"}</p>
    {guestCount > 0 && <div><p>此浏览器还有 {guestCount} 条本地笔记。合并后按当前同步设置保存，本地原件保留。</p><button disabled={busy} onClick={() => void importGuest()}>合并本地笔记到账号</button></div>}
  </div>}>{children}</NotesProvider>;
}
