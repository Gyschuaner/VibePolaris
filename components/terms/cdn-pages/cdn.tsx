"use client";

import { ArrowsClockwise, CheckCircle, Cloud, Globe, Gear, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CdnConcept.module.css";

const labels = ["请求到边缘", "命中副本", "未命中回源", "过期再验证", "发布新版本"];

export function CdnLesson() {
  const scene = useScene(labels.length);
  const isRequest = scene.step === 0;
  const isHit = scene.step === 1;
  const isMiss = scene.step === 2;
  const isRevalidate = scene.step === 3;
  const isVersion = scene.step === 4;
  const StatusIcon = isMiss || isRevalidate ? WarningCircle : isHit || isVersion ? CheckCircle : Gear;
  const status = isRequest ? "先到边缘节点查找；请求还没有证明一定会命中。" : isHit ? "副本仍新鲜，边缘直接返回；源站少承担一次响应。" : isMiss ? "这次要回源；回源成功后是否缓存，还要看规则和响应头。" : isRevalidate ? "过期副本带验证器回源；304 可以省下正文传输，但仍产生一次验证请求。" : "版本化 URL 让新资源使用新缓存键，旧资源按策略自然过期或被选择性清理。";
  return <div ref={scene.ref} className={styles.cdnLab} role="region" aria-label="CDN 命中、回源、再验证和发布工作台">
    <div className={styles.cdnLabHeader}><span>把同一个资源请求走五遍</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.cdnControls} role="group" aria-label="选择 CDN 请求阶段">
      <button type="button" className={styles.cdnControl} aria-pressed={isRequest} onClick={() => scene.seek(0)}>到边缘</button>
      <button type="button" className={styles.cdnControl} aria-pressed={isHit} onClick={() => scene.seek(1)}>命中</button>
      <button type="button" className={styles.cdnControl} aria-pressed={isMiss} onClick={() => scene.seek(2)}>回源</button>
      <button type="button" className={styles.cdnControl} aria-pressed={isVersion} onClick={() => scene.seek(4)}>新版本</button>
    </div>
    <div className={styles.cdnLabGrid}>
      <div className={styles.cdnLabPanel} data-active={isRequest || isMiss || isRevalidate}>
        <div className={styles.cdnLabel}><Globe size={16} aria-hidden="true" /><span>请求路径</span></div>
        <h3>{isVersion ? "app.9a2.js" : isRevalidate ? "旧副本 + ETag" : "/app.js"}</h3>
        <div className={styles.cdnLabRows}><div className={styles.cdnLabRow} data-active={isRequest}><code>edge lookup</code><strong>{isRequest ? "开始" : "已完成"}</strong></div><div className={styles.cdnLabRow} data-active={isMiss || isRevalidate}><code>origin</code><strong>{isMiss ? "fetch" : isRevalidate ? "304" : "—"}</strong></div><div className={styles.cdnLabRow} data-active={isVersion}><code>cache key</code><strong>{isVersion ? "new URL" : "same URL"}</strong></div></div>
        <small>请求是否回源，不由“用了 CDN”四个字决定；要看缓存键、新鲜度和验证器。</small>
      </div>
      <div className={styles.cdnLabArrow} aria-hidden="true"><ArrowsClockwise size={22} /></div>
      <div className={styles.cdnLabPanel} data-active={isHit || isMiss || isVersion}>
        <div className={styles.cdnLabel}><Cloud size={16} aria-hidden="true" /><span>内容结果</span></div>
        <h3>{isHit ? "HIT · fresh" : isMiss ? "MISS → stored" : isVersion ? "new asset" : "等待"}</h3>
        <div className={styles.cdnLabRows}><div className={styles.cdnLabRow} data-active={isHit}><code>body</code><strong>{isHit ? "edge copy" : isRevalidate ? "not resent" : "—"}</strong></div><div className={styles.cdnLabRow} data-active={isMiss}><code>cache write</code><strong>{isMiss ? "after response" : "—"}</strong></div><div className={styles.cdnLabRow} data-active={isVersion}><code>release</code><strong>{isVersion ? "key changed" : "same key"}</strong></div></div>
        <small>缓存结果和源站结果要分开看；命中、回源、304、purge 和版本化 URL 是不同动作。</small>
      </div>
    </div>
    <div className={styles.cdnLabMetrics}><div><span>边缘</span><strong>{isHit ? "命中" : isMiss || isRevalidate ? "回源" : "查询"}</strong></div><div><span>正文</span><strong>{isRevalidate ? "不重传" : isHit ? "副本" : isMiss ? "取回" : "待定"}</strong></div><div><span>发布</span><strong>{isVersion ? "新键" : "原键"}</strong></div></div>
    <p className={styles.cdnLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
