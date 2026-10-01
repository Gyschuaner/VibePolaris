"use client";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export type NewsExplainerData = {
  variant: "benchmark" | "secure-memory" | "agent-workflow";
  title: string;
  question: string;
  steps: { label: string; detail: string; evidence?: string }[];
};

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
        <div className="news-explainer-visual" aria-hidden="true">
          <span className="news-explainer-orbit" />
          {labels.map((label, index) => (
            <span className={`news-explainer-node ${index <= Math.min(activeStep, labels.length - 1) ? "is-reached" : ""} ${index === activeStep ? "is-active" : ""}`} key={`${label}-${index}`}>
              <i>{index + 1}</i>{label}
            </span>
          ))}
        </div>
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
