"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, FileCode, GitBranch, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function SastLesson() {
  const scene = useScene(4);
  const [fixed, setFixed] = useState(false);
  useEffect(() => {
    if (scene.step <= 2) setFixed(false);
    if (scene.step === 3) setFixed(true);
  }, [scene.step]);
  const path = fixed ? "已切断：参数化查询" : "request.query → formatQuery → db.query";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="静态应用安全测试数据流演示">
    <Caption scene={scene} labels={["提取源码", "追踪 source 到 sink", "报告第 42 行", "修复并重扫"]} titles={["不运行程序也能分析", "沿数据流找危险汇点", "报告潜在路径", "修复切断路径"]} copy={["SAST 读取源代码、规则和框架模型；应用没有启动，数据库也没有被调用。", "不可信的 request.query 跨过三个函数到达 db.query，扫描器保留 source、sink 和路径。", "第 42 行是可疑汇点；告警是需要确认的证据，不是已经被利用的事实。", "加入参数化查询后，数据不再拼进 SQL；重扫显示路径 0，仍需人工复核上下文。"]} />
    <div className={styles.choices} role="group" aria-label="修复静态告警"><button type="button" onClick={() => { setFixed(false); scene.seek(2); }} aria-pressed={!fixed}>保留告警</button><button type="button" onClick={() => { setFixed(true); scene.seek(3); }} aria-pressed={fixed}><Check size={16} />加入参数化查询</button></div>
    <div className={styles.contract}><div><FileCode size={25} /><h3>source</h3><code>request.query</code><p>不可信输入</p></div><ArrowRight size={20} /><div><GitBranch size={25} /><h3>数据流</h3><code>{path}</code><p>{fixed ? "净化/参数化节点" : "跨 3 个函数"}</p></div><ArrowRight size={20} /><div><Warning size={25} /><h3>sink</h3><code>db.query</code><p>{fixed ? "告警 0" : "第 42 行潜在注入"}</p></div></div>
    <p className={styles.inputExample}><strong>边界</strong>静态结果通常看不到真实运行配置、认证状态和业务条件；SAST、依赖扫描和运行时测试要各自回答不同问题。</p>
  </div>;
}
