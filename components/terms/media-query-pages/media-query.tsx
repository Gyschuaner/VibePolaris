"use client";

import { CheckCircle, Cursor, DeviceMobile, Gear, Monitor, SpeakerSimpleSlash, WarningCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./MediaQueryConcept.module.css";

const labels = ["看基础状态", "只改宽度", "换输入能力", "尊重偏好", "组合条件"];
type MediaState = { narrow: boolean; noHover: boolean; reduced: boolean };

export function MediaQueryLesson() {
  const scene = useScene(labels.length);
  const [state, setState] = useState<MediaState>({ narrow: false, noHover: false, reduced: false });
  const previousStep = useRef(scene.step);
  const effective: MediaState = scene.step === 0 ? state : scene.step === 1 ? { narrow: true, noHover: false, reduced: false } : scene.step === 2 ? { narrow: false, noHover: true, reduced: false } : scene.step === 3 ? { narrow: false, noHover: false, reduced: true } : { narrow: true, noHover: true, reduced: true };
  useEffect(() => {
    if (scene.step === 0 && previousStep.current !== 0) setState({ narrow: false, noHover: false, reduced: false });
    if (scene.step === 1) setState({ narrow: true, noHover: false, reduced: false });
    if (scene.step === 2) setState({ narrow: false, noHover: true, reduced: false });
    if (scene.step === 3) setState({ narrow: false, noHover: false, reduced: true });
    if (scene.step === 4) setState({ narrow: true, noHover: true, reduced: true });
    previousStep.current = scene.step;
  }, [scene.step]);
  const conditions = [
    { id: "width", label: "窄视口", code: "width < 640px", active: effective.narrow, result: effective.narrow ? "改成单列" : "保持三列", icon: <DeviceMobile size={16} aria-hidden="true" /> },
    { id: "hover", label: "没有 hover", code: "hover: none", active: effective.noHover, result: effective.noHover ? "提示常驻" : "可悬停提示", icon: <Cursor size={16} aria-hidden="true" /> },
    { id: "motion", label: "减少动效", code: "prefers-reduced-motion: reduce", active: effective.reduced, result: effective.reduced ? "静止反馈" : "轻微位移", icon: <SpeakerSimpleSlash size={16} aria-hidden="true" /> },
  ];
  const status = scene.step === 0 ? "先看基础样式，再逐个改变输入；不要把三个条件压成一个屏幕宽度。" : scene.step === 1 ? "只有 width 条件命中，列数改变；hover 和动效规则仍按自己的输入判断。" : scene.step === 2 ? "没有 hover 能力时，提示不能只躲在鼠标经过之后；可见信息要有自己的落点。" : scene.step === 3 ? "减少动效只收住运动，不会顺手改掉内容结构或阅读顺序。" : "三个条件同时命中，三条 CSS 声明各自负责一件事，结果叠加在同一份 HTML 上。";
  const StatusIcon = scene.step === 4 ? CheckCircle : scene.step === 2 ? WarningCircle : Gear;
  return <div ref={scene.ref} className={styles.mediaQueryLab} role="region" aria-label="媒体查询条件与 CSS 规则工作台">
    <div className={styles.mediaQueryHeader}><span>改一个输入，看哪条 @media 规则亮起来</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.mediaQueryControls} role="group" aria-label="手动调整媒体条件">
      <button type="button" className={styles.mediaQueryControl} aria-pressed={effective.narrow} onClick={() => { setState(value => ({ ...value, narrow: !value.narrow })); scene.seek(0); }}>宽度 {effective.narrow ? "560px" : "860px"}</button>
      <button type="button" className={styles.mediaQueryControl} aria-pressed={effective.noHover} onClick={() => { setState(value => ({ ...value, noHover: !value.noHover })); scene.seek(0); }}>{effective.noHover ? "hover: none" : "hover: hover"}</button>
      <button type="button" className={styles.mediaQueryControl} aria-pressed={effective.reduced} onClick={() => { setState(value => ({ ...value, reduced: !value.reduced })); scene.seek(0); }}>{effective.reduced ? "恢复动效" : "减少动效"}</button>
    </div>
    <div className={styles.mediaQueryLabGrid}>
      <div className={styles.mediaQueryLabPanel} data-active={scene.step <= 1}>
        <div className={styles.mediaQueryLabel}><Monitor size={16} aria-hidden="true" /><span>当前输入</span></div>
        <h3>{effective.narrow ? "窄空间" : "宽空间"} · {effective.noHover ? "无 hover" : "有 hover"}</h3>
        <div className={styles.mediaQueryLabMatrix}>{conditions.map(item => <div key={item.id} className={styles.mediaQueryLabRow} data-active={item.active}><code>{item.code}</code><strong>{item.active ? "true" : "false"}</strong></div>)}</div>
        <small>媒体查询先判断条件真值；它不替你决定组件应该怎样排版。</small>
      </div>
      <div className={styles.mediaQueryLabArrow} aria-hidden="true"><Gear size={22} /></div>
      <div className={styles.mediaQueryLabPanel} data-active={scene.step >= 1}>
        <div className={styles.mediaQueryLabel}><Gear size={16} aria-hidden="true" /><span>规则结果</span></div>
        <h3>三条规则，各管一件事</h3>
        <div className={styles.mediaQueryLabMatrix}>{conditions.map(item => <div key={item.id} className={styles.mediaQueryLabRow} data-active={item.active}><span>{item.icon} {item.label}</span><strong>{item.result}</strong></div>)}</div>
        <small>基础样式先存在，命中的声明再覆盖对应属性；DOM 和读屏顺序不因条件变化而复制。</small>
      </div>
    </div>
    <div className={styles.mediaQueryLabMetrics}><div><span>命中规则</span><strong>{conditions.filter(item => item.active).length} / 3</strong></div><div><span>当前列数</span><strong>{effective.narrow ? "1" : "3"}</strong></div><div><span>动效策略</span><strong>{effective.reduced ? "静止" : "默认"}</strong></div></div>
    <p className={styles.mediaQueryLabStatus} role="status"><StatusIcon size={17} aria-hidden="true" /><span>{status}</span></p>
  </div>;
}
