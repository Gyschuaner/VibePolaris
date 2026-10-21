"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Camera, Cloud, SignOut } from "@phosphor-icons/react";
import { useAccount } from "./AccountProvider";
import { AccountAvatar } from "./AccountAvatar";
import styles from "./AccountSettings.module.css";

export function AccountSettings() {
  const { account, ready, openAccount } = useAccount();
  return <main className={styles.page}>
    <Link className={styles.back} href="/canvas"><ArrowLeft size={17} />返回画布</Link>
    <h1>设置</h1>
    {!ready ? <p className={styles.muted} role="status">正在读取账号…</p> : account ? <SettingsForm key={account.id} /> : <div className={styles.guest}><p>登录后，管理你的头像和云端同步。</p><button className={styles.primary} onClick={openAccount}>登录账号</button></div>}
    {ready && !account && <AiSettings />}
  </main>;
}

function SettingsForm() {
  const { account, autoSync, setAutoSync, saveAvatar, logout } = useAccount();
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  const file = useRef<HTMLInputElement>(null), router = useRouter();
  async function updateAvatar(selected: File | null) {
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      let avatar: string | null = null;
      if (selected) {
        if (!/^image\/(png|jpeg|webp|gif|avif)$/.test(selected.type) || selected.size > 5 * 1024 * 1024) throw new Error("请选择 5 MB 以内的 PNG、JPG、WebP、GIF 或 AVIF 图片。");
        const image = await createImageBitmap(selected);
        try {
          const canvas = document.createElement("canvas"); canvas.width = 128; canvas.height = 128;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("无法读取图片，请换一张试试。");
          const side = Math.min(image.width, image.height);
          context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 128, 128);
          avatar = canvas.toDataURL("image/png");
        } finally { image.close(); }
      }
      await saveAvatar(avatar); setMessage(selected ? "头像已更新" : "已恢复默认头像");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "头像保存失败，请重试。"); }
    finally { setBusy(false); if (file.current) file.current.value = ""; }
  }
  return <>
    <section className={styles.profile} aria-label="头像与账号">
      <button className={styles.photo} aria-label="更换头像" disabled={busy} onClick={() => file.current?.click()}><AccountAvatar avatar={account?.avatar} size={72} /><span><Camera size={17} /></span></button>
      <div className={styles.identity}><h2>{account?.username}</h2><div className={styles.photoActions}><button disabled={busy} onClick={() => file.current?.click()}>{busy ? "请稍等…" : "更换头像"}</button>{account?.avatar && <button disabled={busy} onClick={() => void updateAvatar(null)}>恢复默认</button>}</div></div>
      <input ref={file} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" aria-label="选择头像图片" hidden onChange={event => { const selected = event.target.files?.[0]; if (selected) void updateAvatar(selected); }} />
    </section>
    <section className={styles.section} aria-labelledby="sync-heading">
      <div className={styles.sectionTitle}><Cloud size={20} /><h2 id="sync-heading">云端同步</h2></div>
      <div className={styles.row}><div><h3 id="auto-sync-label">自动同步到云端</h3><p id="auto-sync-description">在此浏览器自动同步账号画布。关闭后，修改仍保存在本地。</p></div><button className={styles.toggle} type="button" role="switch" aria-checked={autoSync} aria-labelledby="auto-sync-label" aria-describedby="auto-sync-description" onClick={() => { setError(""); try { setAutoSync(!autoSync); setMessage(!autoSync ? "自动同步已开启" : "自动同步已关闭"); } catch (cause) { setError(cause instanceof Error ? cause.message : "设置保存失败。"); } }}><span /></button></div>
      <Link className={styles.canvasLink} href="/canvas">前往画布 <ArrowUpRight size={15} /></Link>
      <p className={styles.fine}>此浏览器的游客画布，由你在画布中选择是否保存到账号。</p>
    </section>
    <AiSettings />
    <section className={styles.section} aria-label="退出账号">
      <button className={styles.logout} disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await logout(); router.replace("/canvas"); } catch (cause) { setError(cause instanceof Error ? cause.message : "退出失败，请重试。"); setBusy(false); } }}><SignOut size={20} />退出登录<ArrowUpRight size={17} /></button>
      <p className={styles.fine}>未同步的修改会保留，下次在此浏览器登录后可继续。</p>
    </section>
    <div className={styles.feedback} aria-live="polite">{error ? <p role="alert">{error}</p> : message && <p role="status">{message}</p>}</div>
  </>;
}

function AiSettings() {
  const { account, aiReady, aiPreferences, setAiFeature, refresh, xiaobei, openAccount } = useAccount();
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const options = [
    ["completion", "智能补全", "编辑时停顿显示快捷键提示，主动触发一小段续写。"],
    ["organize", "整理成文", "将草稿整理为学习文章，原稿独立保留。"],
    ["expand", "扩展节点", "从草稿或文章延伸相关节点，由你接受或舍弃。"],
  ] as const;
  return <section className={styles.section} aria-labelledby="ai-heading">
    <div className={styles.sectionTitle}><h2 id="ai-heading">小北</h2></div>
    <p className={styles.fine}>{account ? "开关随账号同步。" : "开关保存在此浏览器。"}整理和扩展不扣积分；点击使用时，会将所选正文发送给小北。</p>
    {!aiReady ? <button onClick={() => void refresh()}>重新读取设置</button> : options.map(([feature, title, description]) => <div className={styles.row} key={feature}>
      <div><h3 id={`ai-${feature}`}>{title}</h3><p>{description}</p></div>
      <button className={styles.toggle} role="switch" aria-checked={aiPreferences[feature]} aria-labelledby={`ai-${feature}`} disabled={busy} onClick={async () => {
        setBusy(true); setError(""); try { await setAiFeature(feature, !aiPreferences[feature]); } catch (cause) { setError(cause instanceof Error ? cause.message : "设置保存失败。"); } finally { setBusy(false); }
      }}><span /></button>
    </div>)}
    {account && !xiaobei?.active && <button className={styles.canvasLink} onClick={openAccount}>绑定小北邀请码</button>}
    {!account && <Link className={styles.canvasLink} href="/xiaobei/activate">激活小北 <ArrowUpRight size={15} /></Link>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
