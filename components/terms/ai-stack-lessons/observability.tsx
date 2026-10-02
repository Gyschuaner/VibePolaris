"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FileCode, GitBranch, Pulse } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ObservabilityLesson() {
  const scene = useScene(4);
  const [span, setSpan] = useState<"payment" | "none">("none");
  useEffect(() => {
    if (scene.step <= 1) setSpan("none");
  }, [scene.step]);
  const focused = span === "payment" && scene.step >= 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="可观测性信号关联演示">
    <Caption scene={scene} labels={["指标发现变慢", "展开 trace", "查看慢跨度", "筛选关联日志"]} titles={["先确认异常范围", "同一请求被拆成跨度", "瓶颈在 payment", "trace_id 把日志串起来"]} copy={["checkout p95（95% 请求的延迟上界）从 200 ms 升到 2.4 s；指标告诉你异常存在，但没有告诉你原因。", "trace-7 的 frontend 0.2 s、order 0.4 s、payment 1.8 s 排成一条请求路径。", "payment 占整条请求约 75%；选中它，下一步只保留这段调用的证据。", "同一个 trace_id 的三条结构化日志显示 retry=1、index=missing；信号之间产生解释。"]} />
    <div className={styles.choices} role="group" aria-label="选择追踪跨度"><button type="button" onClick={() => { setSpan("payment"); scene.seek(2); }} aria-pressed={focused}>选中 payment 1.8s</button><button type="button" onClick={() => { setSpan("none"); scene.seek(0); }} aria-pressed={!focused}>清除选择</button></div>
    <div className={styles.resultFlow}><Pulse size={25} /><span>p95 2.4s</span><ArrowRight size={18} /><GitBranch size={25} /><span>trace-7</span><ArrowRight size={18} /><strong data-active={focused}>payment 1.8s</strong></div>
    <div className={styles.contract}><div><Pulse size={25} /><h3>指标</h3><p>确认时间、范围和长尾。</p></div><div><FileCode size={25} /><h3>日志</h3><p>{scene.step >= 3 ? "trace-7 · retry=1 · index=missing" : "先关联 trace_id，再看事件细节。"}</p></div></div>
    <p className={styles.inputExample}><strong>失败分支</strong>没有 trace_id 时日志仍然存在，却不能证明它属于这次 checkout；“有很多日志”不等于“能回答为什么变慢”。</p>
  </div>;
}
