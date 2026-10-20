"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GearSix, X } from "@phosphor-icons/react";
import type { Account } from "@/lib/account/store";
import { AccountAvatar, WavingPerson } from "./AccountAvatar";
import styles from "./Account.module.css";

type Session = { account: Account | null; xiaobei?: { bound: boolean; active: boolean; canBindCurrent: boolean } };
type AccountContext = Session & { ready: boolean; autoSync: boolean; setAutoSync: (enabled: boolean) => void; logout: () => Promise<void>; saveAvatar: (avatar: string | null) => Promise<void>; openAccount: () => void; refresh: () => Promise<void> };
const Context = createContext<AccountContext | null>(null);
export const useAccount = () => useContext(Context)!;
export const ownerHeaders = (id?: string) => ({ "X-VP-Account": id ?? "guest" });
export async function settleDrafts() {
  const waits: Promise<unknown>[] = [];
  window.dispatchEvent(new CustomEvent("vp-account-before-change", { detail: waits }));
  await Promise.all(waits);
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ account: null }), [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false), [register, setRegister] = useState(false), [busy, setBusy] = useState(false);
  const [error, setError] = useState(""), [message, setMessage] = useState("");
  const [username, setUsername] = useState(""), [password, setPassword] = useState(""), [code, setCode] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), channel = useRef<BroadcastChannel | null>(null), sequence = useRef(0);
  const [syncPreference, setSyncPreference] = useState<{ owner: string; enabled: boolean } | null>(null);
  const owner = session.account?.id;
  useEffect(() => {
    if (!owner) return;
    const key = `vp-canvas-account:${owner}:sync`;
    const read = () => { try { setSyncPreference({ owner, enabled: localStorage.getItem(key) === "1" }); } catch { setSyncPreference({ owner, enabled: false }); } };
    queueMicrotask(read);
    const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) read(); };
    window.addEventListener("storage", storage);
    return () => window.removeEventListener("storage", storage);
  }, [owner]);
  function setAutoSync(enabled: boolean) {
    if (!owner) return;
    try { localStorage.setItem(`vp-canvas-account:${owner}:sync`, enabled ? "1" : "0"); }
    catch { throw new Error("无法保存同步设置，请检查浏览器存储权限。"); }
    setSyncPreference({ owner, enabled });
  }
  const refresh = useCallback(async () => {
    const at = ++sequence.current;
    try {
      const response = await fetch("/api/account/session", { cache: "no-store", signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error("Session unavailable");
      const next = await response.json() as Session;
      if (at === sequence.current) { setSession(next); setReady(true); }
    } catch { if (at === sequence.current) setReady(true); }
  }, []);
  useEffect(() => {
    queueMicrotask(() => { void refresh(); });
    const update = () => { void refresh(); };
    try { channel.current = new BroadcastChannel("vp-account"); channel.current.onmessage = update; } catch { /* Focus still refreshes sessions. */ }
    window.addEventListener("focus", update); window.addEventListener("xiaobei-activated", update);
    return () => { channel.current?.close(); window.removeEventListener("focus", update); window.removeEventListener("xiaobei-activated", update); };
  }, [refresh]);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  async function changed() {
    await refresh(); channel.current?.postMessage("changed");
    window.dispatchEvent(new Event("vp-account-changed")); window.dispatchEvent(new Event("xiaobei-activated"));
  }
  async function authenticate(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try {
      await settleDrafts();
      const response = await fetch("/api/account/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, register }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "登录失败，请重试。");
      setPassword(""); await changed(); setOpen(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "连接失败，请重试。"); }
    finally { setBusy(false); }
  }
  async function bind(useCurrent = false) {
    if (!session.account || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/account/xiaobei", { method: "POST", headers: { ...ownerHeaders(session.account.id), "Content-Type": "application/json" }, body: JSON.stringify(useCurrent ? { useCurrent: true } : { code }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "绑定失败。");
      setCode(""); await changed(); setMessage("小北已绑定。该账号在不同浏览器和功能入口都可以使用。");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "绑定失败，请重试。"); }
    finally { setBusy(false); }
  }
  async function logout() {
    await settleDrafts();
    const response = await fetch("/api/account/session", { method: "DELETE" });
    if (!response.ok) throw new Error("退出失败，请重试。");
    await changed(); setOpen(false);
  }
  async function saveAvatar(avatar: string | null) {
    if (!owner) throw new Error("请先登录。");
    const response = await fetch("/api/account/profile", { method: "PATCH", headers: { ...ownerHeaders(owner), "Content-Type": "application/json" }, body: JSON.stringify({ avatar }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "头像保存失败，请重试。");
    setSession(current => current.account?.id === owner ? { ...current, account: body.account } : current);
    channel.current?.postMessage("changed");
  }
  return <Context.Provider value={{ ...session, ready, refresh, autoSync: !!owner && syncPreference?.owner === owner && syncPreference.enabled, setAutoSync, logout, saveAvatar, openAccount: () => { setError(""); setMessage(""); setOpen(true); } }}>
    {children}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="account-title" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); setPassword(""); setCode(""); }} onClick={event => { if (event.target === event.currentTarget && !busy) setOpen(false); }}>
      <div className={styles.panel}>
        <header><h2 id="account-title">{session.account ? "小北" : register ? "创建账号" : "欢迎回来"}</h2><button type="button" className={styles.icon} aria-label="关闭账号窗口" onClick={() => setOpen(false)}><X size={22} /></button></header>
        {session.account ? <>
          <p className={styles.username}>{session.account.username}</p>
          <section className={styles.binding}>{session.xiaobei?.active ? <><p>已绑定账号，全站可用。积分在此账号的设备之间共用。</p>{session.xiaobei.canBindCurrent && <button className={styles.primary} disabled={busy} onClick={() => void bind(true)}>保存此浏览器的旧对话到账号</button>}</> : session.xiaobei?.bound ? <p>绑定的邀请码已失效，请联系邀请人。</p> : <>
            <p>一个邀请码绑定一个账号，之后以账号登录小北。当前浏览器已有的对话一并转入，其他浏览器的历史保持隔离。</p>
            {session.xiaobei?.canBindCurrent && <button type="button" className={styles.primary} disabled={busy} onClick={() => void bind(true)}>绑定当前浏览器的小北</button>}
            <form onSubmit={event => { event.preventDefault(); void bind(); }}><label htmlFor="account-invite">邀请码</label><input id="account-invite" type="password" autoComplete="off" value={code} onChange={event => setCode(event.target.value)} maxLength={100} required /><button className={styles.primary} disabled={busy || !code.trim()}>绑定小北</button></form>
          </>}</section>
        </> : <>
          <p className={styles.muted}>不登录也能使用画布，内容保存在当前浏览器。登录后可开启多端同步。</p>
          <form onSubmit={authenticate}>
            <label htmlFor="account-username">用户名</label><input id="account-username" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} minLength={3} maxLength={32} required disabled={busy} />
            <label htmlFor="account-password">密码</label><input id="account-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={register ? "new-password" : "current-password"} minLength={15} maxLength={128} required disabled={busy} />
            {register && <p className={styles.fine}>密码至少15位。请用密码管理器保存，当前不支持邮箱找回。</p>}
            <button className={styles.primary} disabled={busy}>{busy ? "请稍等…" : register ? "创建并登录" : "登录"}</button>
          </form>
          <button className={styles.switch} disabled={busy} onClick={() => { setRegister(!register); setPassword(""); setError(""); }}>{register ? "已有账号，去登录" : "还没有账号，创建一个"}</button>
        </>}
        {error && <p className={styles.error} role="alert">{error}</p>}{message && <p className={styles.message} role="status">{message}</p>}
      </div>
    </dialog>
  </Context.Provider>;
}
export function AccountButton() {
  const { account, openAccount } = useAccount();
  const [expanded, setExpanded] = useState(false), [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null), router = useRouter();
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setExpanded(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  if (!account) return <button className={styles.entry} type="button" title="登录" aria-label="登录账号" onClick={openAccount}><WavingPerson /></button>;
  return <div ref={root} className={styles.accountMenu} onPointerEnter={event => { if (event.pointerType === "mouse") setExpanded(true); }} onPointerLeave={() => { if (!root.current?.contains(document.activeElement)) setExpanded(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }} onKeyDown={event => { if (event.key === "Escape") { root.current?.querySelector("button")?.focus(); setExpanded(false); } }}>
    <button className={styles.entry} type="button" aria-label={`账号：${account.username}`} aria-expanded={expanded} aria-controls="account-dropdown" onClick={() => setExpanded(true)} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setExpanded(true); }}><AccountAvatar avatar={account.avatar} /></button>
    {expanded && <div className={styles.dropdown} id="account-dropdown"><Link href="/settings" onClick={async event => { event.preventDefault(); try { await settleDrafts(); setExpanded(false); setError(""); router.push("/settings"); } catch (cause) { setError(cause instanceof Error ? cause.message : "请先保存草稿。"); } }}><GearSix size={18} />设置</Link>{error && <p role="alert">{error}</p>}</div>}
  </div>;
}
