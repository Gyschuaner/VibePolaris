"use client";

import { ArrowRight, ArrowsClockwise, CheckCircle, GridFour, Ruler, Stack, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./CssGridConcept.module.css";

const frames = [
  { label: "先画出轨道", stage: "TRACKS", columns: 3, rows: 2, count: 0, span: false, dense: false, width: "640px 容器", note: "Grid 先把行和列画出来，项目还没有占据任何格子。" },
  { label: "按顺序放入卡片", stage: "PLACE", columns: 3, rows: 2, count: 3, span: false, dense: false, width: "640px 容器", note: "直接子项按文档顺序进入一个个网格区域；两条轴同时在工作。" },
  { label: "让卡片跨两列", stage: "SPAN", columns: 3, rows: 2, count: 4, span: true, dense: false, width: "640px 容器", note: "A、B 各跨两列，普通 row 放置会留下一个暂时空着的格子。" },
  { label: "dense 回填空格", stage: "DENSE", columns: 3, rows: 2, count: 4, span: true, dense: true, width: "640px 容器", note: "dense 允许后出现的小卡片回头填空，画面更紧，但视觉顺序可能不再等于 DOM 顺序。" },
  { label: "轨道不够就长出来", stage: "IMPLICIT", columns: 3, rows: 2, count: 5, span: true, dense: false, width: "640px 容器", note: "显式两行装不下第五张卡片，Grid 自动生成一条隐式行来容纳它。" },
  { label: "用 minmax 留住可读性", stage: "MINMAX", columns: 2, rows: 2, count: 5, span: false, dense: false, width: "420px 容器", note: "容器变窄后从三列变两列；minmax 给每条轨道设下限，内容不会被压成细线。" },
] as const;

const letters = ["A", "B", "C", "D", "E"];

export function CssGridHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const items = letters.slice(0, current.count);
  const ResultIcon = current.stage === "DENSE" ? CheckCircle : current.stage === "IMPLICIT" ? WarningCircle : Ruler;
  const canvasStyle = { "--grid-columns": current.columns, gridTemplateColumns: `repeat(${current.columns}, minmax(${current.stage === "MINMAX" ? "120px" : "0"}, 1fr))`, gridTemplateRows: `repeat(${current.rows}, minmax(42px, auto))` } as CSSProperties;

  return <figure ref={scene.ref} className={styles.gridHero} data-step={scene.step} aria-label="CSS Grid 如何建立轨道、放置项目并处理空格">
    <div className={styles.gridHeader}><span>先画轨道，再决定项目占哪些格</span><strong>{current.stage} · {current.width}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} />
    <div className={styles.gridBoard}>
      <div className={styles.gridPanel} data-active={scene.step === 0 || scene.step === 5}>
        <div className={styles.gridLabel}><Ruler size={17} aria-hidden="true" /><span>Grid 先回答</span></div>
        <h3>{current.columns} 列 × {current.rows} 行</h3>
        <div className={styles.gridLedger}>
          <div><span>轨道</span><i style={{ width: `${current.columns === 2 ? 66 : 100}%` }} /><b>{current.columns} columns</b></div>
          <div data-warn={current.stage === "IMPLICIT"}><span>行数</span><i style={{ width: `${current.stage === "IMPLICIT" ? 100 : current.rows === 2 ? 68 : 40}%` }} /><b>{current.stage === "IMPLICIT" ? "2 + 1 auto" : current.rows}</b></div>
          <div><span>放置</span><i style={{ width: `${current.dense ? 88 : current.span ? 72 : 42}%` }} /><b>{current.dense ? "dense" : current.span ? "span" : "row"}</b></div>
        </div>
        <small>轨道是可被引用的空间单位；项目进入轨道后，Grid 才能计算它的区域。</small>
      </div>
      <div className={styles.gridArrow} aria-hidden="true"><ArrowRight size={20} /><span>放置</span></div>
      <div className={styles.gridPanel} data-active={scene.step >= 1}>
        <div className={styles.gridLabel}><GridFour size={17} aria-hidden="true" /><span>项目怎样占格</span></div>
        <h3>{current.dense ? "grid-auto-flow: dense" : current.span ? "span 2 · 普通 row" : "显式轨道 + auto-placement"}</h3>
        <div className={styles.gridCanvas} data-dense={current.dense} style={canvasStyle}>
          {items.map((letter, index) => <div key={letter} className={styles.gridCard} data-card={letter.toLowerCase()} style={current.span && index < 2 ? { gridColumn: "span 2" } : undefined}><strong>{letter}</strong><code>{current.span && index < 2 ? "span 2" : "1 cell"}</code></div>)}
        </div>
        <small>{current.stage === "IMPLICIT" ? "第五张卡片把显式网格推开，新增的行属于 implicit grid。" : current.dense ? "后出现的小卡片回填前面的空位，DOM 顺序仍保持原样。" : current.span ? "跨列项目改变后续 auto-placement 的可用位置。" : "每个直接子项都有自己的网格区域，行列同时决定它的位置。"}</small>
      </div>
    </div>
    <div className={styles.gridNote} role="status"><ResultIcon size={17} aria-hidden="true" /><span>{current.note}</span></div>
    <div className={styles.gridMetrics}><div><span>当前轨道</span><strong>{current.columns} 列 · {current.stage === "IMPLICIT" ? "3 行含隐式" : `${current.rows} 行`}</strong></div><div><span>放置算法</span><strong>{current.dense ? "row dense" : "row sparse"}</strong></div><div><span>卡片关系</span><strong>{current.span ? "跨 2 列" : current.stage === "MINMAX" ? "minmax" : "逐格占位"}</strong></div></div>
    <div className={styles.gridResult}><Stack size={19} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>Grid 的关键不是“把页面切成十二列”，而是把行、列、轨道和放置顺序同时交给浏览器结算；你改变一个条件，空格、跨度和隐式轨道都会留下可观察的证据。</figcaption>
  </figure>;
}
