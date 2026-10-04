"use client";

import { ArrowRight, Brain, CheckCircle, ChatCircleText, Database, Eraser, Funnel, MagnifyingGlass, PencilSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "../AiStackCoreConcepts.module.css";

const stages = [
  { label: "先问能不能记", title: "一句话还只是当前消息", detail: "等待明确同意" },
  { label: "写成一条记录", title: "只保存被允许的那一小条", detail: "source=user · scope=code" },
  { label: "新任务筛选", title: "从两条记录里命中一条", detail: "命中 1 / 2" },
  { label: "放进本轮输入", title: "模型这次才真的看见", detail: "context += memory[0]" },
  { label: "用户改正", title: "未来改用 Python", detail: "TypeScript → Python" },
  { label: "用户删除", title: "下一次不再自动带入", detail: "memory[0] = deleted" },
] as const;

export function AgentMemoryHero() {
  const scene = useScene(stages.length);
  const current = stages[scene.step];
  const saved = scene.step >= 1 && scene.step < stages.length - 1;
  const corrected = scene.step >= 4;
  const deleted = scene.step === stages.length - 1;
  const value = corrected ? "Python" : "TypeScript";

  return <figure ref={scene.ref} className={styles.memoryHero} data-step={scene.step} aria-label="一条代码偏好从当前消息变成可取回、可纠正、可删除的记忆记录">
    <div className={styles.memoryHeroHeader}><span>一条代码偏好 · 从消息到记录</span><strong>{current.detail}</strong></div>
    <SceneControls scene={scene} labels={stages.map(stage => stage.label)} />
    <div className={styles.memoryHeroFlow}>
      <div className={styles.memoryHeroMessage} data-active={scene.step === 0} data-done={scene.step > 0}>
        <div className={styles.memoryHeroEyebrow}><ChatCircleText size={18} aria-hidden="true" /><span>会话 A · 用户说</span></div>
        <strong>以后代码示例优先用 TypeScript。</strong>
        <p>{scene.step === 0 ? "当前回答可以参考；是否留下，要先问。" : "这句话已经说完，留下什么由用户决定。"}</p>
        <span className={styles.memoryHeroSeal} data-ok={scene.step > 0}>{scene.step === 0 ? "未写入" : "已获同意"}</span>
      </div>
      <ArrowRight className={styles.memoryHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.memoryHeroStore} data-active={scene.step === 1 || scene.step === 4 || scene.step === 5}>
        <div className={styles.memoryHeroEyebrow}><Database size={18} aria-hidden="true" /><span>应用管理的记忆库</span></div>
        <div className={styles.memoryHeroRecords}>
          <div className={styles.memoryHeroOtherRecord}><span>食谱偏好</span><code>少放盐</code></div>
          <div className={styles.memoryHeroRecord} data-active={saved} data-corrected={corrected} data-deleted={deleted}>
            <span className={styles.memoryHeroRecordIcon}>{deleted ? <Eraser size={16} aria-hidden="true" /> : corrected ? <PencilSimple size={16} aria-hidden="true" /> : saved ? <CheckCircle size={16} aria-hidden="true" /> : <WarningCircle size={16} aria-hidden="true" />}</span>
            <span><strong>{deleted ? "这条记录已删除" : saved ? `代码示例用 ${value}` : "待确认，不写入"}</strong><small>{deleted ? "未来取回：已阻断" : saved ? "source=user · scope=code" : "当前消息 · 尚未写入"}</small></span>
          </div>
        </div>
        <div className={styles.memoryHeroStoreMeta}><span>{deleted ? "1 条仍保留" : saved ? "2 条记录" : "等待写入"}</span><span>{deleted ? "可重新说明" : "可纠正 · 可删除"}</span></div>
      </div>
      <ArrowRight className={styles.memoryHeroArrow} size={24} aria-hidden="true" />
      <div className={styles.memoryHeroRequest} data-active={scene.step >= 2 && scene.step <= 3}>
        <div className={styles.memoryHeroEyebrow}><Brain size={18} aria-hidden="true" /><span>会话 B · 当前任务</span></div>
        <strong>请给我一个登录接口示例。</strong>
        <div className={styles.memoryHeroFilter} data-visible={scene.step >= 2 && !deleted}><Funnel size={15} aria-hidden="true" /><span>{deleted ? "已删除 · 没有可用记录" : scene.step >= 2 ? "代码范围命中 1 条" : "尚未筛选记录"}</span></div>
        <div className={styles.memoryHeroInserted} data-visible={scene.step >= 3 && !deleted}><span>本轮输入</span><code>{scene.step >= 3 && !deleted ? `language = ${value}` : "等待取回"}</code></div>
        <div className={styles.memoryHeroAnswer} data-visible={scene.step >= 3}><span>{deleted ? "下一次回答" : "已经生成的回答"}</span><strong>{deleted ? "需重新说明语言偏好" : scene.step >= 4 ? "TypeScript 示例（已生成）" : "TypeScript 示例"}</strong></div>
      </div>
      <span className={styles.memoryHeroPacket} data-running={scene.playing} aria-hidden="true" />
    </div>
    <div className={styles.memoryHeroResult} data-danger={deleted} role="status">
      {deleted ? <WarningCircle size={19} aria-hidden="true" /> : <MagnifyingGlass size={19} aria-hidden="true" />}
      <span><strong>{current.title}</strong> · {deleted ? "删除只影响之后的取回，已经生成的 TypeScript 回复不会倒写。" : scene.step === 0 ? "保存之前，下一次会话拿不到这句话。" : scene.step === 1 ? "记录已保存，下一步按代码范围取回。" : scene.step === 2 ? "命中记录还只是应用手里的结果，尚未进入模型输入。" : scene.step === 3 ? "只有显式放进本轮输入，偏好才会改变回答。" : "记录的变化留在未来，过去的回答保持当时的样子。"}</span>
    </div>
    <figcaption>应用先决定保存什么，再把合适的记录放进这一轮输入；模型只看见这一次收到的材料。</figcaption>
  </figure>;
}
