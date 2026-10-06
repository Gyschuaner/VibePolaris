"use client";

import { Bell, Browser, Database, Key, Lightning, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useScene } from "../HarnessStoryScenes";
import { MechanismFrame, mechanismStyles as styles } from "../ConceptMechanismHeroRuntime";

const labels = ["同源分盒", "A 写入主题", "换一个 origin", "显式序列化", "记住它的边界"];
const captions = [
  "标签页 A、B 的协议、主机和端口相同，所以它们指向同一只 origin 罐子。",
  "A 写入 theme=dark；B 是另一份同源文档，可以听到 storage 变化。",
  "把 B 换到 admin.example，钥匙罐随 origin 换了；它不会收到 shop.example 的铃声。",
  "localStorage 只收字符串；对象要先序列化，读回来再解析。",
  "它是同步的小盒子，不是密码保险箱、消息队列或数据库。",
];

export function LocalStorageHero() {
  const scene = useScene(labels.length);
  const [otherOrigin, setOtherOrigin] = useState(false);
  const [serialized, setSerialized] = useState(false);
  const step = scene.step;
  const isolated = otherOrigin || step === 2;
  const asString = serialized || step >= 3;
  return <MechanismFrame scene={scene} title="两个标签页共用哪一只钥匙罐" labels={labels} caption={captions[step]}>
    <div className={styles.storageScene}>
      <div className={styles.storageTab}><div className={styles.storageTabHead}><Browser size={15} />TAB A</div><div className={styles.storageTabCard}><strong>shop.example</strong><div className={styles.storageKey}><Key size={13} />theme = dark</div><small>setItem()</small></div></div>
      <div className={styles.storageJar}><div className={styles.storageJarHead}><Database size={15} />ORIGIN JAR</div><div className={styles.storageJarBody}><strong>{isolated ? "admin.example" : "shop.example"}</strong><div className={styles.storageKey} data-value={asString ? "string" : "object"}>{asString ? 'prefs = "{…}"' : "prefs = {…}"}</div><small>{asString ? "字符串 · JSON" : "按 origin 隔离"}</small></div></div>
      <div className={styles.storageTab}><div className={styles.storageTabHead}><Browser size={15} />TAB B</div><div className={styles.storageTabCard}><strong>{isolated ? "admin.example" : "shop.example"}</strong><div className={styles.storageKey}><Key size={13} />{isolated ? "自己的盒子" : step >= 1 ? "收到 dark" : "等待变化"}</div><small>{isolated ? "另一来源" : "storage event"}</small></div></div>
      <div className={styles.storageEvent} role="status"><span className={styles.storageSignal} />{isolated ? <><WarningCircle size={16} /><strong>没有跨 origin 的铃声</strong></> : step >= 1 ? <><Bell size={16} /><strong>B 收到 storage event</strong></> : <><Lightning size={16} /><strong>先写入，再观察谁听见</strong></>}<button type="button" onClick={() => { setOtherOrigin(value => !value); scene.seek(2); }}>{isolated ? "回到 shop.example" : "换到 admin.example"}</button><button type="button" onClick={() => { setSerialized(value => !value); scene.seek(3); }}>{asString ? "对象已序列化" : "序列化对象"}</button></div>
    </div>
  </MechanismFrame>;
}
