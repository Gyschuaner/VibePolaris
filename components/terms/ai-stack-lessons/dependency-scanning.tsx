"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, GitBranch, Package, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function DependencyScanningLesson() {
  const scene = useScene(4);
  const [version, setVersion] = useState("2.1.0");
  useEffect(() => {
    setVersion(scene.step === 3 ? "2.3.2" : "2.1.0");
  }, [scene.step]);
  const fixed = version === "2.3.2";
  const matched = scene.step >= 1;
  const expanded = scene.step >= 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="依赖扫描解析版本演示">
    <Caption scene={scene} labels={["读取锁文件", "匹配公告范围", "展开依赖路径", "升级并复扫"]} titles={["拿到确切版本", "公告影响 B < 2.3.0", "确认传递路径", "版本越过范围"]} copy={["应用依赖 A 解析到 B@2.1.0；只写包名不能判断实际安装版本。", "公告匹配 B<2.3.0，报告记录严重性和可用修复版本。", "路径是 app → A → B；命中路径比单独显示一个包名更能说明影响。", fixed ? "B@2.3.2 不在受影响范围，重扫告警为 0；仍要运行兼容性回归。" : "B@2.1.0 仍在受影响范围，不能把升级建议当成已修复。"]} />
    <div className={styles.choices} role="group" aria-label="选择解析版本"><button type="button" onClick={() => { setVersion("2.1.0"); scene.seek(1); }} aria-pressed={!fixed}>B@2.1.0</button><button type="button" onClick={() => { setVersion("2.3.2"); scene.seek(3); }} aria-pressed={fixed}><Check size={16} />B@2.3.2</button></div>
    <div className={styles.contract}><div><Package size={25} /><h3>{expanded ? "app → A → B" : "app → A"}</h3><p>{expanded ? "传递依赖路径" : "manifest + lockfile"}</p></div><ArrowRight size={20} /><div><GitBranch size={25} /><h3>B@{version}</h3><p>{fixed ? "安全版本" : matched ? "公告影响范围" : "已解析，待匹配"}</p></div><ArrowRight size={20} /><div><Warning size={25} /><h3>{matched ? "Advisory" : "等待匹配"}</h3><p>{fixed ? "alert 0" : matched ? "alert 1 · high" : "未扫描"}</p></div></div>
    <p className={styles.inputExample}><strong>边界</strong>依赖扫描发现已公开、可识别的版本风险；升级之后仍要核对调用路径、兼容性和未公开风险。</p>
  </div>;
}
