"use client";

import { Archive, ArrowsOutCardinal, ArrowCounterClockwise, Clock, Database, DeviceMobile, MapPinLine, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
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

const lifecycleLabels = ["前台编辑草稿", "进入后台", "进程被回收", "重新打开恢复"];

export function AppLifecycleSignatureHero() {
  const scene = useScene(lifecycleLabels.length);
  const memoryStatus = scene.step === 0 ? "正在编辑" : scene.step === 1 ? "暂停" : "已释放";
  const diskStatus = scene.step === 0 ? "旧快照" : scene.step === 1 ? "已保存" : scene.step === 2 ? "唯一证据" : "恢复来源";
  return <HeroShell scene={scene} title="应用生命周期怎样决定草稿能不能回来" labels={lifecycleLabels} className={styles.platformHero}>
    <div className={styles.lifecycleBoard} data-step={scene.step}>
      <div className={styles.lifecyclePhone}>
        <div className={styles.lifecycleChrome}><DeviceMobile size={16} /><span>编辑页</span><b>{scene.step === 1 ? "后台" : scene.step === 2 ? "已关闭" : "前台"}</b></div>
        <div className={styles.lifecycleDraft}><span>草稿 · 周报</span><strong>{scene.step === 3 ? "17:40 的版本" : "17:38 的版本"}</strong><small>{scene.step === 0 ? "光标还在这里" : scene.step === 1 ? "暂停写入" : scene.step === 2 ? "内存不存在" : "从快照读回"}</small></div>
        <div className={styles.lifecycleCursor} aria-hidden="true" />
      </div>
      <div className={styles.lifecycleBridge} aria-hidden="true"><Clock size={17} /><span>{scene.step < 2 ? "运行状态" : "重新创建"}</span><i /></div>
      <div className={styles.lifecycleStore}>
        <div className={styles.lifecycleMemory} data-lost={scene.step >= 2}><Archive size={19} /><span>内存中的页面</span><strong>{memoryStatus}</strong><small>{scene.step >= 2 ? "进程结束后不存在" : "可能被系统暂停"}</small></div>
        <div className={styles.lifecycleDisk} data-restored={scene.step === 3}><Database size={19} /><span>持久化草稿</span><strong>{diskStatus}</strong><small>{scene.step === 3 ? "读回后重新建立页面" : "保存才会留下证据"}</small></div>
      </div>
      <div className={styles.lifecycleProof} role="status">
        {scene.step === 2 ? <WarningCircle size={18} aria-hidden="true" /> : scene.step === 3 ? <ArrowCounterClockwise size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}
        <div><strong>{scene.step === 2 ? "后台事件不是保险箱" : scene.step === 3 ? "恢复的是快照，不是原来的进程" : "把必须保留的内容写进持久化存储"}</strong><span>{scene.step === 0 ? "用户仍在编辑，先保存草稿" : scene.step === 1 ? "应用可以暂停工作，但不能假设永不被杀" : scene.step === 2 ? "内存里的光标和临时状态已经消失" : "重新创建后，用已保存数据重建页面"}</span></div>
      </div>
    </div>
  </HeroShell>;
}
