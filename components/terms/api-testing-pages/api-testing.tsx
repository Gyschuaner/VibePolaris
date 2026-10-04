"use client";

import { useState, type CSSProperties } from "react";
import { ArrowCounterClockwise, CheckCircle, Database, Key, ShieldWarning, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./ApiTestingConcept.module.css";

const labels = ["发出创建", "核对回执", "查服务端状态", "重试原请求", "换身份读取", "合并判断"];
type Standard = "response" | "joint";

const steps = [
  { status: "等待", response: "还没发请求", state: "0 rows", auth: "未检查" },
  { status: "201", response: "orderId:string", state: "0 rows", auth: "未检查" },
  { status: "201", response: "schema ✓", state: "1 row", auth: "未检查" },
  { status: "200", response: "same orderId", state: "1 row", auth: "未检查" },
  { status: "403", response: "access denied", state: "1 row", auth: "B blocked" },
  { status: "3 cases", response: "201 · 200 · 403", state: "1 row", auth: "B blocked" },
] as const;

export function ApiTestingLesson() {
  const scene = useScene(labels.length);
  const [standard, setStandard] = useState<Standard>("response");
  const current = steps[scene.step];
  const final = scene.step === labels.length - 1;
  const jointPass = final && standard === "joint";
  const weak = final && standard === "response";
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const responseMeter = scene.step >= 1 ? 100 : 0;
  const stateMeter = scene.step >= 2 ? 100 : 0;
  const authMeter = scene.step >= 4 ? 100 : 0;

  return <div ref={scene.ref} className={styles.apiLab} role="region" aria-label="API 测试双账本工作台：切换完成标准，查看响应和服务端状态是否同时被检查">
    <div className={styles.apiLabHeader}><span>把一次接口调用拆成可复核的证据</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.apiLabControls}><div><span>什么才算通过</span><button type="button" aria-pressed={standard === "response"} onClick={() => reset(() => setStandard("response"))}>只看响应</button><button type="button" aria-pressed={standard === "joint"} onClick={() => reset(() => setStandard("joint"))}>响应 + 状态</button></div></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.apiLabGrid}>
      <section className={`${styles.apiLabPanel} ${scene.step >= 1 ? styles.apiActive : ""}`}>
        <div className={styles.apiEyebrow}><ShieldWarning size={16} aria-hidden="true" /><span>响应账本</span></div>
        <h3>{current.status} · {current.response}</h3>
        <div className={styles.apiLabMeter}><span>状态码</span><i style={{ "--meter": `${responseMeter}%` } as CSSProperties} /><b>{scene.step >= 1 ? "已核对" : "待发送"}</b></div>
        <div className={styles.apiLabMeter}><span>字段形状</span><i style={{ "--meter": `${responseMeter}%` } as CSSProperties} /><b>{scene.step >= 2 ? "符合" : "待核对"}</b></div>
        <small>OpenAPI 把成功响应和已知错误都写进操作的期待里。</small>
      </section>
      <section className={`${styles.apiLabPanel} ${scene.step >= 2 ? styles.apiActive : ""}`}>
        <div className={styles.apiEyebrow}><Database size={16} aria-hidden="true" /><span>状态账本</span></div>
        <h3>orders · {current.state}</h3>
        <div className={styles.apiLabMeter}><span>写入</span><i style={{ "--meter": `${stateMeter}%` } as CSSProperties} /><b>{scene.step >= 2 ? "1 row" : "未查"}</b></div>
        <div className={styles.apiLabMeter}><span>重复</span><i style={{ "--meter": `${scene.step >= 3 ? 100 : 0}%` } as CSSProperties} /><b>{scene.step >= 3 ? "仍为 1" : "待重试"}</b></div>
        <small>响应成功之后还要读一次状态，确认接口没有悄悄多写或少写。</small>
      </section>
      <section className={`${styles.apiLabPanel} ${scene.step >= 4 ? styles.apiActive : ""} ${weak ? styles.apiDanger : jointPass ? styles.apiGood : ""}`}>
        <div className={styles.apiEyebrow}><UserCircle size={16} aria-hidden="true" /><span>身份账本</span></div>
        <h3>{current.auth}</h3>
        <div className={styles.apiLabMeter}><span>用户 B</span><i style={{ "--meter": `${authMeter}%` } as CSSProperties} /><b>{scene.step >= 4 ? "已挡住" : "待换身份"}</b></div>
        <div className={styles.apiLabVerdict}>{!final ? "等待判断" : weak ? "WEAK · 只看响应" : "PASS · 联合断言"}</div>
        <small>{!final ? "把成功、重试和越权放进同一条回归路径。" : weak ? "接口看起来绿了，副作用和授权仍没有进入完成标准。" : "每组请求都有响应与状态的可观察期待。"}</small>
      </section>
    </div>
    <div className={styles.apiLabRail}><div data-on={scene.step >= 0}><Key size={15} aria-hidden="true" /><span>写期待</span></div><div data-on={scene.step >= 1}><ShieldWarning size={15} aria-hidden="true" /><span>看回执</span></div><div data-on={scene.step >= 2}><Database size={15} aria-hidden="true" /><span>查状态</span></div><div data-on={scene.step >= 3}><ArrowCounterClockwise size={15} aria-hidden="true" /><span>重试</span></div><div data-on={scene.step >= 4}><UserCircle size={15} aria-hidden="true" /><span>换身份</span></div><div data-on={scene.step >= 5} data-danger={weak}><CheckCircle size={15} aria-hidden="true" /><span>定结论</span></div></div>
    <p className={`${styles.apiLabNote} ${weak ? styles.apiDanger : ""}`} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>接口测试不是给状态码盖章，而是为一次请求收集能解释结果的证据。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>200 或 201 只说明一张账本；把副作用和身份检查加进来再下结论。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>响应、状态和授权都对上了，测试才知道这次请求为什么通过。</span></>}</p>
  </div>;
}
