"use client";

import { ArrowRight, CheckCircle, Clock, Database, HardDrives, Key, LockKey, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./EncryptionAtRestConcept.module.css";

const steps = [
  { label: "写入资料", title: "先看清数据会落在哪里", detail: "客户账单会出现在数据库页、备份文件和缓存副本里，保护范围要从威胁开始画。" },
  { label: "包住密钥", title: "数据密钥和密钥加密密钥分开", detail: "DEK 加密数据，KEK 只包住 DEK；KEK 留在中心密钥服务，不跟着文件走。" },
  { label: "盘被拿走", title: "只有存储介质时，看见的是密文", detail: "数据库页和备份一起被复制，拿不到 KMS 授权，攻击者得到 0 条明文。" },
  { label: "应用被冒用", title: "有解密权限的应用仍能读明文", detail: "静态加密保护的是存储层；被盗的应用身份若还有 grant，解密请求仍会成功。" },
  { label: "撤掉授权", title: "把解密门关上，旧密文不会自动消失", detail: "撤回应用的 KMS grant 后，同一份数据还在，但读取停在密钥服务。" },
  { label: "轮换密钥", title: "新写入用新版本，旧备份留旧钥匙", detail: "密钥版本和数据记录一起管理，轮换是生命周期动作，不是把磁盘重新涂一遍。" },
];

function storageState(step: number) {
  if (step === 0) return { data: "100 rows · 明文", key: "同一磁盘", result: "可直接读", tone: "danger" };
  if (step === 1) return { data: "100 rows · AES-GCM", key: "DEK wrapped by KEK", result: "密文落盘", tone: "good" };
  if (step === 2) return { data: "100 rows · ciphertext", key: "KMS · no grant", result: "0 plaintext", tone: "good" };
  if (step === 3) return { data: "100 rows · ciphertext", key: "app grant · allow", result: "100 plaintext", tone: "danger" };
  if (step === 4) return { data: "100 rows · ciphertext", key: "KMS · DENY", result: "0 plaintext", tone: "good" };
  return { data: "new rows · key v2", key: "old backup · key v1", result: "versioned", tone: "good" };
}

export function EncryptionAtRestHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const state = storageState(scene.step);
  const blocked = scene.step === 2 || scene.step === 4;
  const exposed = scene.step === 0 || scene.step === 3;
  const complete = scene.step === steps.length - 1;

  return <figure ref={scene.ref} className={styles.earHero} data-step={scene.step} aria-label="静态加密怎样把数据、数据密钥和密钥服务分开，并在不同攻击下改变结果">
    <div className={styles.earHeroHeader}><span>一份账单，三种落盘风险</span><strong>data → DEK → KEK</strong></div>
    <SceneControls scene={scene} labels={steps.map((step) => step.label)} />
    <div className={styles.earHeroCanvas}>
      <section className={`${styles.earDataCard} ${scene.step <= 1 ? styles.earActive : ""}`}>
        <div className={styles.earEyebrow}><Database size={17} aria-hidden="true" /><span>存储对象 · billing.db</span></div>
        <h3>客户账单</h3>
        <div className={`${styles.earPayload} ${state.data.includes("明文") ? styles.earPlain : styles.earCipher}`}><span>{state.data}</span><code>{state.data.includes("明文") ? "email · amount · address" : "7f1a…c902 · tag"}</code></div>
        <div className={styles.earCopies}><span><HardDrives size={14} aria-hidden="true" />数据库页</span><span><Database size={14} aria-hidden="true" />备份文件</span></div>
        <small>“在磁盘上加密”描述的是保存时的状态，不会自动覆盖已经离开存储层的明文副本。</small>
      </section>

      <div className={styles.earArrow} aria-hidden="true"><ArrowRight size={22} /><span>wrap</span></div>

      <section className={styles.earKeyCard}>
        <div className={styles.earEyebrow}><Key size={17} aria-hidden="true" /><span>密钥链 · key hierarchy</span></div>
        <div className={`${styles.earKeyNode} ${scene.step >= 1 ? styles.earKeyOn : ""}`}><LockKey size={18} aria-hidden="true" /><div><strong>DEK</strong><small>加密每份账单数据</small></div><b>{scene.step >= 1 ? "wrapped" : "plain?"}</b></div>
        <div className={styles.earKeyLink}><i /><span>由 KEK 包住</span><i /></div>
        <div className={`${styles.earKmsNode} ${scene.step >= 1 ? styles.earKeyOn : ""}`}><ShieldCheck size={18} aria-hidden="true" /><div><strong>KEK · KMS</strong><small>{scene.step >= 5 ? "key v2 active" : "不离开密钥服务"}</small></div><b>{scene.step === 4 ? "DENY" : scene.step >= 1 ? "grant" : "wait"}</b></div>
        <div className={styles.earKeyMeta}><span><Clock size={14} aria-hidden="true" />{scene.step >= 5 ? "rotation ready" : "lifecycle tracked"}</span><span><Key size={14} aria-hidden="true" />{scene.step >= 4 ? "grant reviewed" : "grant pending"}</span></div>
      </section>

      <div className={styles.earArrow} aria-hidden="true"><ArrowRight size={22} /><span>read</span></div>

      <section className={`${styles.earThreatCard} ${state.tone === "danger" ? styles.earThreatDanger : styles.earThreatGood}`}>
        <div className={styles.earEyebrow}>{exposed ? <WarningCircle size={17} aria-hidden="true" /> : complete ? <CheckCircle size={17} aria-hidden="true" /> : <ShieldCheck size={17} aria-hidden="true" />}<span>{scene.step === 3 ? "被盗应用身份" : scene.step === 2 ? "被盗存储介质" : "访问结果"}</span></div>
        <strong>{state.result}</strong>
        <code>{state.key}</code>
        <div className={styles.earThreatRows}><span>明文离开存储层</span><b>{scene.step === 3 ? "100 条" : scene.step >= 1 && !exposed ? "0 条" : "未保护"}</b><span>密钥请求</span><b>{scene.step === 3 ? "allow" : scene.step === 4 ? "deny" : scene.step >= 2 ? "无授权" : "同处"}</b></div>
        <small>{scene.step === 3 ? "静态加密挡不住已经被授权的应用读出明文。" : scene.step === 4 ? "数据还在，撤权让解密请求停在 KMS。" : complete ? "新写入与旧备份各自带着可追踪的密钥版本。" : blocked ? "攻击者缺少另一半钥匙，密文无法直接还原。" : "先把保存对象和密钥的去处分开。"}</small>
      </section>
    </div>
    <div className={styles.earHeroMetrics}><div><span>存储状态</span><strong>{scene.step === 0 ? "明文" : "密文"}</strong></div><div><span>DEK</span><strong>{scene.step >= 1 ? "已包裹" : "未处理"}</strong></div><div><span>KMS grant</span><strong>{scene.step === 4 ? "撤回" : scene.step === 3 ? "可用" : scene.step >= 1 ? "按需" : "同处"}</strong></div><div><span>生命周期</span><strong>{complete ? "v2 active" : scene.step >= 4 ? "可轮换" : "待设计"}</strong></div></div>
    <div className={`${styles.earHeroStatus} ${state.tone === "danger" ? styles.earStatusDanger : styles.earStatusGood}`} role="status"><span>{exposed ? <WarningCircle size={19} aria-hidden="true" /> : complete ? <CheckCircle size={19} aria-hidden="true" /> : <ShieldCheck size={19} aria-hidden="true" />}</span><strong>{current.title}</strong><span>· {current.detail}</span></div>
    <figcaption>静态加密把存储介质上的明文换成密文；真正决定谁能还原它的，是另一条密钥与授权链。</figcaption>
  </figure>;
}
