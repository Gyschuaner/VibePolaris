"use client";

import { ArrowsOutCardinal, DeviceMobile, MapPinLine, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { HeroShell } from "./FrontendInteractionSignatureHeroes";
import { useScene } from "./HarnessStoryScenes";
import styles from "./PlatformCssSignatureHeroes.module.css";

const safeAreaLabels = ["背景先铺到边缘", "读取动态 inset", "内容离开危险区", "旋转后重新计算"];

export function SafeAreaSignatureHero() {
  const scene = useScene(safeAreaLabels.length);
  const orientation = scene.step === 3 ? "landscape" : "portrait";
  const inset = scene.step === 0 ? 0 : scene.step === 1 ? 12 : scene.step === 2 ? 18 : 14;
  return <HeroShell scene={scene} title="安全区域怎样把内容从刘海和手势区移开" labels={safeAreaLabels} className={styles.platformHero}>
    <div className={styles.safeBoard} data-step={scene.step} data-orientation={orientation} style={{ "--safe-inset": `${inset}px` } as CSSProperties}>
      <div className={styles.safeLegend}><DeviceMobile size={18} aria-hidden="true" /><span>同一张全屏活动页</span><strong>{orientation === "portrait" ? "竖屏" : "横屏"}</strong></div>
      <div className={styles.safePhone}>
        <div className={styles.safeNotch} aria-hidden="true" />
        <div className={styles.safeScreen}>
          <div className={styles.safeBackdrop}><span>活动页</span><i>背景延伸到屏幕边缘</i></div>
          <div className={styles.safeContent}>
            <div className={styles.safeContentTop}><MapPinLine size={15} /><strong>订单 42</strong><small>{scene.step < 1 ? "贴近顶部" : "已避开危险区"}</small></div>
            <div className={styles.safeAction}><span>领取优惠券</span><b>{scene.step < 2 ? "容易贴边" : "可放心点击"}</b></div>
          </div>
          <div className={styles.safeGuides} aria-hidden="true"><span /><span /></div>
          <div className={styles.safeHome} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.safeProof} role="status">
        {scene.step < 2 ? <WarningCircle size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
        <div><strong>{scene.step < 2 ? "危险边界仍可能碰到内容" : "关键内容跟着 inset 移动"}</strong><span>{scene.step === 3 ? "横屏后，左右边距重新取值" : scene.step === 0 ? "只铺背景，不代表控件安全" : `当前安全距离 ${inset}px`}</span></div>
      </div>
      <ArrowsOutCardinal className={styles.safeRotate} size={18} aria-hidden="true" />
    </div>
  </HeroShell>;
}
