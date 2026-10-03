"use client";

import { ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import styles from "../BackendNetworkConcepts.module.css";

export type BackendNetworkLessonStep = {
  label: string;
  actors: string[];
  evidence: string;
};

export type BackendNetworkLessonSpec = {
  title: string;
  ariaLabel: string;
  steps: BackendNetworkLessonStep[];
  failure: { label: string; text: string };
};

export function BackendNetworkLesson({ spec }: { spec: BackendNetworkLessonSpec }) {
  const [step, setStep] = useState(0);
  const [showFailure, setShowFailure] = useState(false);
  const current = spec.steps[step];

  return <div className={styles.lesson} role="region" aria-label={spec.ariaLabel}>
    <div className={styles.lessonHeader}>
      <div><span>机制演示</span><strong>{spec.title}</strong></div>
      <div className={styles.lessonStatus} aria-live="polite"><span>{step + 1}/{spec.steps.length}</span><span>{showFailure ? "失败分支" : current.label}</span></div>
    </div>
    <div className={styles.lessonTrack} data-failure={showFailure}>
      {current.actors.map((actor, index) => <div className={styles.lessonActor} key={`${actor}-${index}`}>
        <span>{actor}</span>{index < current.actors.length - 1 && <ArrowRight size={17} aria-hidden="true" />}
      </div>)}
    </div>
    <div className={styles.lessonEvidence} aria-live="polite">
      {showFailure ? <><WarningCircle size={21} aria-hidden="true" /><p><strong>{spec.failure.label}</strong>{spec.failure.text}</p></> : <><CheckCircle size={21} aria-hidden="true" /><p><strong>{current.label}</strong>{current.evidence}</p></>}
    </div>
    <div className={styles.lessonControls} role="group" aria-label="切换演示步骤">
      {spec.steps.map((item, index) => <button type="button" key={item.label} aria-pressed={!showFailure && step === index} onClick={() => { setStep(index); setShowFailure(false); }}>{item.label}</button>)}
      <button type="button" aria-pressed={showFailure} onClick={() => setShowFailure(value => !value)}>{showFailure ? "回到主路径" : "看失败分支"}</button>
    </div>
  </div>;
}
