"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Database, Globe, Package, ShieldCheck, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ThreatModelingLesson() {
  const scene = useScene(4);
  const [signed, setSigned] = useState(false);
  useEffect(() => {
    setSigned(scene.step === 3);
  }, [scene.step]);
  const smsAdded = scene.step >= 1;
  const threats = scene.step === 0 ? 2 : 3;
  const highRisk = scene.step === 0 ? 1 : signed ? 1 : 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="威胁建模信任边界演示">
    <Caption scene={scene} labels={["画出现有数据流", "加入短信供应商", "标出攻击路径", "加回执签名校验"]} titles={["先看资产和边界", "系统改变，模型要更新", "每条流都要问谁能伪造", "控制降低风险但不抹掉残余"]} copy={["浏览器、API、数据库形成三节点；先标出登录令牌和用户资料这两个资产。", "新短信供应商跨出原有边界，新增两条数据流；旧模型已经不完整。", "供应商泄露、伪造回执等威胁让清单从 2 项变成 3 项。", signed ? "签名校验把伪造回执的高风险降下去，但供应商泄露仍是待办。" : "点击控制前不要把威胁数量当成漏洞数量；这是设计推演。"]} />
    <div className={styles.choices} role="group" aria-label="模拟威胁控制"><button type="button" onClick={() => { setSigned(false); scene.seek(2); }} aria-pressed={!signed}>保留待办</button><button type="button" onClick={() => { setSigned(true); scene.seek(3); }} aria-pressed={signed}><ShieldCheck size={16} />加入签名校验</button></div>
    <div className={styles.resultFlow}><Globe size={24} /><span>Browser</span><ArrowRight size={18} /><Database size={24} /><span>API / DB</span>{smsAdded && <><ArrowRight size={18} /><Package size={24} /><span>SMS supplier</span></>}{scene.step >= 2 && <><ArrowRight size={18} />{signed ? <ShieldCheck size={24} /> : <Warning size={24} />}<span>{signed ? "signed receipt" : "threats"}</span></>}</div>
    <div className={styles.inputExample}><strong>模型结果</strong>{smsAdded ? "2 条信任边界 · 4 条数据流" : "1 条信任边界 · 2 条数据流"} · {threats} 项威胁 · 高风险 {highRisk} 项；每项还要有控制、负责人和验证状态。</div>
  </div>;
}
