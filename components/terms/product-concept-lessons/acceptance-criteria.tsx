"use client";

import { ArrowRight, CheckCircle, ClipboardText, FileText, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { Caption } from "../AiStackConceptLessonShared";
import { useScene } from "../HarnessStoryScenes";
import styles from "../ConceptArticle.module.css";

export function AcceptanceCriteriaLesson() {
  const scene = useScene(3);
  const conditionReady = scene.step >= 1;
  const resultReady = scene.step === 2;
  return <div className={styles.lab} ref={scene.ref} role="region" aria-label="从模糊登录要求推进到正常、错误与权限验收结果演示">
    <Caption
      scene={scene}
      labels={["模糊描述", "给定条件与动作", "可观察结果"]}
      titles={["先发现“顺畅”不能测试", "把场景写成 Given 与 When", "把正常、错误和权限写成结果"]}
      copy={[
        "“登录体验顺畅”没有说明谁在什么条件下做什么，也没有告诉团队怎样算完成，测试无法据此判断通过。",
        "给定未登录用户访问 /settings，用户提交正确凭据；条件和动作已经能被不同角色复述和执行。",
        "成功回到 /settings；密码错误不跳转且保留账号；无权限访问管理页显示 403。每个结果都能观察，回归检查也有落点。",
      ]}
    />
    <div className={styles.acceptanceCriteriaBoard} aria-live="polite">
      <div className={styles.acceptanceCriteriaCard} data-active={!conditionReady} data-muted={conditionReady}>
        {conditionReady ? <FileText size={23} aria-hidden="true" /> : <WarningCircle size={23} aria-hidden="true" />}
        <strong>模糊要求</strong>
        <code>登录体验顺畅</code>
        <span>{conditionReady ? "保留为意图，不直接验收" : "没有条件和结果"}</span>
      </div>
      <ArrowRight className={styles.acceptanceCriteriaArrow} size={19} aria-hidden="true" />
      <div className={styles.acceptanceCriteriaCard} data-active={conditionReady} data-muted={!conditionReady}>
        <UserCircle size={23} aria-hidden="true" />
        <strong>{conditionReady ? "条件与动作" : "需要补齐"}</strong>
        <code>{conditionReady ? "Given 未登录 /settings · When 提交正确凭据" : "Given · When · 谁来做"}</code>
        <span>{conditionReady ? "场景可以被执行" : "先把起点和动作写出来"}</span>
      </div>
      <ArrowRight className={styles.acceptanceCriteriaArrow} size={19} aria-hidden="true" />
      <div className={styles.acceptanceCriteriaCard} data-active={resultReady} data-muted={!resultReady}>
        {resultReady ? <CheckCircle size={23} aria-hidden="true" /> : <ClipboardText size={23} aria-hidden="true" />}
        <strong>{resultReady ? "验收结果" : "完成边界"}</strong>
        <code>{resultReady ? "成功 / 错误 / 403" : "Then 要看到什么"}</code>
        <span>{resultReady ? "不跳转、保留账号、显示权限结果" : "还不能宣布完成"}</span>
      </div>
      <div className={styles.acceptanceCriteriaProof} data-ready={resultReady}>
        <ClipboardText size={21} aria-hidden="true" />
        <p><strong>{resultReady ? "每条都能检查" : "验收还没站稳"}</strong>{resultReady ? " 正常、错误、权限和回归都有可观察落点，未指定内部实现。" : " 把主观形容词改成给定条件、动作和结果。"}</p>
      </div>
    </div>
    <div className={styles.choices} role="group" aria-label="推进验收标准演示">
      <button type="button" onClick={() => scene.seek(1)} aria-pressed={scene.step === 1}>补充正常条件</button>
      <button type="button" onClick={() => scene.seek(2)} aria-pressed={resultReady}>补充错误与权限</button>
    </div>
  </div>;
}
