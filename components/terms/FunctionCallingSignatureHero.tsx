"use client";

import { ClipboardText, Database, Key, BracketsCurly, ShieldCheck } from "@phosphor-icons/react";
import { useScene } from "./HarnessStoryScenes";
import { BoardHeader, SignatureFrame } from "./ConceptDiversitySignatureHeroes";
import styles from "./ConceptDiversitySignatureHeroes.module.css";

export function FunctionCallingSignatureHero() {
  const scene = useScene(4);
  const labels = ["请求进入模型", "生成调用建议", "应用校验执行", "工具返回状态"];
  const executed = scene.step >= 2;
  const returned = scene.step === 3;
  return <SignatureFrame scene={scene} labels={labels} ariaLabel="函数调用由模型提出请求，应用核对后才执行并配对结果" caption={returned ? "回执带着同一个 call_id 回来，应用才知道这份结果属于哪一次请求。" : executed ? "参数和权限都通过后，应用才打开只读柜；模型提出请求不等于已经执行。" : "函数名和参数是一张请求牌，先放在桌上等待应用检查。"}>
    <div className={styles.callBoard} data-stage={scene.step}>
      <BoardHeader eyebrow="CALL DESK / READ ONLY" title="订单查询请求" status={returned ? "RETURNED" : executed ? "EXECUTED" : "PROPOSED"} />
      <div className={styles.callGrid}>
        <div className={styles.callSlip}><ClipboardText size={20} /><span>模型提出</span><strong>get_order</strong><code>call_id · call_01</code><code>order_id · A102</code></div>
        <div className={styles.checkTray} data-active={scene.step >= 1}><span>应用检查台</span><div><Key size={16} /><b>已注册</b></div><div><BracketsCurly size={16} /><b>参数完整</b></div><div><ShieldCheck size={16} /><b>只读权限</b></div><small>{scene.step < 1 ? "等待请求牌" : scene.step === 1 ? "逐项核对" : "检查通过"}</small></div>
        <div className={styles.resultDrawer} data-open={executed}><Database size={21} /><span>{executed ? "订单柜已开" : "订单柜锁着"}</span><strong>{returned ? "status: shipped" : executed ? "A102" : "—"}</strong><small>{returned ? "call_01 · 对应回执" : "不会因为看见函数名而自动读取"}</small></div>
      </div>
      <div className={styles.callFooter} data-returned={returned}><span>{returned ? "结果已交回" : executed ? "外部查询已执行" : "应用仍掌握执行权"}</span><div><span>call_01</span><i>{returned ? "matched" : "waiting"}</i></div></div>
    </div>
  </SignatureFrame>;
}
