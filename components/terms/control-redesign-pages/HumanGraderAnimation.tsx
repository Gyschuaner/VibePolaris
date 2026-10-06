"use client";

import { useState } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./HumanGraderAnimation.module.css";

type ReviewCase = "agree" | "split" | "missing";

const cases: Record<ReviewCase, {
  scores: [string, string];
  drawer: string;
  drawerNote: string;
  result: string;
}> = {
  agree: {
    scores: ["4 / 5", "4 / 5"],
    drawer: "共同理由",
    drawerNote: "两位评审指向同一证据",
    result: "一致，保留两人的共同理由",
  },
  split: {
    scores: ["4 / 5", "2 / 5"],
    drawer: "第三人 3 / 5",
    drawerNote: "把分歧写回校准样例",
    result: "分歧进入校准，不直接取高分",
  },
  missing: {
    scores: ["未评分", "未评分"],
    drawer: "等待证据",
    drawerNote: "支付状态缺失，暂不下结论",
    result: "证据不足，封存为 unscored",
  },
};

export function HumanGraderHero() {
  return <ControlRedesignRuntime kind="humanGrader" label="同一份回答分别装进甲乙两只盲评信封，分歧时打开校准抽屉留下第三个分数">
    <div className={styles.heroScene} aria-hidden="true">
      <div className={styles.heroSample}><span>同一回答</span><strong>退款说明</strong><small>先遮住彼此分数</small></div>
      <div className={styles.heroEnvelopes}>
        <div className={styles.heroEnvelope}><i /><span>甲</span><b>4 / 5</b></div>
        <div className={styles.heroEnvelope}><i /><span>乙</span><b>2 / 5</b></div>
      </div>
      <div className={styles.heroDrawer}><span>校准抽屉</span><strong>3 / 5</strong><small>理由写回</small></div>
    </div>
  </ControlRedesignRuntime>;
}

export function HumanGraderLesson() {
  const [reviewCase, setReviewCase] = useState<ReviewCase>("agree");
  const current = cases[reviewCase];
  return <section className={styles.lesson} aria-label="人工评分器演示">
    <div className={styles.lessonHeader}><strong>先盲评，再打开信封</strong><span>分歧是校准入口</span></div>
    <div className={styles.controls}>
      <button type="button" aria-pressed={reviewCase === "agree"} onClick={() => setReviewCase("agree")}>评分一致</button>
      <button type="button" aria-pressed={reviewCase === "split"} onClick={() => setReviewCase("split")}>出现分歧</button>
      <button type="button" aria-pressed={reviewCase === "missing"} onClick={() => setReviewCase("missing")}>证据不足</button>
      <button type="button" onClick={() => setReviewCase("agree")}>重置</button>
    </div>
    <div className={styles.reviewDesk} data-case={reviewCase} aria-live="polite">
      <div className={styles.answerCard}><span>同一回答</span><strong>三个工作日到账</strong><small>退款说明 · 样本 042</small></div>
      <div className={styles.envelopePair}>
        <article className={styles.envelope}>
          <div className={styles.envelopeFlap} />
          <span>甲 · 独立评分</span><strong>{current.scores[0]}</strong><small>理由留在信封里</small>
        </article>
        <article className={styles.envelope}>
          <div className={styles.envelopeFlap} />
          <span>乙 · 独立评分</span><strong>{current.scores[1]}</strong><small>不知道甲的分数</small>
        </article>
      </div>
      <div className={styles.calibrationDrawer} data-open={reviewCase !== "agree"}>
        <span>校准抽屉</span><strong>{current.drawer}</strong><small>{current.drawerNote}</small>
      </div>
    </div>
    <div className={styles.result} role="status"><strong>{current.result}</strong><span>人工评分留下分数、理由和状态，才能回到规则复核，而不是把个人感觉藏进平均数。</span></div>
  </section>;
}
