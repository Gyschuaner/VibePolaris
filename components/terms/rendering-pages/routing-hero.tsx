"use client";

import { ArrowRight, Browser, CheckCircle, GitBranch, Globe, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./RenderingConcept.module.css";

const frames = [
  { label: "拆出路径", tone: "path", rows: [["地址栏", "/products/42"], ["路由树", "products → :id"], ["结果", "等待"]], result: "id=42", note: "路由器先把 URL 的路径段交给匹配规则。" },
  { label: "读查询参数", tone: "query", rows: [["地址栏", "?tab=stock"], ["路由树", "/products/:id"], ["结果", "id + tab"]], result: "库存页", note: "路径参数和查询参数是两组不同输入，都要传给页面。" },
  { label: "检查访问", tone: "auth", rows: [["地址栏", "/products/42"], ["路由树", "matched"], ["结果", "需要登录"]], result: "returnTo", note: "匹配成功不等于有权访问，鉴权可以在路由之后独立发生。" },
  { label: "打开目标页", tone: "page", rows: [["地址栏", "/products/42"], ["路由树", "matched"], ["结果", "商品 42"]], result: "页面", note: "规则、参数和访问检查都通过后，页面才真正打开。" },
  { label: "未知路径", tone: "404", rows: [["地址栏", "/unknown/42"], ["路由树", "no match"], ["结果", "404"]], result: "找不到", note: "没有匹配时要给出明确的回退，而不是让地址栏悄悄失效。" },
];

export function RoutingHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.tone === "404" || current.tone === "auth" ? WarningCircle : CheckCircle;
  return <figure ref={scene.ref} className={styles.hero} data-scene={current.tone} aria-label="路由把 URL 匹配成页面或回退结果">
    <div className={styles.heroTop}><span>地址栏怎样走到一页内容</span><strong>ROUTING · {String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={frames.map(frame => frame.label)} compact />
    <div className={styles.heroBoard}>
      <div className={styles.renderStage}><div className={styles.renderStageHeader}><span>URL → route</span><span>match / branch</span></div><div className={styles.renderRows}>{current.rows.map(([label, value], index) => { const Icon = label === "地址栏" ? Globe : label === "路由树" ? GitBranch : label === "结果" ? Browser : Browser; return <div className={styles.renderRow} data-active={index <= scene.step ? "true" : "false"} key={label}><Icon size={13} aria-hidden="true" /><span>{label}</span><small>{value}</small></div>; })}</div></div>
      <div className={styles.renderArrow} aria-hidden="true"><ArrowRight size={18} /></div>
      <div className={styles.heroResult}><ResultIcon size={17} aria-hidden="true" /><span>匹配结果</span><strong>{current.result}</strong><small>{current.note}</small></div>
    </div>
    <div className={styles.heroNote} role="status"><ShieldCheck size={14} aria-hidden="true" /><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>路由负责把地址匹配到页面或处理器；参数解析、鉴权和 404 回退都要在这条路径上留下可见结果。</figcaption>
  </figure>;
}
