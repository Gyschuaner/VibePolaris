"use client";

import { Browser, CheckCircle, Cloud, FileText, Gear, Stamp } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["改了源稿", "仍拿旧件", "盖上构建章", "放上新件", "访客取 v2"];
const captions = [
  "源稿先改成 v2；上一轮构建出来的静态文件还没有变化。",
  "访问 CDN 只会拿货架上的 v1，刷新不会自动读取源稿。",
  "构建任务读取 v2，并给新的 HTML 产物盖上版本章。",
  "发布把 v2 放上 CDN 货架；访问路径仍然是拿现成文件。",
  "下一位访客取到 v2。页面仍可加载客户端脚本，静态生成只改变 HTML 何时产出。",
];

export function SsgHero() {
  const scene = useScene(labels.length);
  const [built, setBuilt] = useState(false);
  const step = scene.step;
  const version = built || step >= 3 ? "v2" : "v1";
  const stamped = built || step >= 2;
  return <MechanismFrame scene={scene} title="静态页面怎样等一枚构建印章" labels={labels} caption={captions[step]} onReplay={() => setBuilt(false)}>
    <div className={styles.ssgScene}>
      <div className={styles.ssgSource}><div className={styles.ssgLabel}><FileText size={15} />SOURCE</div><div className={styles.ssgSourceCard}><strong>docs/pricing.md · {step >= 1 ? "v2" : "v1"}</strong><span /><span /><small>{step >= 1 ? "改动尚未成为页面" : "当前源稿"}</small></div></div>
      <div className={styles.ssgBuild}><div className={styles.ssgLabel}><Gear size={15} />BUILD</div><div className={styles.ssgStamp}><Stamp size={20} /><strong>{stamped ? "build-84" : "等待构建"}</strong><small>{stamped ? "读源稿 · 产出 HTML" : "访问不会触发"}</small></div></div>
      <div className={styles.ssgShelf}><div className={styles.ssgLabel}><Cloud size={15} />CDN SHELF</div><div className={styles.ssgShelfCard} data-version={version}><strong>pricing.html · {version}</strong><span /><span /><small>{version === "v2" ? "下一次请求可取" : "货架仍是旧件"}</small></div></div>
      <div className={styles.ssgVisitor} role="status"><Browser size={16} /><strong>访客拿到 {version}</strong><span>{version === "v1" ? "刷新仍是旧 HTML" : "直接返回静态产物"}</span><button type="button" onClick={() => { setBuilt(value => !value); scene.seek(3); }}>{built ? "保留 v2" : "重新构建"}</button>{version === "v2" && <CheckCircle size={16} />}</div>
    </div>
  </MechanismFrame>;
}
