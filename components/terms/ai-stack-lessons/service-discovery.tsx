"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Database, Globe } from "@phosphor-icons/react";
import { useScene } from "../HarnessStoryScenes";
import { Caption } from "../AiStackConceptLessonShared";
import styles from "../ConceptArticle.module.css";

export function ServiceDiscoveryLesson() {
  const scene = useScene(4);
  const [bHealthy, setBHealthy] = useState(true);
  const [cacheFresh, setCacheFresh] = useState(true);
  useEffect(() => {
    if (scene.step === 0 || scene.step === 1) { setBHealthy(true); setCacheFresh(true); }
    if (scene.step === 2) { setBHealthy(false); setCacheFresh(false); }
    if (scene.step === 3) { setBHealthy(false); setCacheFresh(true); }
  }, [scene.step]);
  const registry = ["10.0.0.3", ...(scene.step >= 1 ? ["10.0.0.4"] : [])];
  if (bHealthy) registry.unshift("10.0.0.2");
  const cached = cacheFresh ? registry : ["10.0.0.2", "10.0.0.3", "10.0.0.4"];
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="服务发现注册表演示">
    <Caption scene={scene} labels={["注册 A、B", "上线 C", "B 心跳超时", "TTL 到期查询"]} titles={["服务名指向候选端点", "扩容只增加映射", "健康状态改变映射", "缓存刷新后返回健康端点"]} copy={["调用方只记住 orders；注册表当前有 .2 和 .3。", "C 上线后候选地址从 2 个变成 3 个，调用方不必改代码。", "B 没有健康心跳，注册表把 .2 标为不可用；旧缓存仍可能短暂显示 stale。", "TTL 30 秒到期后，orders 只解析到当前健康端点 .3 和 .4。"]} />
    <div className={styles.choices} role="group" aria-label="模拟服务健康状态"><button type="button" onClick={() => { setBHealthy(true); setCacheFresh(true); scene.seek(0); }} aria-pressed={bHealthy}>B 健康</button><button type="button" onClick={() => { setBHealthy(false); setCacheFresh(false); scene.seek(2); }} aria-pressed={!bHealthy}>B 心跳超时</button></div>
    <div className={styles.contract}><div><Database size={26} /><h3>orders 注册表</h3><p>TTL（缓存保留时间）：30 秒 · 健康检查：心跳</p><div className={styles.choices}>{registry.map((address) => <span key={address} className={styles.code}>{address}</span>)}</div></div><div><Globe size={26} /><h3>调用方查询</h3><p>{cacheFresh ? "缓存已刷新" : "缓存未到期，仍返回旧候选"}</p><div className={styles.resultFlow}><span>orders</span><ArrowRight size={18} /><strong>{cached.join(" / ")}</strong></div></div></div>
    <p className={styles.inputExample}><strong>边界</strong>发现只提供当前候选位置；由客户端、代理或服务网格决定具体请求如何分配，权限检查仍在调用边界完成。</p>
  </div>;
}
