"use client";

import { ArrowRight, Browser, CheckCircle, Crosshair, Stack, Target } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./PositioningConcept.module.css";

const frames = [
  { label: "留在队伍里", mode: "static", title: "static", ref: "普通流", note: "卡片按原来的顺序占位，top/left 不会把它拽出队伍。" },
  { label: "保留原位置", mode: "relative", title: "relative", ref: "自己的原位置", note: "卡片从原位置偏移，但它留下的空间仍然在。" },
  { label: "寻找包含块", mode: "absolute", title: "absolute", ref: "最近的 positioned ancestor", note: "卡片脱离普通流，top/left 改为相对最近的定位祖先。" },
  { label: "贴住视口边界", mode: "fixed", title: "fixed", ref: "视口", note: "卡片相对视口定位；滚动页面时，它不会跟着普通内容走。" },
  { label: "到阈值才贴住", mode: "sticky", title: "sticky", ref: "滚动容器边界", note: "卡片先占普通流空间，滚动到 inset 阈值后才贴住容器。" },
];

export function PositioningHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} data-mode={current.mode} aria-label="CSS 定位方式改变元素的参照系">
    <div className={styles.heroTop}><span>同一张提醒卡，换一个参照系</span><strong>POSITION · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.positionStage}><div className={styles.stageFrame}><span>容器</span><i /><i /><i /></div><div className={styles.positionObject}><Target size={16} aria-hidden="true" /><strong>{current.title}</strong><small>{current.ref}</small></div></div>
      <div className={styles.heroArrow} aria-hidden="true"><ArrowRight size={18} /><span>参照</span></div>
      <div className={styles.heroResult}><CheckCircle size={17} aria-hidden="true" /><span>当前位置</span><strong>{current.title}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><Crosshair size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.ref}</span></div>
    <figcaption>定位先回答“相对谁”，再回答“偏多少”；position 改变的是参照系和是否占位，不只是把盒子挪几像素。</figcaption>
  </figure>;
}
