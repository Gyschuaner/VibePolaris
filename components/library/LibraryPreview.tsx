"use client";

import { useState, type CSSProperties } from "react";
import { House, MagnifyingGlass, Bell, GearSix, Folder, FileText, Image as ImageIcon, Heart, User, ChatCircle, PaperPlaneTilt, CalendarBlank, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { defaultSampleOptions, sampleStyles, type SampleOptions } from "@/lib/library-source";
import styles from "./Library.module.css";

const icons = [House, MagnifyingGlass, Bell, GearSix, Folder, FileText, ImageIcon, Heart, User, ChatCircle, PaperPlaneTilt, CalendarBlank];

export function LibraryPreview({ slug, decorative = false, options = defaultSampleOptions }: { slug: string; decorative?: boolean; options?: SampleOptions }) {
  const [selected, setSelected] = useState(1);
  const Card = decorative ? "div" : "details";
  const Summary = decorative ? "div" : "summary";
  const variables = { "--radius": `${options.radius}px`, "--speed": `${options.speed}ms`, "--angle": `${options.angle}deg`, "--depth": `${options.depth}px`, "--selected": selected } as CSSProperties;
  return <div className={styles.sample} data-sample={slug} data-decorative={decorative} style={variables} inert={decorative} aria-hidden={decorative || undefined}>
    {sampleStyles[slug] && <style>{sampleStyles[slug]}</style>}
    {slug === "sliding-tabs" && <div className="vp-tabs" role="group" aria-label="页面选择">
      {["概览", "文档", "设置"].map((label, index) => decorative ? <span className="vp-tab-label" data-selected={selected === index} key={label}>{label}</span> : <button key={label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{label}</button>)}
    </div>}
    {slug === "expandable-card" && <Card className="vp-card" {...(!decorative ? { open: true } : {})}>
      <Summary className="vp-summary"><span className={styles.cardLabel}><FileText size={23} aria-hidden />产品设计指南</span><CaretDown size={18} className="vp-chevron" aria-hidden /></Summary>
      <div className="vp-card-body"><img src="/library/paper-courtyard.png" alt="阳光下的庭院" /><p>从留白、色彩和层次开始，做一个清晰易用的页面。</p></div>
    </Card>}
    {slug === "soft-gradient" && <div className="vp-gradient" />}
    {slug === "paper-shadow" && <div className="vp-paper-stack"><div className="vp-paper" /><div className="vp-paper" /><div className="vp-paper" /></div>}
    {slug === "line-icons" && <div className={styles.iconGrid} aria-label="十二枚线性界面图标">{icons.map((Icon, index) => <Icon key={index} weight="regular" aria-hidden />)}</div>}
    {slug === "paper-grain" && <img className={styles.texture} src="/library/paper-grain.png" alt="暖白纸张细颗粒纹理" />}
  </div>;
}
