"use client";

import { ArrowCounterClockwise, Pause, Play } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export type NewsExplainerData = {
  variant: "benchmark" | "secure-memory" | "agent-workflow" | "synthetic-data" | "data-motion" | "robot-safety" | "clinical-alert" | "adaptive-trial" | "policy-governance" | "agent-safety" | "ecg-screening" | "ai-diplomacy" | "agent-incident" | "training-pause" | "ai-ethics" | "data-leak";
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

function AdaptiveTrialVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-adaptive-trial adaptive-trial-phase-${activeStep}`} aria-hidden="true">
      <div className="adaptive-trial-track">
        <span className="adaptive-trial-track-label">试验状态</span>
        <i /><i /><i /><i /><i />
      </div>
      <div className="adaptive-trial-card adaptive-trial-model">
        <span className="adaptive-trial-card-label">预测设计</span>
        <span className="adaptive-trial-model-shape"><i /><i /><i /></span>
      </div>
      <span className="adaptive-trial-arrow">→</span>
      <div className="adaptive-trial-card adaptive-trial-analysis">
        <span className="adaptive-trial-card-label">实时分析</span>
        <span className="adaptive-trial-analysis-bars"><i /><i /><i /></span>
      </div>
      <span className="adaptive-trial-arrow">→</span>
      <div className="adaptive-trial-card adaptive-trial-adjust">
        <span className="adaptive-trial-card-label">调整下一步</span>
        <span className="adaptive-trial-adjust-shape"><i /><i /></span>
      </div>
      <div className="adaptive-trial-result">数据累积后再决定是否调整</div>
    </div>
  );
}

function PolicyGovernanceVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-policy-governance policy-governance-phase-${activeStep}`} aria-hidden="true">
      <div className="policy-governance-track">
        <span className="policy-governance-track-label">政策状态</span>
        <i /><i /><i /><i /><i />
      </div>
      <div className="policy-governance-card policy-governance-old">
        <span className="policy-governance-card-label">原有 AI</span>
        <span className="policy-governance-shape"><i /><i /><i /></span>
      </div>
      <span className="policy-governance-arrow">→</span>
      <div className="policy-governance-card policy-governance-scope">
        <span className="policy-governance-card-label">行政文本用 SI</span>
        <span className="policy-governance-shape"><i /><i /></span>
      </div>
      <span className="policy-governance-arrow">→</span>
      <div className="policy-governance-card policy-governance-next">
        <span className="policy-governance-card-label">后续核对</span>
        <span className="policy-governance-shape"><i /><i /><i /></span>
      </div>
      <div className="policy-governance-result">改名不等于能力改变</div>
    </div>
  );
}

function AgentSafetyVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-agent-safety agent-safety-phase-${activeStep}`} aria-hidden="true">
      <div className="agent-safety-card agent-safety-intent">
        <span className="agent-safety-card-label">任务与权限</span>
        <span className="agent-safety-intent-shape"><i /><i /><i /></span>
      </div>
      <span className="agent-safety-arrow">→</span>
      <div className="agent-safety-card agent-safety-shell">
        <span className="agent-safety-card-label">OpenShell 沙箱</span>
        <span className="agent-safety-shell-shape"><i /><i /><i /><i /></span>
      </div>
      <span className="agent-safety-monitor-link">↓ 外部持续监控</span>
      <div className="agent-safety-card agent-safety-sentry">
        <span className="agent-safety-card-label">Sentry 外部监控</span>
        <span className="agent-safety-sentry-shape"><i /><i /></span>
      </div>
      <div className="agent-safety-result">越界时隔离或停止，不把安全交给提示词</div>
    </div>
  );
}

function EcgScreeningVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-ecg-screening ecg-screening-phase-${activeStep}`} aria-hidden="true">
      <div className="ecg-screening-card ecg-screening-ecg">
        <span className="ecg-screening-card-label">12 导联 ECG</span>
        <span className="ecg-screening-wave"><i /><i /><i /><i /><i /></span>
      </div>
      <span className="ecg-screening-arrow">→</span>
      <div className="ecg-screening-card ecg-screening-model">
        <span className="ecg-screening-card-label">AI 筛查信号</span>
        <span className="ecg-screening-model-shape"><i /><i /><i /></span>
      </div>
      <span className="ecg-screening-arrow">→</span>
      <div className="ecg-screening-card ecg-screening-followup">
        <span className="ecg-screening-card-label">复核与后续检查</span>
        <span className="ecg-screening-followup-shape"><i /><i /></span>
      </div>
      <div className="ecg-screening-result">AI 输出风险提示，不能替代诊断</div>
    </div>
  );
}

function AiDiplomacyVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-ai-diplomacy ai-diplomacy-phase-${activeStep}`} aria-hidden="true">
      <div className="ai-diplomacy-card ai-diplomacy-us"><span>美国</span><i /><i /></div>
      <span className="ai-diplomacy-link">⇄</span>
      <div className="ai-diplomacy-card ai-diplomacy-cn"><span>中国</span><i /><i /></div>
      <div className="ai-diplomacy-channel"><b>SI 对话</b><small>风险与收益</small></div>
      <div className="ai-diplomacy-incident"><b>事故通道</b><small>先沟通再升级</small></div>
      <div className="ai-diplomacy-result">下次交流：2026 年 11 月</div>
    </div>
  );
}

function AgentIncidentVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-agent-incident agent-incident-phase-${activeStep}`} aria-hidden="true">
      <div className="agent-incident-card agent-incident-task"><span>代理任务</span><i /><i /><i /></div>
      <span className="agent-incident-arrow">→</span>
      <div className="agent-incident-card agent-incident-web"><span>公开网站</span><i /><i /></div>
      <span className="agent-incident-arrow">→</span>
      <div className="agent-incident-card agent-incident-review"><span>监控与通报</span><i /><i /><i /></div>
      <div className="agent-incident-result">访问公开资料 ≠ 取得非公开权限</div>
    </div>
  );
}

function TrainingPauseVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-training-pause training-pause-phase-${activeStep}`} aria-hidden="true">
      <div className="training-pause-card training-pause-run"><span>训练运行</span><i /><i /><i /></div>
      <span className="training-pause-arrow">→</span>
      <div className="training-pause-card training-pause-signal"><span>越界信号</span><i /><i /></div>
      <span className="training-pause-arrow">→</span>
      <div className="training-pause-card training-pause-stop"><span>暂停</span><i /></div>
      <span className="training-pause-arrow">→</span>
      <div className="training-pause-card training-pause-guard"><span>补护栏</span><i /><i /></div>
      <div className="training-pause-result">满足安全条件后才恢复</div>
    </div>
  );
}

function AiEthicsVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-ai-ethics ai-ethics-phase-${activeStep}`} aria-hidden="true">
      <div className="ai-ethics-card ai-ethics-person"><span>人的处境</span><i /><i /></div>
      <span className="ai-ethics-arrow">→</span>
      <div className="ai-ethics-card ai-ethics-system"><span>AI 系统</span><i /><i /><i /></div>
      <span className="ai-ethics-arrow">→</span>
      <div className="ai-ethics-card ai-ethics-judgement"><span>伦理判断</span><i /></div>
      <div className="ai-ethics-result">教育与公共对话决定怎样使用技术</div>
    </div>
  );
}

function DataLeakVisual({ activeStep }: { activeStep: number }) {
  return (
    <div className={`news-explainer-data-leak data-leak-phase-${activeStep}`} aria-hidden="true">
      <div className="data-leak-card data-leak-training"><span>训练数据</span><i /><i /><i /></div>
      <span className="data-leak-arrow">→</span>
      <div className="data-leak-card data-leak-agent"><span>代理动作</span><i /><i /></div>
      <span className="data-leak-arrow">→</span>
      <div className="data-leak-card data-leak-host"><span>外部图床</span><i /></div>
      <span className="data-leak-arrow">→</span>
      <div className="data-leak-card data-leak-clean"><span>调查与清理</span><i /><i /></div>
      <div className="data-leak-result">链接被发现后，清理和通知仍在继续</div>
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
        {data.variant === "synthetic-data" ? <SyntheticDataVisual activeStep={activeStep} /> : data.variant === "data-motion" ? <DataMotionVisual activeStep={activeStep} /> : data.variant === "robot-safety" ? <RobotSafetyVisual activeStep={activeStep} /> : data.variant === "clinical-alert" ? <ClinicalAlertVisual activeStep={activeStep} /> : data.variant === "adaptive-trial" ? <AdaptiveTrialVisual activeStep={activeStep} /> : data.variant === "policy-governance" ? <PolicyGovernanceVisual activeStep={activeStep} /> : data.variant === "agent-safety" ? <AgentSafetyVisual activeStep={activeStep} /> : data.variant === "ecg-screening" ? <EcgScreeningVisual activeStep={activeStep} /> : data.variant === "ai-diplomacy" ? <AiDiplomacyVisual activeStep={activeStep} /> : data.variant === "agent-incident" ? <AgentIncidentVisual activeStep={activeStep} /> : data.variant === "training-pause" ? <TrainingPauseVisual activeStep={activeStep} /> : data.variant === "ai-ethics" ? <AiEthicsVisual activeStep={activeStep} /> : data.variant === "data-leak" ? <DataLeakVisual activeStep={activeStep} /> : (
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
