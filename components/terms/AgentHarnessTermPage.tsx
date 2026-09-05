"use client";

import { ArrowRight, ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { BespokeTermPageProps } from "./BespokeTermScaffold";
import { harnessSources, harnessPrompt, harnessMarkdown } from "@/lib/harness-content";
import { copyHarnessText } from "@/lib/harness-player";
import { HarnessDemo } from "./HarnessDemo";
import styles from "./AgentHarnessTermPage.module.css";

function CopyButton({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    const result = await copyHarnessText(text, navigator.clipboard);
    setStatus(result);
    if (result === "copied") timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return <div className={styles.copyAction}>
    <button type="button" className={primary ? styles.primary : styles.copy} onClick={copy}>
      {status === "copied" ? <Check size={16} /> : <Copy size={16} />}{status === "copied" ? "已复制" : label}
    </button>
    <span role="status" className={status === "failed" ? styles.copyError : styles.srOnly}>{status === "failed" ? "复制失败，请手动选中文字复制，或重试。" : status === "copied" ? "内容已复制到剪贴板" : ""}</span>
  </div>;
}

export function AgentHarnessTermPage({ term, related }: BespokeTermPageProps) {
  return <main className={styles.page} id="main-content">
    <header>
      <div className={styles.breadcrumbRow}>
        <nav className={styles.breadcrumb} aria-label="面包屑"><Link href="/terms">术语词典</Link><span>/</span><Link href="/terms?cat=AI%C2%B7Agent">AI · Agent</Link><span>/</span><span>Agent Harness</span></nav>
        <CopyButton text={harnessMarkdown} label="复制全文 Markdown" />
      </div>
      <div className={styles.titleRow}><i className="brand-star-only" aria-hidden="true" /><div><h1>Agent Harness</h1><p className={styles.subtitle}>智能体运行框架</p></div></div>
      <p className={styles.definition}>{term.definition.split("。").filter(Boolean).map(sentence => <span key={sentence}>{sentence}。</span>)}</p>
    </header>

    <HarnessDemo />

    <section className={styles.prompt} aria-labelledby="harness-prompt-title"><div><h2 id="harness-prompt-title">可以这样向 AI 表达</h2><p>{harnessPrompt}</p></div><CopyButton primary text={harnessPrompt} label="复制这段说法" /></section>

    <section className={styles.reading} aria-label="使用场景与概念边界">
      <div><h2>什么时候需要它</h2><p>任务涉及多次工具调用、长时间执行或失败重试。需要记录过程，并按明确标准检查交付。</p></div>
      <div><h2>它的边界</h2><p>{term.boundary}</p></div>
    </section>
    <nav className={styles.related} aria-label="继续理解"><h2>继续理解</h2>{related.map(item => <Link href={`/terms/${item.slug}`} key={item.slug}>{item.zh}<ArrowRight size={15} /></Link>)}<Link className={styles.back} href="/">返回星图<ArrowUpRight size={15} /></Link></nav>
    <section className={styles.sources} aria-label="参考来源"><span>参考来源</span>{harnessSources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={13} /></a>)}</section>
  </main>;
}
