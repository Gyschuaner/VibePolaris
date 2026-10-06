"use client";

import { ArrowRight, Browser, CheckCircle, Code, DeviceMobile, Eye, FileCode, Gear, GitBranch, Key } from "@phosphor-icons/react";
import { useScene, SceneControls } from "./HarnessStoryScenes";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./FrontendInteractionSignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;

function HeroShell({ scene, title, labels, children, caption, onReplay, className = "" }: { scene: Scene; title: string; labels: string[]; children: ReactNode; caption?: ReactNode; onReplay?: () => void; className?: string }) {
  return <div className={`${styles.hero} ${className}`} ref={scene.ref} role="region" aria-label={title}>
    <SceneControls scene={scene} labels={labels} compact onReplay={onReplay} />
    <div className={styles.canvas}>{children}</div>
    <div className={styles.caption} aria-live="polite" key={`${title}-${scene.step}`}><span>{String(scene.step + 1).padStart(2, "0")}</span><div>{caption ?? <strong>{labels[scene.step]}</strong>}</div></div>
  </div>;
}

const semanticLabels = ["普通容器", "区域被识别", "原生按钮"];
export function SemanticHtmlSignatureHero() {
  const scene = useScene(semanticLabels.length);
  const markup = scene.step === 0 ? "<div>" : scene.step === 1 ? "<nav> <main>" : "<button>";
  const tree = scene.step === 0 ? "generic × 6" : scene.step === 1 ? "navigation · main" : "button · Enter/Space";
  return <HeroShell scene={scene} title="语义化 HTML 如何改变机器读到的结构" labels={semanticLabels}>
    <div className={styles.semanticBoard} data-step={scene.step}>
      <div className={styles.semanticSource}><span>源代码</span><Code size={22} /><code>{markup}</code><small>{scene.step === 2 ? "操作职责被声明" : "只是视觉容器"}</small></div>
      <ArrowRight className={styles.semanticArrow} size={22} aria-hidden="true" />
      <div className={styles.semanticTree}>
        <div className={styles.treeHeader}><GitBranch size={18} aria-hidden="true" /><span>浏览器解析</span></div>
        <div className={styles.treeRoot}>DOM</div>
        <div className={styles.treeBranches}><i /><i /><i /></div>
        <div className={`${styles.semanticAssistive} ${scene.step === 0 ? styles.isMuted : ""}`}><Eye size={19} /><div><span>无障碍树</span><strong>{tree}</strong></div>{scene.step === 2 ? <CheckCircle size={18} /> : null}</div>
      </div>
    </div>
  </HeroShell>;
}

const deepLinkLabels = ["系统先匹配", "已登录直达", "登录后续走", "网页回退"];
type DeepLinkBranch = "direct" | "login" | "fallback";
export function DeepLinkSignatureHero() {
  const scene = useScene(deepLinkLabels.length);
  const [branch, setBranch] = useState<DeepLinkBranch>("direct");
  const labels: Record<DeepLinkBranch, string> = { direct: "已登录", login: "未登录", fallback: "未安装" };
  const reset = () => setBranch("direct");
  return <HeroShell scene={scene} title="一条链接如何决定应用入口" labels={deepLinkLabels} onReplay={reset} className={styles.routeHero}>
    <div className={styles.branchTabs} role="group" aria-label="选择链接环境">{(Object.keys(labels) as DeepLinkBranch[]).map((key) => <button key={key} type="button" aria-pressed={branch === key} onClick={() => { setBranch(key); scene.seek(0); }}>{labels[key]}</button>)}</div>
    <div className={styles.deepLinkBoard} data-step={scene.step} data-branch={branch}>
      <div className={styles.linkTicket}><Browser size={23} /><span>活动链接</span><code>/orders/42</code></div>
      <div className={styles.routeGate}><Gear size={24} /><strong>系统匹配</strong><small>域名 · 路径 · 会话</small><span className={styles.routePulse} /></div>
      <div className={styles.routeTargets}>
        <div data-active={branch === "direct" && scene.step > 0}><CheckCircle size={19} /><span>订单 42</span><small>应用内目标</small></div>
        <div data-active={branch === "login" && scene.step > 1}><Key size={19} /><span>登录页</span><small>保留 returnTo</small></div>
        <div data-active={branch === "fallback" && scene.step > 2}><ArrowRight size={19} /><span>网页回退</span><small>应用未安装</small></div>
      </div>
    </div>
  </HeroShell>;
}

const manifestLabels = ["声明完整", "入口缺失", "权限缺失", "链接缺失"];
type ManifestPart = "entry" | "permission" | "link";
export function AppManifestSignatureHero() {
  const scene = useScene(manifestLabels.length);
  const [missing, setMissing] = useState<ManifestPart | null>(null);
  const names: Record<ManifestPart, string> = { entry: "入口", permission: "相机权限", link: "链接匹配" };
  const reset = () => setMissing(null);
  return <HeroShell scene={scene} title="应用清单怎样让平台读懂应用" labels={manifestLabels} onReplay={reset} className={styles.manifestHero}>
    <div className={styles.manifestToggles} role="group" aria-label="移除一项清单声明">{(Object.keys(names) as ManifestPart[]).map((key) => <button key={key} type="button" aria-pressed={missing === key} onClick={() => { setMissing(key); scene.seek(0); }}>{missing === key ? `已移除${names[key]}` : `移除${names[key]}`}</button>)}</div>
    <div className={styles.manifestBoard} data-step={scene.step} data-missing={missing ?? "none"}>
      <div className={styles.manifestFile}><FileCode size={24} /><strong>Manifest</strong><span>平台读取的声明</span><b>entry · permission · link</b></div>
      <div className={styles.manifestPorts}>
        <div data-missing={missing === "entry"}><span>入口</span><strong>主界面</strong><i>{missing === "entry" ? "未声明" : "可启动"}</i></div>
        <div data-missing={missing === "permission"}><span>能力</span><strong>相机</strong><i>{missing === "permission" ? "无法请求" : "已声明"}</i></div>
        <div data-missing={missing === "link"}><span>链接</span><strong>/orders/*</strong><i>{missing === "link" ? "不匹配" : "可处理"}</i></div>
      </div>
      <div className={styles.manifestSystem}><DeviceMobile size={25} /><span>系统结果</span><strong>{scene.step === 0 ? "按声明启动" : missing === "entry" ? "没有入口" : missing === "permission" ? "运行时需另行请求" : missing === "link" ? "回退网页" : "读取声明"}</strong></div>
    </div>
  </HeroShell>;
}
