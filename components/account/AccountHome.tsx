"use client";

import Link from "next/link";
import { ArrowUpRight, GearSix, NotePencil } from "@phosphor-icons/react/dist/ssr";
import { useNotes } from "@/components/notes/NotesProvider";
import { siteModules } from "@/lib/site-modules";
import { useAccount } from "./AccountProvider";
import { AccountAvatar } from "./AccountAvatar";
import styles from "./AccountHome.module.css";

export function AccountHome() {
  const { account, ready, openAccount } = useAccount();
  const notes = useNotes();
  return <main className={styles.page}>
    <h1>我的主页</h1>
    <section className={styles.profile} aria-label="个人信息">
      <AccountAvatar avatar={account?.avatar} size={64} />
      <div className={styles.identity}>
        <h2>{!ready ? "正在读取账号…" : account?.username ?? "本地访客"}</h2>
        <p>{account ? "在这里继续你的阅读与记录。" : "登录账号，可以选择将记录同步到云端。"}</p>
      </div>
      {ready && !account && <button className={styles.login} onClick={openAccount}>登录账号</button>}
    </section>
    {siteModules.notes && <button className={styles.notes} onClick={() => notes.open()} aria-label="我的笔记" aria-haspopup="dialog" aria-expanded={notes.isOpen} aria-controls="notes-library" disabled={!ready}>
      <span className={styles.noteIcon}><NotePencil size={28} /></span>
      <span className={styles.noteText}><strong>我的笔记</strong><span>划线、批注与随手记</span></span>
      <span className={styles.count}>{notes.ready ? `${notes.notes.length} 条` : notes.storageError ? "打开重试" : "正在读取…"}</span>
      <ArrowUpRight size={21} />
    </button>}
    <Link className={styles.settings} href="/settings"><GearSix size={21} /><span>设置</span><ArrowUpRight size={18} /></Link>
  </main>;
}
