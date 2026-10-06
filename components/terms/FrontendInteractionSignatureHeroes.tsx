"use client";

import { ArrowRight, CheckCircle, Code, Eye, GitBranch } from "@phosphor-icons/react";
import { useScene, SceneControls } from "./HarnessStoryScenes";
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
