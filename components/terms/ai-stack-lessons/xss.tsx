"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Cube, FileCode, ShieldCheck, Warning } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function XssLesson() {
  const scene = useScene(3);
  const [safe, setSafe] = useState(false);
  useEffect(() => {
    setSafe(scene.step === 2);
  }, [scene.step]);
  const executable = scene.step === 0 ? "未解析" : safe ? "0" : "1";
  const domState = scene.step === 0 ? "字符串未解析" : safe ? "一个文本节点" : "标签节点 + 事件属性";
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="XSS 输出上下文演示">
    <Caption scene={scene} labels={["收到评论字符串", "innerHTML 解析", "textContent 作为文字"]} titles={["不可信数据先保持数据", "危险上下文生成节点", "安全 API 不解析标签"]} copy={["评论内容含事件属性的图片标签；页面还没有决定把它当 HTML 还是文字。", "innerHTML 把字符串当标记解析，DOM 中出现 1 个可执行节点。", "textContent 把同一字符串放成文字，节点数从 1 变 0；原始字符仍可见。"]} />
    <div className={styles.choices} role="group" aria-label="选择渲染 API"><button type="button" onClick={() => { setSafe(false); scene.seek(1); }} aria-pressed={scene.step === 1 && !safe}>innerHTML（不安全）</button><button type="button" onClick={() => { setSafe(true); scene.seek(2); }} aria-pressed={scene.step === 2 && safe}><ShieldCheck size={16} />textContent（文字）</button></div>
    <div className={styles.contract}><div><FileCode size={25} /><h3>输入</h3><code>&lt;img onerror=…&gt;</code><p>不可信评论</p></div><ArrowRight size={20} /><div><Cube size={25} /><h3>DOM</h3><p>{domState}</p></div><ArrowRight size={20} /><div>{scene.step === 2 ? <ShieldCheck size={25} /> : <Warning size={25} />}<h3>可执行节点</h3><p>{executable}{scene.step === 0 ? "" : " 个"}</p></div></div>
    <p className={styles.inputExample}><strong>边界</strong>XSS 不只靠 script 标签；HTML、属性、URL 和脚本上下文各有编码规则。长度限制或把 SAST 告警归零，都不等于输出已经安全。</p>
  </div>;
}
