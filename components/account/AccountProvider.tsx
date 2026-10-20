"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { UserCircle, X } from "@phosphor-icons/react";
import type { Account } from "@/lib/account/store";
import styles from "./Account.module.css";

type Session = { account: Account | null; xiaobei?: { bound: boolean; active: boolean; canBindCurrent: boolean } };
type AccountContext = Session & { ready: boolean; openAccount: () => void; refresh: () => Promise<void> };
const Context = createContext<AccountContext | null>(null);
export const useAccount = () => useContext(Context)!;
export const ownerHeaders = (id?: string) => ({ "X-VP-Account": id ?? "guest" });
async function settleDrafts() {
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
      setPassword(""); await changed(); setMessage("已登录。你可以在画布里选择是否开启云端同步。");
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
  return <Context.Provider value={{ ...session, ready, refresh, openAccount: () => { setError(""); setMessage(""); setOpen(true); } }}>
    {children}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="account-title" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); setPassword(""); setCode(""); }} onClick={event => { if (event.target === event.currentTarget && !busy) setOpen(false); }}>
      <div className={styles.panel}>
        <header><h2 id="account-title">{session.account ? "我的账号" : register ? "创建账号" : "登录"}</h2><button type="button" className={styles.icon} aria-label="关闭账号窗口" onClick={() => setOpen(false)}><X size={22} /></button></header>
        {session.account ? <>
          <p className={styles.username}>{session.account.username}</p>
          <p className={styles.muted}>画布可选择自动同步到云端，游客内容由你决定是否保存到账号。</p>
          <section className={styles.binding}><h3>小北</h3>{session.xiaobei?.active ? <><p>已绑定账号，全站可用。积分在此账号的设备之间共用。</p>{session.xiaobei.canBindCurrent && <button className={styles.primary} disabled={busy} onClick={() => void bind(true)}>保存此浏览器的旧对话到账号</button>}</> : session.xiaobei?.bound ? <p>绑定的邀请码已失效，请联系邀请人。</p> : <>
            <p>一个邀请码绑定一个账号，之后以账号登录小北。当前浏览器已有的对话一并转入，其他浏览器的历史保持隔离。</p>
            {session.xiaobei?.canBindCurrent && <button type="button" className={styles.primary} disabled={busy} onClick={() => void bind(true)}>绑定当前浏览器的小北</button>}
            <form onSubmit={event => { event.preventDefault(); void bind(); }}><label htmlFor="account-invite">邀请码</label><input id="account-invite" type="password" autoComplete="off" value={code} onChange={event => setCode(event.target.value)} maxLength={100} required /><button className={styles.primary} disabled={busy || !code.trim()}>绑定小北</button></form>
          </>}</section>
          <button type="button" className={styles.logout} disabled={busy} onClick={async () => {
            setBusy(true); setError("");
            try {
              await settleDrafts();
              const response = await fetch("/api/account/session", { method: "DELETE" });
              if (!response.ok) throw new Error("退出失败，请重试。");
              await changed(); setOpen(false);
            } catch (cause) { setError(cause instanceof Error ? cause.message : "退出失败。"); }
            finally { setBusy(false); }
          }}>退出登录</button><p className={styles.fine}>未同步修改保留在此浏览器的账号缓存中，下次登录可继续。</p>
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
  return <button className={styles.entry} type="button" title={account?.username || "登录账号"} aria-label={account ? `账号：${account.username}` : "登录账号"} onClick={openAccount}><UserCircle size={25} /><span>{account?.username || "登录"}</span></button>;
}
