"use client";

import { ArrowRight, CheckCircle, Clock, Code, Flask, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./UnitTestConcept.module.css";

const steps = [
  { label: "准备样本", title: "先把边界输入摆在桌上", detail: "-1、0、100、101 各自对应一个可判定的预期。", Icon: Flask },
  { label: "固定依赖", title: "把会漂移的时间锁住", detail: "日期由测试注入，不跟着今天的系统时间走。", Icon: Clock },
  { label: "调用单元", title: "只让这段规则接受一次调用", detail: "priceAfterDiscount 读到输入和时钟，返回结果或错误。", Icon: Code },
  { label: "检查行为", title: "断言外部看得见的结果", detail: "三个数值和一个预期错误都能自动判定。", Icon: CheckCircle },
  { label: "保住契约", title: "内部换了写法，测试仍然成立", detail: "if 改成规则表，输入输出契约没有变。", Icon: CheckCircle },
];

const cases = ["-1", "0", "100", "101"];

export function UnitTestHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const fixed = scene.step >= 1;
  const ran = scene.step >= 2;
  const asserted = scene.step >= 3;

  return <figure ref={scene.ref} className={styles.unitHero} data-step={scene.step} aria-label="单元测试如何准备输入、固定依赖、运行小单元并断言可观察行为">
    <div className={styles.unitHeroHeader}><span>把一条折扣规则搬进小型测试实验室</span><strong>arrange → act → assert</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.unitHeroBoard}>
      <div className={styles.unitHeroCases} data-active={scene.step === 0 || scene.step === 3}>
        <div className={styles.unitHeroLabel}><Flask size={17} aria-hidden="true" /><span>测试样本</span></div>
        <h3>priceAfterDiscount</h3>
        <div className={styles.unitHeroCaseGrid}>{cases.map((value, index) => <div key={value} className={styles.unitHeroCase} data-active={scene.step === 0 && index === 2} data-done={asserted}><span>{value}</span><small>{value === "-1" ? "RangeError" : value === "0" ? "0" : value === "100" ? "90" : "90.9"}</small></div>)}</div>
        <small>四个输入，四种可观察结果</small>
      </div>
      <div className={styles.unitHeroArrow} aria-hidden="true"><span /><ArrowRight size={21} /></div>
      <div className={styles.unitHeroUnit} data-active={ran}>
        <div className={styles.unitHeroLabel}><Code size={17} aria-hidden="true" /><span>被测单元</span></div>
        <h3>priceAfterDiscount()</h3>
        <code>{ran ? "input → rule table → output" : "等待一组输入"}</code>
        <div className={styles.unitHeroDependency} data-danger={!fixed}><Clock size={15} aria-hidden="true" /><span>{fixed ? "clock = 2026-08-31" : "clock = system today"}</span></div>
        <small>{fixed ? "依赖已被测试控制" : "日期会让结果随环境漂移"}</small>
      </div>
      <div className={styles.unitHeroArrow} aria-hidden="true"><span /><ArrowRight size={21} /></div>
      <div className={styles.unitHeroResult} data-active={asserted} data-danger={scene.step === 2 && !fixed}>
        <div className={styles.unitHeroLabel}><CheckCircle size={17} aria-hidden="true" /><span>断言</span></div>
        <h3>{asserted ? "契约可判定" : "等待结果"}</h3>
        <div className={styles.unitHeroProof}><strong>{asserted ? "3 pass · 1 expected error" : "—"}</strong><small>{asserted ? "只检查返回值和错误类型" : "还没有运行单元"}</small></div>
        <div className={styles.unitHeroSignal} data-danger={scene.step === 2 && !fixed}>{scene.step === 2 && !fixed ? <><WarningCircle size={15} aria-hidden="true" />今天不同，结果可能不同</> : scene.step === 4 ? <><CheckCircle size={15} aria-hidden="true" />内部改写仍保持通过</> : "不读取私有变量"}</div>
      </div>
    </div>
    <div className={styles.unitHeroMetrics}>
      <div><span>输入样本</span><strong>{scene.step === 0 ? "待运行" : "4 cases"}</strong></div>
      <div><span>依赖状态</span><strong>{fixed ? "固定" : "会漂移"}</strong></div>
      <div><span>反馈速度</span><strong>{asserted ? "可重复" : "毫秒级"}</strong></div>
    </div>
    <div className={styles.unitHeroStatus} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>单元测试把一小段行为放进可重复的实验室：输入、依赖和预期都写在桌面上，失败时能直接指向这段规则，而不是让整套系统陪着猜。</figcaption>
  </figure>;
}
