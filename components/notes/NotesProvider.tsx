"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowSquareOut, DownloadSimple, MagnifyingGlass, NotePencil, Plus, Trash, UploadSimple, X } from "@phosphor-icons/react";
import { parseNotesBackup, type NoteAnchor, type NoteSource, type ReadingNote } from "@/lib/reading-notes";
import { deleteNote, importNotes, readNotes, writeNote } from "@/lib/reading-notes-storage";
import styles from "./ReadingNotes.module.css";

type SaveStatus = "saving" | "saved" | "error";
type NotesContextValue = {
  notes: ReadingNote[]; ready: boolean; storageError: boolean; statuses: Record<string, SaveStatus>;
  add: (source: NoteSource | null, anchor?: NoteAnchor | null) => ReadingNote | null;
  update: (note: ReadingNote, body: string) => void; flush: (id: string) => void;
  remove: (note: ReadingNote) => Promise<void>; retry: (id: string) => void; reload: () => Promise<void>;
  open: (id?: string) => void; notify: (message: string) => void;
};
const NotesContext = createContext<NotesContextValue | null>(null);
export function useNotes() {
  const value = useContext(NotesContext);
  if (!value) throw new Error("NotesProvider is required");
  return value;
}
export function NoteTime({ value }: { value: string }) {
  const timestamp = new Date(value);
  const day = timestamp.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  const time = timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return <time className={styles.time} dateTime={value} tabIndex={0} aria-label={`${day} ${time}`}><span aria-hidden="true">{day}</span>{time}</time>;
}
export function NoteEditor({ note, autoFocus = false }: { note: ReadingNote; autoFocus?: boolean }) {
  const { update, flush, retry, statuses } = useNotes();
  const editor = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!editor.current) return;
    editor.current.style.height = "0px";
    editor.current.style.height = `${Math.max(62, editor.current.scrollHeight)}px`;
  }, [note.body]);
  useEffect(() => { if (autoFocus) editor.current?.focus({ preventScroll: true }); }, [autoFocus]);
  return <><textarea ref={editor} className={styles.editor} data-note-body aria-label="笔记内容" placeholder="写下你的理解…" value={note.body} maxLength={20000} rows={2} onChange={event => update(note, event.target.value)} onBlur={() => flush(note.id)} />{statuses[note.id] === "error" && <p className={styles.error} role="alert">未保存<button onClick={() => retry(note.id)}>重试</button></p>}</>;
}
export function NotesButton({ compact = false }: { compact?: boolean }) {
  const { open } = useNotes();
  return <button className={compact ? styles.mobileNav : styles.navButton} onClick={() => open()} aria-label="我的笔记">{compact ? <NotePencil size={22} /> : "我的笔记"}</button>;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<ReadingNote[]>([]), [ready, setReady] = useState(false), [storageError, setStorageError] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, SaveStatus>>({}), [editing, setEditing] = useState<string | null>(null), [query, setQuery] = useState("");
  const [message, setMessage] = useState(""), [deleted, setDeleted] = useState<ReadingNote | null>(null), [backupStatus, setBackupStatus] = useState(""), [importing, setImporting] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null), input = useRef<HTMLInputElement>(null);
  const latest = useRef(new Map<string, ReadingNote>()), pending = useRef(new Map<string, ReadingNote>()), timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const channel = useRef<BroadcastChannel | null>(null), messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((value: string) => { if (messageTimer.current) clearTimeout(messageTimer.current); setMessage(value); messageTimer.current = setTimeout(() => setMessage(""), 5000); }, []);
  const reload = useCallback(async () => {
    try {
      const loaded = await readNotes();
      const merged = new Map(loaded.map(note => [note.id, note]));
      pending.current.forEach((note, id) => merged.set(id, note));
      latest.current = merged; setNotes([...merged.values()]); setStorageError(false); setReady(true);
    } catch { setStorageError(true); }
  }, []);
  const save = useCallback(async (note: ReadingNote) => {
    clearTimeout(timers.current.get(note.id));
    try {
      await writeNote(note); channel.current?.postMessage("changed");
      if (latest.current.get(note.id) === note) { pending.current.delete(note.id); setStatuses(old => ({ ...old, [note.id]: "saved" })); }
    } catch { if (latest.current.get(note.id) === note) setStatuses(old => ({ ...old, [note.id]: "error" })); }
  }, []);
  useEffect(() => {
    void reload();
    try { channel.current = new BroadcastChannel("vibepolaris-note-changes"); channel.current.onmessage = () => void reload(); } catch { /* Focus refresh covers browsers without BroadcastChannel. */ }
    const flushAll = () => { pending.current.forEach(note => void save(note)); };
    const beforeUnload = (event: BeforeUnloadEvent) => { if (pending.current.size) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("focus", reload); window.addEventListener("pagehide", flushAll); window.addEventListener("beforeunload", beforeUnload);
    return () => { channel.current?.close(); channel.current = null; window.removeEventListener("focus", reload); window.removeEventListener("pagehide", flushAll); window.removeEventListener("beforeunload", beforeUnload); };
  }, [reload, save]);
  const update = useCallback((note: ReadingNote, body: string) => {
    const updated = { ...note, body, updatedAt: new Date().toISOString() };
    latest.current.set(note.id, updated); pending.current.set(note.id, updated);
    setNotes(old => old.map(item => item.id === note.id ? updated : item)); setStatuses(old => ({ ...old, [note.id]: "saving" }));
    clearTimeout(timers.current.get(note.id)); timers.current.set(note.id, setTimeout(() => void save(updated), 450));
  }, [save]);
  const add = useCallback((source: NoteSource | null, anchor: NoteAnchor | null = null) => {
    if (!ready) { notify("请先开启浏览器本地存储后重试"); return null; }
    const existing = anchor && [...latest.current.values()].find(note => note.source?.path === source?.path && note.anchor?.block === anchor.block && note.anchor.exact === anchor.exact && note.anchor.start === anchor.start);
    if (existing) return existing;
    const now = new Date().toISOString(), note: ReadingNote = { id: crypto.randomUUID(), source, anchor, body: "", createdAt: now, updatedAt: now };
    latest.current.set(note.id, note); pending.current.set(note.id, note); setNotes(old => [...old, note]); setStatuses(old => ({ ...old, [note.id]: "saving" })); void save(note);
    return note;
  }, [ready, notify, save]);
  const flush = useCallback((id: string) => { const note = pending.current.get(id); if (note) void save(note); }, [save]);
  const retry = useCallback((id: string) => { const note = latest.current.get(id); if (note) void save(note); }, [save]);
  const open = useCallback((id?: string) => { setEditing(id ?? null); setQuery(""); setBackupStatus(""); if (!dialog.current?.open) dialog.current?.showModal(); }, []);
  const remove = useCallback(async (note: ReadingNote) => {
    clearTimeout(timers.current.get(note.id));
    try {
      await deleteNote(note.id); pending.current.delete(note.id); latest.current.delete(note.id);
      setNotes(old => old.filter(item => item.id !== note.id)); setDeleted(note); setEditing(null); channel.current?.postMessage("changed");
    } catch { flush(note.id); notify("未能删除，原笔记已保留"); }
  }, [flush, notify]);
  async function undo() {
    if (!deleted) return;
    try { await writeNote(deleted); latest.current.set(deleted.id, deleted); setNotes(old => [...old.filter(note => note.id !== deleted.id), deleted]); setDeleted(null); channel.current?.postMessage("changed"); }
    catch { notify("恢复失败，请保持页面打开后重试"); }
  }
  function exportBackup() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, application: "vibepolaris", exportedAt: new Date().toISOString(), notes }, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `VibePolaris-笔记-${new Date().toISOString().slice(0,10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setBackupStatus("已导出当前笔记，包含尚未保存的编辑。");
  }
  async function importBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("备份文件不能超过 5 MB");
      if (pending.current.size) throw new Error("请先等待本地保存完成，再导入备份。");
      const incoming = parseNotesBackup(await file.text());
      await importNotes(incoming); await reload(); channel.current?.postMessage("changed"); setBackupStatus("导入完成，已有笔记已保留，重复内容已跳过。");
    } catch (error) { setBackupStatus(error instanceof SyntaxError ? "文件不是有效的笔记备份，已有笔记未改动。" : error instanceof Error ? error.message : "导入失败，已有笔记未改动。"); }
    finally { setImporting(false); }
  }
  const active = notes.find(note => note.id === editing);
  const filtered = notes.filter(note => `${note.body} ${note.anchor?.exact ?? ""} ${note.source?.title ?? ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  const feedback = <>{deleted && <div className={styles.undo} role="status">笔记已删除<button onClick={undo}>撤销</button><button aria-label="关闭删除提示" onClick={() => setDeleted(null)}><X size={16}/></button></div>}{message && <p role="status">{message}</p>}</>;
  return <NotesContext.Provider value={{ notes, ready, storageError, statuses, add, update, flush, remove, retry, reload, open, notify }}>
    {children}
    {(deleted || message) && <div className={styles.toast} data-note-ui>{feedback}</div>}
    <dialog ref={dialog} className={styles.library} data-note-ui aria-labelledby="notes-library-title">
      <header><h2 id="notes-library-title">我的笔记</h2><button aria-label="关闭我的笔记" onClick={() => dialog.current?.close()}><X size={24}/></button></header>
      <p className={styles.privacy}>仅保存在此浏览器，不上传服务器。</p>
      {storageError && <p className={styles.error} role="alert">浏览器本地存储暂不可用。<button onClick={reload}>重试</button></p>}
      <div className={styles.libraryTools}><label className={styles.search}><MagnifyingGlass size={20}/><input aria-label="搜索笔记和原文" placeholder="搜索笔记、原文或文章" value={query} onChange={event => {setQuery(event.target.value);setEditing(null);}}/></label><button disabled={!ready} onClick={() => {const note=add(null);if(note)open(note.id);}}><Plus size={18}/>新建</button><button disabled={!ready} onClick={exportBackup}><DownloadSimple size={18}/>导出备份</button><button disabled={!ready || importing} onClick={() => input.current?.click()}><UploadSimple size={18}/>{importing ? "导入中…" : "导入"}</button><input ref={input} hidden type="file" accept=".json,application/json" onChange={importBackup}/></div>
      {active ? <div className={styles.libraryEditor} key={active.id}><button className={styles.back} onClick={() => setEditing(null)}>返回全部笔记</button><NoteEditor note={active} autoFocus/>{active.anchor && <blockquote>{active.anchor.exact}</blockquote>}<footer>{active.source && <Link href={`${active.source.path}${active.anchor ? `#note-${encodeURIComponent(active.id)}` : ""}`} onClick={event => {dialog.current?.close();if(active.anchor && active.source?.path === location.pathname){event.preventDefault();history.pushState(null,"",`#note-${encodeURIComponent(active.id)}`);window.dispatchEvent(new HashChangeEvent("hashchange"));}}}>查看原文 · {active.source.title}<ArrowSquareOut size={16}/></Link>}<button aria-label="删除这条笔记" onClick={() => remove(active)}><Trash size={18}/></button><NoteTime value={active.updatedAt}/></footer></div> : <div className={styles.libraryList}>{filtered.length ? filtered.map(note => <div key={note.id} className={styles.libraryItem}><button onClick={() => open(note.id)}><p>{note.body || (note.anchor ? "划线摘录" : "空白随手记")}</p>{note.anchor && <blockquote>{note.anchor.exact}</blockquote>}<small>{note.source?.title ?? "随手记"} · {new Date(note.updatedAt).toLocaleDateString("zh-CN")}</small></button><button aria-label={`删除笔记：${note.body.slice(0,18) || "划线摘录"}`} onClick={() => remove(note)}><Trash size={18}/></button></div>) : <p className={styles.empty}>{query ? "没有找到匹配的笔记。" : ready ? "选中正文中的一句话，或直接记一条。" : "正在读取本地笔记…"}</p>}</div>}
      {feedback}<p className={styles.backupHint}>清除浏览器的网站数据会删除笔记。换浏览器前，请先导出备份。</p><p className={styles.backupHint} role="status">{backupStatus}</p>
    </dialog>
  </NotesContext.Provider>;
}
