"use client";

import { Browser, CheckCircle, Cloud, HardDrives, LockKey, Network, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { Fragment } from "react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EncryptionInTransitConcept.module.css";

const frames = [
  { label: "请求待出发", segmentStates: ["idle", "idle", "idle"], packet: "Authorization: Bearer …", packetNote: "明文待保护", result: "0 B 已发送", resultNote: "先把路径和端点画出来。", tone: "danger", stage: "WAIT" },
  { label: "握手协商", segmentStates: ["handshake", "idle", "idle"], packet: "ClientHello · ServerHello", packetNote: "版本 / cipher / key share", result: "握手中", resultNote: "应用数据还不能抢跑。", tone: "neutral", stage: "NEGOTIATE" },
  { label: "三段都加密", segmentStates: ["secure", "secure", "secure"], packet: "GET /orders · TLS record", packetNote: "抓包只见 ciphertext", result: "200 · 3 / 3", resultNote: "三段链路各自有 TLS。", tone: "good", stage: "SECURE" },
  { label: "CDN 终止 TLS", segmentStates: ["secure", "clear", "secure"], packet: "Authorization: Bearer …", packetNote: "CDN → LB 可见", result: "200 · 2 / 3", resultNote: "外层有锁，不代表下一跳也有锁。", tone: "danger", stage: "LEAK" },
  { label: "证书对不上", segmentStates: ["secure", "blocked", "idle"], packet: "GET /orders · 未发送", packetNote: "SAN ≠ lb.internal", result: "BLOCKED · 0 B", resultNote: "身份不匹配时停在握手。", tone: "danger", stage: "STOP" },
  { label: "重新建立下一跳", segmentStates: ["secure", "secure", "secure"], packet: "GET /orders · TLS record", packetNote: "抓包只见 ciphertext", result: "200 · 3 / 3", resultNote: "每段都验证身份，再让数据继续。", tone: "good", stage: "PASS" },
] as const;

const nodes = [
  { label: "浏览器", detail: "orders.example", Icon: Browser },
  { label: "CDN", detail: "edge-1", Icon: Cloud },
  { label: "负载均衡", detail: "lb.internal", Icon: Network },
  { label: "应用", detail: "orders-api", Icon: HardDrives },
];

const segmentLabels = ["A · 公网", "B · 内部", "C · 到应用"];

export function EncryptionInTransitHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const secureCount = current.segmentStates.filter((state) => state === "secure").length;
  const danger = current.tone === "danger";
  const good = current.tone === "good";

  return <figure ref={scene.ref} className={styles.eitHero} data-step={scene.step} aria-label="传输中加密怎样逐段建立 TLS、验证服务身份并保护应用请求">
    <div className={styles.eitHeroHeader}><span>一笔订单，三段链路，三次保护判断</span><strong>{current.stage} · {secureCount} / 3 TLS</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.eitRoute} aria-label="浏览器到应用的三段传输路径">
      {nodes.map(({ label, detail, Icon }, index) => <Fragment key={label}>
        <div className={styles.eitNode} data-active={index === scene.step % nodes.length || scene.step >= 2}><Icon size={22} aria-hidden="true" /><span>{label}</span><strong>{detail}</strong><small>{index === 0 ? "请求发起" : index === nodes.length - 1 ? "明文端点" : "TLS 终止 / 重建"}</small></div>
        {index < segmentLabels.length && <div className={styles.eitLink} data-state={current.segmentStates[index]}><span /><b>{segmentLabels[index]}</b><small>{current.segmentStates[index] === "secure" ? "TLS record" : current.segmentStates[index] === "handshake" ? "handshake" : current.segmentStates[index] === "clear" ? "HTTP 明文" : current.segmentStates[index] === "blocked" ? "SAN mismatch" : "未建立"}</small></div>}
      </Fragment>)}
    </div>
    <div className={styles.eitPacket} data-danger={danger}><LockKey size={18} aria-hidden="true" /><code>{current.packet}</code><span>{current.packetNote}</span></div>
    <div className={styles.eitObservations}><div><span>抓包者能看到</span><strong>{current.packetNote}</strong></div><div><span>应用端点收到</span><strong>{scene.step === 4 ? "没有请求" : scene.step >= 2 ? "HTTP（端点明文）" : "尚未到达"}</strong></div><div><span>本帧结果</span><strong>{current.result}</strong></div></div>
    <div className={styles.eitHeroStatus} data-danger={danger} data-good={good} role="status">{danger ? <WarningCircle size={18} aria-hidden="true" /> : good ? <CheckCircle size={18} aria-hidden="true" /> : <ShieldCheck size={18} aria-hidden="true" />}<span><strong>{current.label}</strong> · {current.resultNote}</span></div>
    <figcaption>锁只覆盖一段由两个端点建立的 TLS 通道；经过 CDN 或负载均衡器解密后，下一跳要重新检查协议、证书和明文出现的位置。</figcaption>
  </figure>;
}
