"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, FileText, LockSimple, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import { useResetOnSceneStart } from "../AgentConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ToolResultLesson() {
  const scene = useScene(4);
  const [stock, setStock] = useState<0 | 8>(0);
  const [error, setError] = useState(false);
  useResetOnSceneStart(scene, () => { setStock(0); setError(false); });
  const hasReturn = scene.step >= 1;
  const hasValidated = scene.step >= 2;
  const result = error ? "{ error: 'timeout', status: 504 }" : `{ call_id: 'inv-7', stock: ${stock}, status: 200 }`;
  const answer = error ? "库存暂时无法确认" : stock === 0 ? "K7 暂时缺货" : "K7 有 8 件";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="工具结果状态演示">
    <Caption scene={scene} labels={["调用发出", "原始结果", "业务校验", "回答更新"]} titles={["还没有库存结论", "先看原始返回", "传输成功还要看业务字段", "回答跟着结果走"]} copy={["call_id=inv-7 绑定这一次库存查询。", "应用把原始 JSON 保留下来，状态码不等于库存状态。", "stock=0、stock=8 和 timeout 会进入不同业务分支。", "只有经过关联和业务校验，模型才有可用的下一步。"]} />
    <div className={styles.choices} role="group" aria-label="修改工具原始结果"><button type="button" aria-pressed={hasReturn && stock === 0 && !error} onClick={() => { setError(false); setStock(0); scene.seek(1); }}>stock=0</button><button type="button" aria-pressed={hasReturn && stock === 8 && !error} onClick={() => { setError(false); setStock(8); scene.seek(1); }}>stock=8</button><button type="button" aria-pressed={hasReturn && error} onClick={() => { setError(true); scene.seek(1); }}>timeout</button></div>
    <div className={styles.contract}><div><FileText size={25} /><h3>call_id=inv-7</h3><p>sku=K7</p></div><ArrowRight size={20} /><div><code>{hasReturn ? result : "等待工具返回"}</code><h3>原始结果</h3><p>{hasReturn ? "状态与字段已保存" : "尚未返回"}</p></div><ArrowRight size={20} /><div>{!hasValidated ? <LockSimple size={25} /> : error || stock === 0 ? <Warning size={25} /> : <CheckCircle size={25} />}<h3>{!hasValidated ? "待校验" : answer}</h3><p>{!hasValidated ? "不能直接生成成功回答" : error ? "传输失败，保持不确定" : "业务字段驱动下一句"}</p></div></div>
    <p className={styles.inputExample}><strong>边界</strong>即使 HTTP 返回 200，空结果、过期来源或关联 ID 不匹配也不能被包装成成功。</p>
  </div>;
}
