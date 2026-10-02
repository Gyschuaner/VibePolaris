"use client";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export type NewsExplainerData = {
  variant: "benchmark" | "secure-memory" | "agent-workflow" | "synthetic-data" | "data-motion" | "robot-safety" | "clinical-alert";
  title: string;
  question: string;
  steps: { label: string; detail: string; evidence?: string }[];
};

function SyntheticDataVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-synthetic-visual synthetic-phase-${activeStep}`} aria-hidden="true">
      <div className="synthetic-card synthetic-card-source">
        <span className="synthetic-card-label">真实缺口</span>
        <span className="synthetic-card-shapes"><i /><i /><i /></span>
      </div>
      <span className="synthetic-flow-arrow">→</span>
      <div className="synthetic-card synthetic-card-generator">
        <span className="synthetic-card-label">合成场景</span>
        <span className="synthetic-card-shapes"><i /><i /><i /><i /></span>
      </div>
      <span className="synthetic-flow-arrow">→</span>
      <div className="synthetic-card synthetic-card-reality">
        <span className="synthetic-card-label">真实复测</span>
        <span className="synthetic-card-shapes"><i /><i /></span>
      </div>
    </div>
  );
}

function DataMotionVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-data-motion data-motion-phase-${activeStep}`} aria-hidden="true">
      <div className="data-motion-card data-motion-source">
        <span className="data-motion-label">数据源</span>
        <span className="data-motion-stream"><i /><i /><i /><i /></span>
      </div>
      <span className="data-motion-arrow">→</span>
      <div className="data-motion-card data-motion-mesh">
        <span className="data-motion-label">实时拆解</span>
        <span className="data-motion-mesh-shape"><i /><i /><i /><i /></span>
      </div>
      <span className="data-motion-arrow">→</span>
      <div className="data-motion-card data-motion-action">
        <span className="data-motion-label">决策动作</span>
        <span className="data-motion-action-shape"><i /><i /></span>
      </div>
    </div>
  );
}

function RobotSafetyVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-robot-safety robot-safety-phase-${activeStep}`} aria-hidden="true">
      <div className="robot-safety-zone">
        <span className="robot-safety-zone-label">共享工作区</span>
        <span className="robot-safety-gate" />
        <i className="robot-safety-robot robot-safety-robot-one" />
        <i className="robot-safety-robot robot-safety-robot-two" />
        <i className="robot-safety-person" />
      </div>
      <div className="robot-safety-command">
        <span className="robot-safety-command-pulse" />
        <span className="robot-safety-command-label">安全命令</span>
      </div>
      <div className="robot-safety-result">等待机器确认停止</div>
    </div>
  );
}

function ClinicalAlertVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-clinical-alert clinical-alert-phase-${activeStep}`} aria-hidden="true">
      <div className="clinical-alert-scan">
        <span className="clinical-alert-scan-ring" />
        <span className="clinical-alert-scan-mark" />
        <span className="clinical-alert-label">CT 图像</span>
      </div>
      <span className="clinical-alert-arrow">→</span>
      <div className="clinical-alert-notice">
        <span className="clinical-alert-notice-dot" />
        <span className="clinical-alert-label">疑似 LVO</span>
      </div>
      <span className="clinical-alert-arrow">→</span>
      <div className="clinical-alert-team">
        <span className="clinical-alert-team-head" />
        <span className="clinical-alert-label">医生复核</span>
      </div>
    </div>
  );
}

export function NewsExplainer({ data }: { data: NewsExplainerData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || data.steps.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= data.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [data.steps.length, playing]);

  const step = data.steps[activeStep] ?? data.steps[0];
  const labels = data.steps.map((item) => item.label);

  function chooseStep(index: number) {
    setActiveStep(index);
    setPlaying(false);
  }

  function replay() {
    setActiveStep(0);
    setPlaying(true);
  }

  return (
    <div className={`news-explainer news-explainer-${data.variant}`} data-news-explainer>
      <header className="news-explainer-header">
        <p className="news-explainer-kicker">读者问题</p>
        <h2>{data.title}</h2>
        <p>{data.question}</p>
      </header>
      <div className="news-explainer-stage">
        {data.variant === "synthetic-data" ? <SyntheticDataVisual activeStep={activeStep} /> : data.variant === "data-motion" ? <DataMotionVisual activeStep={activeStep} /> : data.variant === "robot-safety" ? <RobotSafetyVisual activeStep={activeStep} /> : data.variant === "clinical-alert" ? <ClinicalAlertVisual activeStep={activeStep} /> : (
          <div className="news-explainer-visual" aria-hidden="true">
            <span className="news-explainer-orbit" />
            {labels.map((label, index) => (
              <span className={`news-explainer-node ${index <= Math.min(activeStep, labels.length - 1) ? "is-reached" : ""} ${index === activeStep ? "is-active" : ""}`} key={`${label}-${index}`}>
                <i>{index + 1}</i>{label}
              </span>
            ))}
          </div>
        )}
        <div className="news-explainer-caption" aria-live="polite">
          <span className="news-explainer-step">STEP {String(activeStep + 1).padStart(2, "0")}</span>
          <h3>{step.label}</h3>
          <p>{step.detail}</p>
          {step.evidence && <small>{step.evidence}</small>}
        </div>
      </div>
      <div className="news-explainer-controls">
        <div className="news-explainer-steps" role="tablist" aria-label="讲解步骤">
          {data.steps.map((item, index) => (
            <button type="button" role="tab" aria-selected={index === activeStep} onClick={() => chooseStep(index)} key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </button>
          ))}
        </div>
        <button className="news-explainer-play" type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? "暂停讲解" : "播放讲解"}>
          {playing ? <Pause size={16} /> : <Play size={16} />}{playing ? "暂停" : "播放"}
        </button>
        <button className="news-explainer-replay" type="button" onClick={replay} aria-label="重新播放讲解" title="重新播放讲解"><ArrowCounterClockwise size={17} /></button>
      </div>
    </div>
  );
}
