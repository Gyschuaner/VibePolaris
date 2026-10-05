"use client";

import { useState } from "react";
import { ArrowRight, Brain, CheckCircle, Eye, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./TransformerConcept.module.css";

const labels = ["看见一排 token", "建立关系", "各自改写", "检查边界"];
const tokens = ["小猫", "坐在", "窗边", "它", "看见", "雨"];

export function TransformerLesson() {
  const scene = useScene(labels.length);
  const [animal, setAnimal] = useState<"小猫" | "小狗">("小猫");
  const [missingSubject, setMissingSubject] = useState(false);
  const subject = missingSubject ? "主语缺失" : animal;
  const relationReady = !missingSubject && scene.step >= 1;

  return <div ref={scene.ref} className={styles.transformerLab} role="region" aria-label="Transformer 逐层改写 token 的工作台">
    <div className={styles.transformerLabHeader}><span>把一句话送进两层示意块</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.transformerLabTokens} aria-label="当前句子的 token">
      {tokens.map((token) => <div key={token} className={styles.transformerLabToken} data-focus={scene.step >= 1 && (token === "它" || token === "看见" || token === "雨" || token === animal)} data-missing={token === "小猫" && missingSubject}>
        <strong>{token === "小猫" && missingSubject ? "···" : token}</strong><small>{token === "它" ? "代词" : token === "小猫" ? "主语" : "token"}</small>
      </div>)}
    </div>
    <div className={styles.transformerLabBoard}>
      <div className={styles.transformerLabPanel} data-active={scene.step === 0} aria-hidden={scene.step < 0}>
        <h3>一开始</h3>
        <p>每个位置只有自己的输入表示，还没有把“它”指向谁写进来。</p>
        <div className={styles.transformerLabRoles}><span className={styles.transformerLabRole}>位置</span><span className={styles.transformerLabRole}>token</span></div>
      </div>
      <div className={styles.transformerLabPanel} data-active={scene.step === 1}>
        <h3>自注意力</h3>
        <p>查询一个位置时，从同一序列的其他位置取回有用的信息。</p>
        <div className={styles.transformerLabEdges}>
          <div className={styles.transformerLabEdge} data-missing={missingSubject}><span>它</span><ArrowRight size={14} aria-hidden="true" /><span>{relationReady ? subject : "等待关系"}</span><small>{relationReady ? "关系" : "—"}</small></div>
          <div className={styles.transformerLabEdge}><span>看见</span><ArrowRight size={14} aria-hidden="true" /><span>雨</span><small>{scene.step >= 1 ? "场景" : "—"}</small></div>
        </div>
      </div>
      <div className={styles.transformerLabPanel} data-active={scene.step >= 2}>
        <h3>前馈与残差</h3>
        <p>关系信息混进来后，每个位置用同一套局部变换继续更新，并保留一条原表示的路。</p>
        <div className={styles.transformerLabOutput} aria-label="表示维度示意">
          <div className={styles.transformerLabOutputRow}><span><b>主体线索</b><em>{missingSubject ? "空" : subject}</em></span><i /></div>
          <div className={styles.transformerLabOutputRow}><span><b>动作线索</b><em>看见</em></span><i /></div>
          <div className={styles.transformerLabOutputRow}><span><b>场景线索</b><em>窗边 · 雨</em></span><i /></div>
        </div>
      </div>
    </div>
    <div className={styles.transformerLabActions} role="group" aria-label="改变输入条件">
      <button type="button" className={styles.transformerLabButton} aria-pressed={animal === "小猫"} onClick={() => { setAnimal("小猫"); setMissingSubject(false); }}>主语：小猫</button>
      <button type="button" className={styles.transformerLabButton} aria-pressed={animal === "小狗"} onClick={() => { setAnimal("小狗"); setMissingSubject(false); }}>主语：小狗</button>
      <button type="button" className={styles.transformerLabButton} aria-pressed={missingSubject} onClick={() => setMissingSubject(value => !value)}>拿掉主语</button>
    </div>
    <p className={styles.transformerLabNote} data-danger={missingSubject && scene.step >= 1} role="status">
      {missingSubject && scene.step >= 1 ? <><WarningCircle size={17} aria-hidden="true" /><span>关系没有凭空出现：句子缺少可供连接的主语，演示把“主语缺失”保留下来。</span></> : scene.step < 1 ? <><Eye size={17} aria-hidden="true" /><span>先看输入的形状；此时还不能把 token 卡片当成已经理解了整句话。</span></> : scene.step === 1 ? <><Brain size={17} aria-hidden="true" /><span>注意力只说明信息交换发生在哪里；高亮关系不是可直接阅读的解释，也不是事实校验。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>多一层只表示又一次变换；最终得到的是各位置的表示，能否回答任务还要看训练目标和后续头部。</span></>}
    </p>
  </div>;
}
