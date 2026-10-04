"use client";

import { ArrowRight, CheckCircle, Code, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ToolchainConcepts.module.css";

type ChangeKind = "patch" | "minor" | "major";
type Change = { label: string; next: string; segment: string; index: number; detail: string; release: string; migration: string };

const changes: Record<ChangeKind, Change> = {
  patch: { label: "修一个兼容 Bug", next: "1.4.3", segment: "PATCH", index: 2, detail: "旧调用仍然照常工作，只修正内部错误。", release: "增加修订号", migration: "通常不需要迁移说明，但仍要写清修了什么。" },
  minor: { label: "加兼容功能", next: "1.5.0", segment: "MINOR", index: 1, detail: "新增能力，旧调用仍能在新版本上工作。", release: "增加次版本并把修订号归零", migration: "告诉使用方新能力在哪里，旧用法可以继续跑。" },
  major: { label: "删公开 API", next: "2.0.0", segment: "MAJOR", index: 0, detail: "旧调用不再成立，公开接口的兼容承诺被打破。", release: "增加主版本并把后两段归零", migration: "必须给出迁移提示：删了什么、替代写法是什么。" },
};

const labels = ["先看 1.4.2", "辨认公开 API", "增加对应一段", "写发布提示"];

export function SemanticVersioningLesson() {
  const [selected, setSelected] = useState<ChangeKind>("patch");
  const change = changes[selected];
  const scene = useScene(labels.length);
  const step = scene.step;
  const showNext = step >= 2;

  function selectChange(next: ChangeKind) {
    setSelected(next);
    scene.seek(0);
  }

  return <div className={styles.semverStory} ref={scene.ref} role="region" aria-label="语义化版本从公开 API 变化选择下一版本的演示">
    <div className={styles.semverChoices} role="group" aria-label="选择一次发布变更">
      {(Object.keys(changes) as ChangeKind[]).map(key => <button key={key} type="button" aria-pressed={selected === key} onClick={() => selectChange(key)}>{changes[key].label}</button>)}
    </div>
    <div className={styles.semverFrame}>
      <div className={styles.semverVersionCard}>
        <span>当前已发布</span>
        <div className={styles.semverNumber}>{["1", "4", "2"].map((value, index) => <span key={value}>{index > 0 && <i>.</i>}<b> {value}</b></span>)}</div>
        <small>公开 API 的基线</small>
      </div>
      <ArrowRight className={styles.semverArrow} size={21} aria-hidden="true" />
      <div className={`${styles.semverVersionCard} ${showNext ? styles.semverVersionCardNext : ""}`}>
        <span>这次变更</span>
        <div className={styles.semverChange}>{["MAJOR", "MINOR", "PATCH"].map((part, index) => <span key={part} className={showNext && index === change.index ? styles.semverSegmentChanged : ""}><b>{showNext ? change.next.split(".")[index] : "·"}</b><small>{part}</small></span>)}</div>
        <strong>{showNext ? change.next : "等待判断兼容性"}</strong>
      </div>
    </div>
    <div className={`${styles.semverStatus} ${selected === "major" && showNext ? styles.semverStatusWarn : ""}`} role="status" aria-live="polite">
      {selected === "major" && showNext ? <Warning size={19} aria-hidden="true" /> : selected === "patch" && showNext ? <CheckCircle size={19} aria-hidden="true" /> : <Code size={19} aria-hidden="true" />}
      <p><strong>{step === 0 ? "先把 1.4.2 当成已发布的约定。" : step === 1 ? "先问旧调用还能不能继续工作。" : step === 2 ? `${change.segment} 段被选中，下一版是 ${change.next}。` : change.release + "。"}</strong>{step === 0 ? "版本号还没有替你判断这次改动。" : step === 1 ? change.detail : step === 2 ? change.detail : change.migration}</p>
    </div>
    <div className={styles.semverControls}><SceneControls scene={scene} labels={labels} /></div>
    <p className={styles.semverBoundary}><strong>版本号是兼容承诺，不是自动审查。</strong>规范不会替发布者发现每一处破坏性改动；你仍要对照公开 API、旧调用和迁移说明。</p>
  </div>;
}
