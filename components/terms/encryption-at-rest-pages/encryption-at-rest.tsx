"use client";

import { useState } from "react";
import { ArrowCounterClockwise, CheckCircle, Database, HardDrives, Key, LockKey, ShieldWarning, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EncryptionAtRestConcept.module.css";

const labels = ["写入数据", "包住 DEK", "模拟偷盘", "模拟冒用应用", "撤回 grant", "轮换版本"];
type KeyLayout = "separate" | "together";

const stages = [
  { stored: "100 rows · 明文", key: "尚未设计", threat: "等待攻击", result: "WAITING" },
  { stored: "100 rows · ciphertext", key: "DEK → wrapped", threat: "密钥链已分层", result: "ENCRYPTED" },
  { stored: "数据库 + backup", key: "KMS 不可达", threat: "盘被复制", result: "0 plaintext" },
  { stored: "ciphertext", key: "app grant = allow", threat: "应用身份被盗", result: "100 plaintext" },
  { stored: "ciphertext", key: "grant = revoked", threat: "解密请求被挡", result: "0 plaintext" },
  { stored: "new data · v2", key: "old backup · v1", threat: "版本可追踪", result: "ROTATED" },
] as const;

export function EncryptionAtRestLesson() {
  const scene = useScene(labels.length);
  const [layout, setLayout] = useState<KeyLayout>("separate");
  const current = stages[scene.step];
  const final = scene.step === labels.length - 1;
  const pass = final && layout === "separate";
  const weak = final && layout === "together";
  const reset = (next: () => void) => { next(); scene.seek(0); };
  const keyStatus = layout === "together" && scene.step >= 1 ? "KEK in app config" : current.key;
  const threatStatus = layout === "together" && scene.step >= 2 ? "data + key copied" : current.threat;

  return <div ref={scene.ref} className={styles.earLab} role="region" aria-label="静态加密工作台：切换分开存放或密钥跟着数据，观察偷盘、冒用应用和轮换的结果">
    <div className={styles.earLabHeader}><span>把“加密了”拆成数据和钥匙两条路径</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <div className={styles.earLabControls}><span>密钥怎么放</span><button type="button" aria-pressed={layout === "separate"} onClick={() => reset(() => setLayout("separate"))}>分开存放</button><button type="button" aria-pressed={layout === "together"} onClick={() => reset(() => setLayout("together"))}>密钥跟着数据</button></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.earLabGrid}>
      <section className={`${styles.earLabPanel} ${scene.step >= 0 ? styles.earPanelActive : ""}`}>
        <div className={styles.earLabEyebrow}><Database size={16} aria-hidden="true" /><span>保存的对象</span></div>
        <h3>{current.stored}</h3>
        <div className={styles.earLabRows}><div><span>数据库页</span><b>{scene.step === 0 ? "plain" : "cipher"}</b></div><div><span>备份文件</span><b>{scene.step >= 1 ? "cipher" : "same plain"}</b></div><div><span>数据版本</span><b>{scene.step >= 5 ? "v2 / v1" : "v1"}</b></div></div>
        <small>备份、快照和导出文件也属于“保存时”的范围，不能只给主数据库贴锁。</small>
      </section>
      <section className={`${styles.earLabPanel} ${scene.step >= 1 ? styles.earPanelActive : ""} ${weak ? styles.earPanelDanger : ""}`}>
        <div className={styles.earLabEyebrow}><Key size={16} aria-hidden="true" /><span>密钥路径</span></div>
        <h3>{keyStatus}</h3>
        <div className={styles.earLabRows}><div><span>DEK</span><b>{scene.step >= 1 ? "wrap" : "待生成"}</b></div><div><span>KEK</span><b className={layout === "together" && scene.step >= 1 ? styles.earBad : ""}>{layout === "together" && scene.step >= 1 ? "同处" : scene.step >= 1 ? "KMS" : "待定"}</b></div><div><span>授权</span><b className={scene.step === 4 ? styles.earBad : ""}>{scene.step === 4 ? "撤回" : scene.step >= 3 ? "allow" : "按需"}</b></div></div>
        <small>DEK 贴近数据方便使用，KEK 负责包住 DEK；真正的隔离来自两者不由同一份凭证控制。</small>
      </section>
      <section className={`${styles.earLabPanel} ${scene.step >= 2 ? styles.earPanelActive : ""} ${weak ? styles.earPanelDanger : pass ? styles.earPanelGood : ""}`}>
        <div className={styles.earLabEyebrow}>{weak || scene.step === 3 ? <WarningCircle size={16} aria-hidden="true" /> : pass ? <CheckCircle size={16} aria-hidden="true" /> : <ShieldWarning size={16} aria-hidden="true" />}<span>攻击与结论</span></div>
        <h3>{current.result}</h3>
        <div className={styles.earLabRows}><div><span>当前威胁</span><b className={scene.step === 3 || weak ? styles.earBad : ""}>{threatStatus}</b></div><div><span>明文离开存储层</span><b>{scene.step === 3 || weak ? "100 条" : scene.step >= 2 ? "0 条" : "未测"}</b></div><div><span>回滚/轮换</span><b>{scene.step >= 5 ? "v2 active" : "待处理"}</b></div></div>
        <div className={styles.earLabVerdict}>{!final ? "等待判断" : weak ? "WEAK · 密钥同处" : "PASS · 分层保护"}</div>
        <small>{!final ? "先观察数据怎么落盘，再分别试偷盘、冒用应用和撤权。" : weak ? "磁盘副本和解密钥匙一起被拿走，静态加密只剩一层外观。" : "盘被偷时没有 KEK，应用被撤权时也无法解密，版本还可以继续轮换。"}</small>
      </section>
    </div>
    <div className={styles.earLabRail}><div data-on={scene.step >= 0}><Database size={15} aria-hidden="true" /><span>写数据</span></div><div data-on={scene.step >= 1}><LockKey size={15} aria-hidden="true" /><span>包 DEK</span></div><div data-on={scene.step >= 2} data-danger={scene.step === 2}><HardDrives size={15} aria-hidden="true" /><span>偷磁盘</span></div><div data-on={scene.step >= 3} data-danger={scene.step === 3}><WarningCircle size={15} aria-hidden="true" /><span>冒用应用</span></div><div data-on={scene.step >= 4}><ShieldWarning size={15} aria-hidden="true" /><span>撤 grant</span></div><div data-on={scene.step >= 5} data-danger={weak}><Key size={15} aria-hidden="true" /><span>轮换 v2</span></div></div>
    <p className={`${styles.earLabNote} ${weak || scene.step === 3 ? styles.earPanelDanger : ""}`} role="status">{!final ? <><ArrowCounterClockwise size={17} aria-hidden="true" /><span>静态加密改变的是“存储介质看见什么”，密钥授权决定的是“谁能把它还原”。</span></> : weak ? <><WarningCircle size={17} aria-hidden="true" /><span>同一台机器同时保存密文和解密钥匙，偷走磁盘时两层保护一起失效。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>分开数据与密钥，按 grant 解密，给新写入记录密钥版本，三条证据才拼成完整的静态保护。</span></>}</p>
  </div>;
}
