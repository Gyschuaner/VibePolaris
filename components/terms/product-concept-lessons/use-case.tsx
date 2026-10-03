"use client";

import { ArrowRight, CheckCircle, Clock, FileText, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function UseCaseLesson() {
  const scene = useScene(3);
  const successReady = scene.step === 1;
  const alternateReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从参与者和前置条件推进到主流程与替代流程演示">
    <Caption
      scene={scene}
      labels={["参与者与条件", "主成功路径", "替代路径"]}
      titles={["先把谁、何时和什么目标放在一起", "满足条件后才调用退款服务", "不同条件要有不同结果"]}
      copy={[
        "购买者从订单详情发起退款；订单已支付且距支付 36 小时，当前示例仍在 48 小时退款期限内，系统才继续检查条件。",
        "条件满足后，退款服务请求支付方成功，订单进入 refund_pending。参与者、触发动作和状态变化连成一条主流程。",
        "超过 48 小时在调用支付方前直接拒绝；支付方超时则给出可重试结果。两条替代路径都保持订单为已支付，不能误报成功。",
      ]}
    />
    <div className={styles.useCaseBoard} aria-live="polite">
      <div className={styles.useCaseCard} data-active={!successReady && !alternateReady} data-muted={successReady || alternateReady}>
        {successReady || alternateReady ? <UserCircle size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>参与者</strong>
        <code>购买者 · 发起退款</code>
        <span>{successReady || alternateReady ? "从订单详情触发" : "谁为了什么目标开始"}</span>
      </div>
      <ArrowRight className={styles.useCaseArrow} size={19} aria-hidden="true" />
      <div className={styles.useCaseCard} data-active={successReady || alternateReady} data-muted={!successReady && !alternateReady}>
        <Clock size={23} aria-hidden="true" />
        <strong>{successReady ? "前置条件" : alternateReady ? "条件分支" : "需要补齐"}</strong>
        <code>{successReady ? "已支付 · 36h / 48h 内" : alternateReady ? "48h 期限 / 支付方响应" : "状态 · 时间 · 权限"}</code>
        <span>{successReady ? "通过检查后进入主流程" : alternateReady ? "决定结果和数据是否改变" : "触发前先确认资格"}</span>
      </div>
      <ArrowRight className={styles.useCaseArrow} size={19} aria-hidden="true" />
      <div className={styles.useCaseCard} data-active={successReady || alternateReady} data-muted={!successReady && !alternateReady}>
        {successReady ? <CheckCircle size={23} aria-hidden="true" /> : alternateReady ? <FileText size={23} aria-hidden="true" /> : <FileText size={23} aria-hidden="true" />}
        <strong>{successReady ? "主流程结果" : alternateReady ? "替代结果" : "完成状态"}</strong>
        <code>{successReady ? "refund_pending · 订单已改变" : alternateReady ? "过期拒绝 / 超时可重试" : "成功、拒绝、失败"}</code>
        <span>{successReady ? "退款请求已受理" : alternateReady ? "订单保持 paid，不误报成功" : "每条路径都要收尾"}</span>
      </div>
      <div className={styles.useCaseProof} data-ready={successReady || alternateReady}>
        <FileText size={21} aria-hidden="true" />
        <p><strong>{alternateReady ? "分支结果可复核" : successReady ? "主流程可复述" : "用例还没站稳"}</strong>{alternateReady ? " 每条路径都说明用户看到什么、订单是否改变以及下一步怎么走。" : successReady ? " 从触发到状态变化都能说明，替代条件还要继续补齐。" : " 不要把单张页面或一句“可以退款”当成完整用例。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进使用场景演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={successReady}>走主成功路径</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={alternateReady}>查看替代路径</button>
    </div>
  </div>;
}
