"use client";

import { ArrowRight, ArrowsClockwise, CheckCircle, Cloud, Clock, Database, Globe, Gear, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CdnConcept.module.css";

const frames = [
  { label: "请求先到边缘", stage: "EDGE", request: "GET /app.js", rows: [{ label: "edge · Tokyo", value: "等待", kind: "wait" }, { label: "origin · Virginia", value: "未访问", kind: "wait" }], result: "寻找缓存副本", note: "CDN 把请求引到离用户更近的边缘节点；节点先判断自己有没有可用副本。" },
  { label: "边缘命中", stage: "HIT", request: "GET /app.js · age=12s", rows: [{ label: "edge · Tokyo", value: "HIT", kind: "hit" }, { label: "origin · Virginia", value: "不必访问", kind: "wait" }], result: "直接返回", note: "命中且仍新鲜时，边缘可以直接返回内容，起点到用户不必每次都经过源站。" },
  { label: "未命中回源", stage: "MISS", request: "GET /hero.webp", rows: [{ label: "edge · Tokyo", value: "MISS", kind: "miss" }, { label: "origin · Virginia", value: "fetch", kind: "hit" }], result: "取回并缓存", note: "未命中会回源取内容；响应能否保存、保存多久，仍由缓存规则和响应头共同决定。" },
  { label: "新鲜度是契约", stage: "TTL", request: "Cache-Control: public, max-age=31536000", rows: [{ label: "freshness", value: "31536000s", kind: "hit" }, { label: "key", value: "/app.8f3.js", kind: "wait" }], result: "长缓存静态资产", note: "max-age、验证器和 URL 版本共同决定客户端与边缘何时可以继续使用副本。" },
  { label: "过期后再验证", stage: "REVALIDATE", request: "If-None-Match: \"abc\"", rows: [{ label: "edge", value: "stale", kind: "miss" }, { label: "origin", value: "304 Not Modified", kind: "hit" }], result: "更新时间，不重传正文", note: "验证器命中时，源站可以回答 304；这和一次完整回源下载不是同一件事。" },
  { label: "发布改变缓存键", stage: "VERSION", request: "app.9a2.js → app.8f3.js", rows: [{ label: "new URL", value: "MISS → cache", kind: "hit" }, { label: "old URL", value: "可过期", kind: "wait" }], result: "新版本自然穿透", note: "给静态资产换带哈希的 URL，发布时不必猜每个节点何时过期；需要时再按路径 purge。" },
] as const;

export function CdnHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const StatusIcon = scene.step === 1 || scene.step === 3 || scene.step === 5 ? CheckCircle : scene.step === 2 || scene.step === 4 ? ArrowsClockwise : Globe;
  const style = { "--cdn-progress": `${18 + scene.step * 15}%` } as CSSProperties;
  return <figure ref={scene.ref} className={styles.cdnHero} data-step={scene.step} aria-label="CDN 请求、命中、回源、再验证与版本化缓存">
    <div className={styles.cdnHeader}><span>让内容在更近的地方等着用户</span><strong>{current.stage} · step {scene.step + 1}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.cdnBoard}>
      <div className={styles.cdnPanel} data-active={scene.step <= 2 || scene.step === 4}>
        <div className={styles.cdnLabel}><Globe size={17} aria-hidden="true" /><span>请求与边缘</span></div>
        <h3>{current.label}</h3>
        <div className={styles.cdnRequest}><code>{current.request}</code><span>{scene.step === 1 ? "near" : scene.step === 2 ? "origin" : "edge"}</span></div>
      </div>
      <div className={styles.cdnArrow} aria-hidden="true"><ArrowRight size={21} /><span>查找 / 回源</span></div>
      <div className={styles.cdnPanel} data-active={scene.step >= 1}>
        <div className={styles.cdnLabel}><Cloud size={17} aria-hidden="true" /><span>缓存与源站</span></div>
        <h3>{current.result}</h3>
        <div className={styles.cdnCacheRows} style={style}>{current.rows.map(row => <div className={styles.cdnCacheRow} data-kind={row.kind} key={row.label}><code>{row.label}</code><strong>{row.value}</strong></div>)}</div>
      </div>
    </div>
    <div className={styles.cdnNote} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.cdnMetrics}><div><span>本步结果</span><strong>{current.stage}</strong></div><div><span>源站请求</span><strong>{scene.step === 1 || scene.step === 3 || scene.step === 5 ? "减少" : scene.step === 4 ? "验证" : "可能"}</strong></div><div><span>缓存键</span><strong>{scene.step === 5 ? "新 URL" : "当前 URL"}</strong></div></div>
    <figcaption>CDN 不是一个“更快的服务器”按钮：它把请求、缓存副本、源站和新鲜度规则放在同一条可观察链上。</figcaption>
  </figure>;
}
