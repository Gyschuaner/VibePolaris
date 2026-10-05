"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, GridFour, Ruler, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CssGridConcept.module.css";

const labels = ["画出轨道", "放入普通卡片", "让项目跨列", "dense 回填", "缩窄并保住下限"];
type Mode = "sparse" | "dense";
type WidthMode = "wide" | "narrow";
const letters = ["A", "B", "C", "D", "E"];

export function CssGridLesson() {
  const scene = useScene(labels.length);
  const [mode, setMode] = useState<Mode>("sparse");
  const [width, setWidth] = useState<WidthMode>("wide");
  const forcedMode = scene.step === 3 ? "dense" : mode;
  const forcedWidth = scene.step === 4 ? "narrow" : width;
  const activeMode = forcedMode;
  const activeWidth = forcedWidth;
  useEffect(() => {
    if (scene.step === 3 && mode !== "dense") setMode("dense");
    if (scene.step === 4 && width !== "narrow") setWidth("narrow");
  }, [mode, scene.step, width]);

  const span = scene.step >= 2 && scene.step <= 3;
  const count = scene.step === 0 ? 0 : scene.step === 1 ? 3 : scene.step === 4 ? 5 : 4;
  const columns = activeWidth === "wide" ? 3 : 2;
  const rows = 2;
  const items = useMemo(() => letters.slice(0, count), [count]);
  const gridStyle = { "--grid-columns": columns, gridTemplateRows: `repeat(${rows}, minmax(42px, auto))` } as CSSProperties;
  const status = scene.step === 0 ? "先画轨道，项目还没有位置。" : scene.step === 1 ? "普通 auto-placement 按文档顺序寻找下一个可用格。" : scene.step === 2 ? "跨列项目先占空间，后续卡片可能遇到暂时空着的格子。" : scene.step === 3 ? "dense 允许后出现的卡片回填空格，但视觉顺序可能和 DOM 顺序不同。" : "minmax 给轨道设下限；空间不够时减少列数，比把内容压成细条更诚实。";
  const StatusIcon = scene.step === 3 ? CheckCircle : scene.step === 4 ? WarningCircle : Ruler;

  return <div ref={scene.ref} className={styles.gridLab} role="region" aria-label="CSS Grid 轨道、跨列、自动放置和 minmax 工作台">
    <div className={styles.gridHeader}><span>改一个条件，看网格怎样重新安排项目</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.gridControls} role="group" aria-label="调整 CSS Grid 条件">
      <button type="button" className={styles.gridControl} aria-pressed={activeMode === "sparse"} onClick={() => { setMode("sparse"); scene.seek(0); }}>普通 row</button>
      <button type="button" className={styles.gridControl} aria-pressed={activeMode === "dense"} onClick={() => { setMode("dense"); scene.seek(0); }}>dense 回填</button>
      <button type="button" className={styles.gridControl} aria-pressed={activeWidth === "wide"} onClick={() => { setWidth("wide"); scene.seek(0); }}>容器 640px</button>
      <button type="button" className={styles.gridControl} aria-pressed={activeWidth === "narrow"} onClick={() => { setWidth("narrow"); scene.seek(0); }}>容器 420px</button>
    </div>
    <div className={styles.gridLabGrid}>
      <div className={styles.gridLabPanel} data-active={scene.step === 0 || scene.step === 4}>
        <div className={styles.gridLabel}><Ruler size={16} aria-hidden="true" /><span>输入条件</span></div>
        <h3>{activeWidth === "wide" ? "640px · 3 列" : "420px · 2 列"}</h3>
        <div className={styles.gridLabSizing}>
          <div><span>列轨道</span><i style={{ width: `${columns === 3 ? 100 : 66}%` }} /><b>{columns}</b></div>
          <div data-warn={scene.step === 4}><span>行轨道</span><i style={{ width: `${scene.step === 4 ? 100 : 68}%` }} /><b>{scene.step === 4 ? "2 + auto" : rows}</b></div>
          <div><span>算法</span><i style={{ width: `${activeMode === "dense" ? 88 : 48}%` }} /><b>{activeMode}</b></div>
        </div>
        <small>Grid 同时观察列、行、跨度和放置顺序，不能只看一个方向。</small>
      </div>
      <div className={styles.gridLabArrow} aria-hidden="true"><GridFour size={22} /></div>
      <div className={styles.gridLabPanel} data-active={scene.step >= 1}>
        <div className={styles.gridLabel}><GridFour size={16} aria-hidden="true" /><span>结算后的区域</span></div>
        <h3>{scene.step === 4 ? "repeat(2, minmax(120px, 1fr))" : span ? `${activeMode === "dense" ? "dense" : "row"} · span 2` : "auto-placement"}</h3>
        <div className={styles.gridCanvas} data-dense={activeMode === "dense"} style={gridStyle}>
          {items.map((letter, index) => <div key={letter} className={styles.gridCard} data-card={letter.toLowerCase()} style={span && index < 2 ? { gridColumn: "span 2" } : undefined}><strong>{letter}</strong><code>{span && index < 2 ? "span 2" : "1 cell"}</code></div>)}
        </div>
        <small>{scene.step === 4 ? "两列保住每张卡片的最小宽度，E 会进入自动生成的下一行。" : activeMode === "dense" ? "后出现的卡片可以回填前面的空位，读取顺序仍由 HTML 决定。" : span ? "先跨列，再观察普通 row 如何向前寻找下一个位置。" : "项目按出现顺序进入网格区域，列和行一起决定位置。"}</small>
      </div>
    </div>
    <div className={styles.gridLabMetrics}><div><span>当前列数</span><strong>{columns}</strong></div><div><span>放置策略</span><strong>{activeMode === "dense" ? "row dense" : "row sparse"}</strong></div><div><span>结果</span><strong>{scene.step === 4 ? "隐式行" : span ? "跨列" : scene.step === 0 ? "等待读取" : "逐格放置"}</strong></div></div>
    <p className={styles.gridLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
