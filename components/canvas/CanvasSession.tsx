"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cloud, Plus, X } from "@phosphor-icons/react";
import { ownerHeaders, useAccount } from "@/components/account/AccountProvider";
import { emptyCanvas } from "@/lib/canvas";
import { cloudPollInterval, cloudRequest } from "@/lib/canvas-cloud";
import { guestCanvasSource, readCanvas, readCloudCache, writeCloudCache } from "@/lib/canvas-storage";
import type { CanvasSummary, CloudCanvas } from "@/lib/account/canvas-store";
import styles from "./CanvasSession.module.css";

export type CanvasSession = ReturnType<typeof useCanvasSession>;
export function useCanvasSession() {
  const { account, openAccount, autoSync, setAutoSync: setSync } = useAccount();
  const router = useRouter(), search = useSearchParams();
  const preference = `vp-canvas-account:${account?.id}`;
  const requested = search.get("canvas"), fromUrl = account && requested && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requested) ? requested : null;
  const [selected, setSelected] = useState(() => { if (fromUrl) return fromUrl; try { return account ? localStorage.getItem(`${preference}:selected`) || "local" : "local"; } catch { return "local"; } });
  const previousUrl = useRef(fromUrl);
  useEffect(() => {
    if (previousUrl.current === fromUrl) return;
    previousUrl.current = fromUrl;
    queueMicrotask(() => setSelected(fromUrl || "local"));
  }, [fromUrl]);
  const [items, setItems] = useState<CanvasSummary[]>([]), [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const alive = useRef(true);
  const owner = account?.id, storageKey = owner && selected !== "local" ? `account:${owner}:${selected}` : "main";
  async function refresh() {
    if (!owner) return;
    try {
      const response = await fetch("/api/account/canvases", { cache: "no-store", headers: ownerHeaders(owner), signal: AbortSignal.timeout(15_000) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "云端画布列表暂不可用。");
      if (alive.current) { setItems(body.items); setError(""); }
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "云端画布列表暂不可用。"); }
  }
  useEffect(() => {
    alive.current = true; queueMicrotask(() => { void refresh(); });
    if (!owner) return () => { alive.current = false; };
    const poll = setInterval(() => { if (!document.hidden) void refresh(); }, cloudPollInterval);
    const online = () => { void refresh(); };
    window.addEventListener("online", online);
    return () => { alive.current = false; clearInterval(poll); window.removeEventListener("online", online); };
  }, [owner]); // eslint-disable-line react-hooks/exhaustive-deps
  function choose(id: string, preserveNote = false) {
    setSelected(id); setError("");
    try { localStorage.setItem(`${preference}:selected`, id); } catch { /* Selection is still usable. */ }
    const query = new URLSearchParams(window.location.search);
    if (id === "local") query.delete("canvas"); else query.set("canvas", id);
    if (!preserveNote) { query.delete("note"); query.delete("edit"); }
    router.replace(`/canvas${query.size ? `?${query}` : ""}`, { scroll: false });
  }
  async function accept(value: CloudCanvas, enable = autoSync, prepared = false) {
    if (!owner || !alive.current) return;
    if (!prepared) {
      const key = `account:${owner}:${value.id}`, cache = await readCloudCache(key);
      if (!cache.data) await writeCloudCache(key, value.data, value.data, 0);
    }
    if (!alive.current) return;
    setItems(previous => [{ id: value.id, name: value.name, updatedAt: value.updatedAt }, ...previous.filter(item => item.id !== value.id)]);
    setSync(enable); choose(value.id, prepared);
  }
  return { account, owner, storageKey, selected, autoSync, items, error, notice, setNotice, openAccount, choose, setSync, accept, refresh };
}

export function CanvasSyncBar({ session, ready, status, flush, sync, cloudStatus }: {
  session: CanvasSession; ready: boolean; status: string; flush: () => Promise<void>;
  sync: () => Promise<void>; cloudStatus: string;
}) {
  const [dialogMode, setDialogMode] = useState<"import" | "new" | null>(null), [name, setName] = useState("");
  const [enable, setEnable] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), newSource = useRef("");
  const remote = !!session.owner && session.selected !== "local";
  useEffect(() => { if (dialogMode) dialog.current?.showModal(); else dialog.current?.close(); }, [dialogMode]);
  function open(mode: "import" | "new") {
    setError(""); setEnable(true); setName(mode === "import" && session.items.length ? "来自此浏览器的画布" : "我的画布"); newSource.current = crypto.randomUUID(); setDialogMode(mode);
  }
  async function choose(id: string) {
    try { await flush(); session.choose(id); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "请先保存当前草稿。"); }
  }
  return <>
    <div className={styles.bar} aria-label="画布保存与同步">
      {session.account ? <>
        <select aria-label="选择画布" value={session.selected} disabled={busy} onChange={event => void choose(event.target.value)}>
          <option value="local">此浏览器的画布</option>
          {remote && !session.items.some(item => item.id === session.selected) && <option value={session.selected}>账号画布</option>}
          {session.items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <button className={styles.new} aria-label="新建账号画布" title="新建账号画布" onClick={() => open("new")}><Plus size={17} /></button>
        {remote ? <>
          <span role="status">{status === "saving" ? "保存中…" : cloudStatus}</span>
          <button disabled={!ready || status === "saving" || cloudStatus === "同步中…"} onClick={() => void sync()}>立即同步</button>
        </> : <><span role="status">{status === "saving" ? "保存中…" : "仅保存在此浏览器"}</span><button disabled={!ready} onClick={() => open("import")}><Cloud size={16} />开启云端同步</button></>}
      </> : <><span>{status === "saving" ? "保存中…" : "仅保存在此浏览器"}</span><button onClick={session.openAccount}>登录并选择云端同步</button></>}
    </div>
    {(error || session.error) && <p className={styles.error} role="alert">{error || session.error}<button onClick={() => void session.refresh()}>重试</button></p>}
    {session.notice && <p className={styles.error} role="status">{session.notice}<button onClick={() => session.setNotice("")}>知道了</button></p>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="canvas-cloud-title" onCancel={() => setDialogMode(null)} onClose={() => setDialogMode(null)}>
      <header><h2 id="canvas-cloud-title">{dialogMode === "import" ? "保存到账号" : "新建账号画布"}</h2><button aria-label="关闭保存窗口" onClick={() => setDialogMode(null)}><X size={21} /></button></header>
      <p>{dialogMode === "import" ? "将当前画布完整保存到你的账号，保留节点、正文、位置和连线。本地原件保留。" : "创建一张仅你可见的画布。"}</p>
      <form onSubmit={async event => {
        event.preventDefault(); if (busy || !session.owner) return;
        setBusy(true); setError("");
        try {
          await flush();
          const snapshot = dialogMode === "import" ? await readCanvas() : emptyCanvas();
          const source = dialogMode === "import" ? `${await guestCanvasSource()}:${snapshot.revision}` : newSource.current;
          const value = await cloudRequest(session.owner, { method: "POST", body: { source, name, data: snapshot } });
          await session.accept(value!, enable); setDialogMode(null);
        } catch (cause) { setError(cause instanceof Error ? cause.message : "保存失败，本地原件仍在。"); }
        finally { setBusy(false); }
      }}>
        <label htmlFor="cloud-canvas-name">画布名称</label><input id="cloud-canvas-name" value={name} onChange={event => setName(event.target.value)} maxLength={80} required />
        <label className={styles.toggle}><input type="checkbox" checked={enable} onChange={event => setEnable(event.target.checked)} />开启自动同步到云端</label>
        <p className={styles.fine}>关闭自动同步后仍可本地编辑，也可手动同步；云端已有内容保留。</p>
        <button className={styles.primary} disabled={busy || !name.trim()}>{busy ? "正在保存…" : "保存到账号"}</button>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </form>
    </dialog>
  </>;
}
