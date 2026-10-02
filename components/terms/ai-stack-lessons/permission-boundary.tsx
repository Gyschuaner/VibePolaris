"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Database, Key, ShieldCheck, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function PermissionBoundaryLesson() {
  const scene = useScene(4);
  const [salary, setSalary] = useState(false);
  useEffect(() => {
    setSalary(scene.step === 3);
  }, [scene.step]);
  const salesRequested = scene.step >= 1;
  const salaryRequested = scene.step >= 2;
  const allowed = salary && scene.step >= 3;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="权限边界强制校验演示">
    <Caption scene={scene} labels={["发放最小令牌", "请求 sales", "越界请求 salary", "明确授权后重试"]} titles={["能力令牌只有一项", "允许 sales 读取", "策略在模型外拒绝", "增加权限后才允许"]} copy={["报表工具拿到 read:sales；提示词里的“不要读工资”不是安全边界。", "read:sales 与销售资源匹配，返回业务数据并记录主体。", "read:salary 没有策略匹配，返回 0 行、拒绝并写入审计事件；工具代码没有被授权绕过。", "只有管理员明确加入 read:salary 后，策略才允许再次请求；授权本身也需要审计。"]} />
    <div className={styles.choices} role="group" aria-label="调整报表权限">{salaryRequested ? <label><input type="checkbox" checked={salary} onChange={(event) => { setSalary(event.target.checked); scene.seek(event.target.checked ? 3 : 2); }} />明确加入 read:salary</label> : <p className={styles.inputExample}><strong>{salesRequested ? "销售权限已匹配" : "先发放最小令牌"}</strong>{salesRequested ? "read:sales 可以读取销售数据。" : "令牌暂时只有 read:sales。"}</p>}<button type="button" onClick={() => scene.seek(2)}>请求 read:salary</button></div>
    <div className={styles.layers}><div><Key size={25} /><h3>能力令牌</h3><p>{salary ? "read:sales + read:salary" : "read:sales"}</p></div><ArrowRight size={20} /><div>{allowed ? <CheckCircle size={25} /> : salaryRequested ? <Warning size={25} /> : <ShieldCheck size={25} />}<h3>策略判定</h3><p>{allowed ? "match → allow" : salaryRequested ? "no match → deny" : salesRequested ? "match sales → allow" : "等待请求"}</p></div><ArrowRight size={20} /><div><Database size={25} /><h3>{allowed ? "工资表" : salesRequested && !salaryRequested ? "销售表" : "资源"}</h3><p>{allowed ? "返回授权行" : salaryRequested ? "0 行 · audit denied" : salesRequested ? "返回销售行" : "尚未访问"}</p></div></div>
    <p className={styles.inputExample}><strong>边界</strong>权限边界必须在模型外、工具执行前后都能强制生效；审批是一次决定，不能代替持续授权。</p>
  </div>;
}
