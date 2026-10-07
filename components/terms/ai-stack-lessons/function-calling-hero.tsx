"use client";

import { ArrowRight, Check, FileText, Function, LockKey } from "@phosphor-icons/react";
import { useEffect } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../ModelOutputConcepts.module.css";

const steps = ["递出取号牌", "找到注册函数", "检查后开柜", "带号牌回执"];

export function FunctionCounterHero() {
  const scene = useScene(steps.length);
  useEffect(() => { scene.toggle(); }, []);
  const executed = scene.step >= 2;
  const returned = scene.step === 3;
  return <div ref={scene.ref} className={styles.counterHero} data-step={scene.step} role="img" aria-label="函数调用先递出带编号的请求，再由应用检查注册表与权限，最后返回对应订单结果">
    <div className={styles.counterHeroTop}><span>TOOL COUNTER / CALL 01</span><strong>{returned ? "RECEIPT" : executed ? "OPEN" : "WAITING"}</strong></div>
    <SceneControls scene={scene} labels={steps} compact />
    <div className={styles.counterBench}>
      <div className={styles.counterTicket}><span>请求牌</span><strong>get_order</strong><code>编号 · call_01</code></div>
      <div className={styles.counterDrawer} data-open={scene.step >= 1}><Function size={16} aria-hidden="true" /><span>注册抽屉</span><code>get_order(order_id)</code></div>
      <div className={styles.counterCabinet} data-open={executed}><LockKey size={17} aria-hidden="true" /><span>{executed ? "订单柜已打开" : "订单柜"}</span><code>{returned ? "status: shipped" : "A102"}</code></div>
    </div>
    <div className={styles.counterProof} data-visible={returned}><ArrowRight size={15} /><span>{returned ? <><Check size={14} /> call_01 对应回执</> : "先有请求，再有执行"}</span></div>
  </div>;
}
