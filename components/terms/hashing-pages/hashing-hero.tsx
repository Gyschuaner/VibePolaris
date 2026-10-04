"use client";

import type { CSSProperties } from "react";
import { ArrowRight, CheckCircle, Clock, Code, Database, FileCode, Key, LockKey, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./HashingConcept.module.css";

const steps = [
  { label: "看输入", title: "同一个输入先得到同一个指纹", detail: "哈希把任意长度的内容压成固定长度摘要；这张指纹可以拿来核对。" },
  { label: "改一个字", title: "一个字符让摘要换一张脸", detail: "摘要不会和原文长得像，文件只动一个字符也会留下新的结果。" },
  { label: "加随机盐", title: "相同密码不再共用一张影子", detail: "盐不是秘密，它让每个账号的保存值分开，不能拿一张表批量对照。" },
  { label: "放慢猜测", title: "密码 KDF 把每次猜测变贵", detail: "快速 SHA 适合做指纹，不适合守密码；Argon2id 会把内存和时间也算进成本。" },
  { label: "登录重算", title: "验证重算，不做解密", detail: "服务器取出盐和参数，对候选密码重新计算，再比较结果。" },
  { label: "检查文件", title: "指纹只回答文件有没有变", detail: "摘要对不上清单，就先停下安装；它没有告诉你原文是什么。" },
] as const;

const frames = [
  { input: "release.tar", inputNote: "原始输入 · 长度不限", engine: "SHA-256", engineNote: "固定 256 bit 输出", outputTitle: "文件指纹", output: "3a1c…9f", outputNote: "manifest 可保存这串摘要", lane: "完整性", progress: 28, tone: "plain" },
  { input: "release.tar!", inputNote: "只改最后一个字符", engine: "SHA-256", engineNote: "同一函数 · 新输入", outputTitle: "完全不同的指纹", output: "c72b…14", outputNote: "不是相似，而是另一串摘要", lane: "变更可见", progress: 52, tone: "changed" },
  { input: "password", inputNote: "用户 A / 用户 B", engine: "salt + KDF", engineNote: "每个账号一枚随机盐", outputTitle: "两份保存值", output: "salt A → 7e… · salt B → b1…", outputNote: "相同密码也不会共用摘要", lane: "盐分开", progress: 64, tone: "safe" },
  { input: "候选密码 × 猜测", inputNote: "离线拿到密码表", engine: "SHA / Argon2id", engineNote: "快函数 vs memory-hard", outputTitle: "猜测成本", output: "快：批量跑 · 慢：要内存", outputNote: "成本要按服务性能调，不是越慢越好", lane: "攻击成本", progress: 78, tone: "warning" },
  { input: "登录输入", inputNote: "候选密码 + 账号记录", engine: "salt + 参数 + KDF", engineNote: "按保存的版本重算", outputTitle: "比较结果", output: "match ✓ · 不解密", outputNote: "服务器只需要知道相等与否", lane: "验证", progress: 86, tone: "safe" },
  { input: "下载文件", inputNote: "对照发布清单", engine: "SHA-256", engineNote: "重新计算摘要", outputTitle: "digest ≠ manifest", output: "停止安装", outputNote: "文件已变，原文仍然不会从摘要里出现", lane: "边界", progress: 100, tone: "danger" },
] as const;

const fragments = ["a7", "04", "d9", "2c", "81", "6e", "f0", "3b"];

export function HashingHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const frame = frames[scene.step];
  const complete = scene.step === steps.length - 1;
  const danger = frame.tone === "danger";

  return <figure ref={scene.ref} className={styles.hashHero} data-step={scene.step} aria-label="哈希怎样把输入压成摘要、用盐分开密码并在验证时重算">
    <div className={styles.hashHeroHeader}><span>把一份输入压成一张可比对的指纹</span><strong>input → digest → compare</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.hashCanvas}>
      <section className={`${styles.hashPanel} ${styles.hashInput} ${scene.step <= 1 || scene.step === 4 || scene.step === 5 ? styles.hashActive : ""}`}>
        <div className={styles.hashEyebrow}><FileCode size={17} aria-hidden="true" /><span>输入 · message</span></div>
        <h3>{frame.input}</h3>
        <code>{frame.inputNote}</code>
        <div className={styles.hashFragments}>{fragments.map((part, index) => <i key={part} data-lit={index <= Math.min(scene.step + 2, fragments.length - 1)}>{part}</i>)}</div>
        <small>{scene.step === 1 ? "只动一个字符，输入已经是另一份消息" : scene.step >= 2 && scene.step <= 4 ? "密码只在计算入口经过，不进入保存记录" : "先保留原始输入，再计算摘要"}</small>
      </section>
      <div className={styles.hashArrow} aria-hidden="true"><ArrowRight size={22} /></div>
      <section className={`${styles.hashPanel} ${styles.hashEngine} ${scene.step >= 2 ? styles.hashActive : ""}`}>
        <div className={styles.hashEyebrow}><Code size={17} aria-hidden="true" /><span>函数 · transform</span></div>
        <div className={styles.hashEngineCore} data-warning={frame.tone === "warning"}><Key size={24} aria-hidden="true" /><strong>{frame.engine}</strong><small>{frame.engineNote}</small></div>
        <div className={styles.hashProgress}><span>计算路径</span><i style={{ "--progress": `${frame.progress}%` } as CSSProperties} /></div>
        <div className={styles.hashRecipe}><span><LockKey size={14} aria-hidden="true" />盐</span><b>{scene.step >= 2 && scene.step <= 4 ? "per-user" : "—"}</b><span><Clock size={14} aria-hidden="true" />成本</span><b>{scene.step === 3 ? "memory ↑" : scene.step >= 2 && scene.step <= 4 ? "tuned" : "fixed"}</b></div>
      </section>
      <div className={styles.hashArrow} aria-hidden="true"><ArrowRight size={22} /></div>
      <section className={`${styles.hashPanel} ${styles.hashOutput} ${styles[`hashTone${frame.tone[0].toUpperCase()}${frame.tone.slice(1)}`]}`}>
        <div className={styles.hashEyebrow}>{danger ? <WarningCircle size={17} aria-hidden="true" /> : complete ? <CheckCircle size={17} aria-hidden="true" /> : <Database size={17} aria-hidden="true" />}<span>结果 · digest</span></div>
        <strong>{frame.outputTitle}</strong>
        <code>{frame.output}</code>
        <small>{frame.outputNote}</small>
        <div className={styles.hashOutputStamp}><ShieldCheck size={14} aria-hidden="true" /><span>{frame.lane}</span></div>
      </section>
    </div>
    <div className={styles.hashMetrics}><div><span>输出长度</span><strong>{scene.step >= 2 && scene.step <= 4 ? "可调" : "256 bit"}</strong></div><div><span>盐</span><strong>{scene.step >= 2 && scene.step <= 4 ? "每个账号不同" : "无"}</strong></div><div><span>猜测成本</span><strong>{scene.step === 3 ? "memory-hard" : scene.step >= 2 && scene.step <= 4 ? "受参数限制" : "固定且快"}</strong></div><div><span>当前用途</span><strong>{frame.lane}</strong></div></div>
    <div className={`${styles.hashStatus} ${danger ? styles.hashDanger : complete ? styles.hashGood : ""}`} role="status"><span>{danger ? <WarningCircle size={19} aria-hidden="true" /> : complete ? <CheckCircle size={19} aria-hidden="true" /> : <LockKey size={19} aria-hidden="true" />}</span><strong>{current.title}</strong><span>· {current.detail}</span></div>
    <figcaption>摘要是可重复计算的指纹；密码存储还要把盐和成本一起写进验证方案。</figcaption>
  </figure>;
}
