import type { ReactNode } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./ControlRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: Parameters<typeof ControlRedesignRuntime>[0]["kind"]; label: string; children: ReactNode }) {
  return <ControlRedesignRuntime kind={kind} label={label}>{children}</ControlRedesignRuntime>;
}

const textStyle = { fontFamily: "ui-monospace, SFMono-Regular, monospace" };

export function SafetyEvaluationHero() {
  return <HeroShell kind="safetyEval" label="安全评测把回答和真实副作用分开观察：正常请求通过，越权被挡，注入泄露让门槛失败">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <path className={styles.safetyLane} d="M22 38 H138 M22 75 H138 M22 112 H138" />
      <circle className={styles.safetyProbe} cx="22" cy="38" r="7" />
      <circle className={styles.safetyProbe} cx="22" cy="75" r="7" />
      <circle className={styles.safetyProbeRisk} cx="22" cy="112" r="7" />
      <path className={styles.safetyShield} d="M151 23 l19 8 v20 c0 17-13 27-19 30-6-3-19-13-19-30 V31z" />
      <path className={styles.safetyShieldMark} d="M141 50 l8 8 14-17" />
      <path className={styles.safetyTool} d="M213 49 h45 l9 9 v34 l-9 9 h-45 l-9-9 V58z" />
      <circle className={styles.safetyToolPort} cx="229" cy="75" r="6" />
      <path className={styles.safetyLeak} d="M274 75 h34 M300 69 l8 6-8 6" />
      <text className={styles.mechanismText} x="20" y="25" textAnchor="middle" style={textStyle}>ok</text>
      <text className={styles.mechanismText} x="20" y="94" textAnchor="middle" style={textStyle}>deny</text>
      <text className={styles.mechanismText} x="22" y="133" textAnchor="middle" style={textStyle}>leak</text>
      <text className={styles.mechanismCaption} x="228" y="31" textAnchor="middle" style={textStyle}>tool side effect</text>
      <text className={styles.mechanismRiskText} x="313" y="72" textAnchor="middle" style={textStyle}>1 → fail</text>
    </svg>
  </HeroShell>;
}

export function CostEvaluationHero() {
  return <HeroShell kind="costEval" label="成本评测让不同方案把令牌硬币投入同一个预算槽，质量分数另行保留">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <path className={styles.costRail} d="M25 48 H242 M25 102 H242" />
      <text className={styles.mechanismText} x="17" y="42" textAnchor="end" style={textStyle}>A</text>
      <text className={styles.mechanismText} x="17" y="96" textAnchor="end" style={textStyle}>B</text>
      <g className={styles.costQuality}>
        <circle cx="42" cy="28" r="3" /><circle cx="53" cy="28" r="3" /><circle cx="64" cy="28" r="3" /><text x="79" y="32" style={textStyle}>17 / 20</text>
      </g>
      <g className={styles.costQuality}>
        <circle cx="42" cy="132" r="3" /><circle cx="53" cy="132" r="3" /><circle cx="64" cy="132" r="3" /><text x="79" y="136" style={textStyle}>18 / 20</text>
      </g>
      <g className={styles.costCoinsA}><circle cx="90" cy="48" r="8"/><circle cx="116" cy="48" r="8"/><circle cx="142" cy="48" r="8"/></g>
      <g className={styles.costCoinsB}><circle cx="90" cy="102" r="8"/><circle cx="116" cy="102" r="8"/><circle cx="142" cy="102" r="8"/><circle cx="168" cy="102" r="8"/></g>
      <path className={styles.costBudget} d="M244 28 v94 M244 28 h25 M244 122 h25" />
      <text className={styles.costBudgetText} x="284" y="70" textAnchor="middle" style={textStyle}>¥1.00</text>
      <text className={styles.costOverText} x="284" y="115" textAnchor="middle" style={textStyle}>B ¥1.16</text>
    </svg>
  </HeroShell>;
}

export function LatencyEvaluationHero() {
  return <HeroShell kind="latencyEval" label="一个请求的光点先到达首字，再穿过工具等待，最后落在完成线；更晚的尾部单独标出">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <path className={styles.latencyAxis} d="M28 77 H315" />
      <path className={styles.latencyTick} d="M85 69 V85 M191 69 V85 M284 69 V85" />
      <circle className={styles.latencyCursor} cx="28" cy="77" r="7" />
      <circle className={styles.latencyPulse} cx="85" cy="77" r="13" />
      <circle className={styles.latencyTool} cx="191" cy="77" r="7" />
      <circle className={styles.latencyDone} cx="284" cy="77" r="7" />
      <text className={styles.mechanismText} x="85" y="51" textAnchor="middle" style={textStyle}>首字 420ms</text>
      <text className={styles.mechanismText} x="191" y="106" textAnchor="middle" style={textStyle}>工具 1.8s</text>
      <text className={styles.mechanismText} x="284" y="51" textAnchor="middle" style={textStyle}>完成 3.4s</text>
      <g className={styles.latencyTailDots}><circle cx="250" cy="124" r="3"/><circle cx="264" cy="124" r="3"/><circle cx="278" cy="124" r="3"/><circle cx="292" cy="124" r="3"/><circle cx="306" cy="124" r="3"/></g>
      <text className={styles.mechanismCaption} x="278" y="141" textAnchor="middle" style={textStyle}>p95 4.8s · tail</text>
    </svg>
  </HeroShell>;
}

export function PassFailHero() {
  return <HeroShell kind="passFail" label="三个证据卡沿着判定轨道进入不同的桶：正确进入通过，错误进入失败，环境未知停在未评分">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <path className={styles.passRail} d="M24 75 H163 M163 75 C185 75 185 42 211 42 H239 M163 75 H239 M163 75 C185 75 185 108 211 108 H239" />
      <circle className={styles.passGate} cx="163" cy="75" r="12" />
      <path className={styles.passGateMark} d="M157 75 l5 5 8-10" />
      <g className={styles.passEvidenceFile}><rect x="32" y="35" width="65" height="24" rx="5"/><text x="64" y="51" textAnchor="middle" style={textStyle}>file ✓</text></g>
      <g className={styles.passEvidenceField}><rect x="32" y="63" width="65" height="24" rx="5"/><text x="64" y="79" textAnchor="middle" style={textStyle}>amount ✓</text></g>
      <g className={styles.passEvidenceUnknown}><rect x="32" y="91" width="65" height="24" rx="5"/><text x="64" y="107" textAnchor="middle" style={textStyle}>env ?</text></g>
      <g className={styles.passBin}><rect x="239" y="28" width="78" height="28" rx="7"/><text x="278" y="46" textAnchor="middle" style={textStyle}>PASS</text></g>
      <g className={styles.failBin}><rect x="239" y="61" width="78" height="28" rx="7"/><text x="278" y="79" textAnchor="middle" style={textStyle}>FAIL</text></g>
      <g className={styles.unknownBin}><rect x="239" y="94" width="78" height="28" rx="7"/><text x="278" y="112" textAnchor="middle" style={textStyle}>UNSCORED</text></g>
    </svg>
  </HeroShell>;
}

export function RubricHero() {
  return <HeroShell kind="rubric" label="同一个回答被量表的三把尺子逐格照亮，事实和风险通过，条件缺失留下二分之一的证据">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <rect className={styles.rubricAnswer} x="17" y="53" width="150" height="42" rx="8" />
      <text className={styles.mechanismText} x="92" y="78" textAnchor="middle" style={textStyle}>审核后，三个工作日到账</text>
      <path className={styles.rubricBeam} d="M178 34 V113" />
      <g className={styles.rubricRule}>
        <rect x="192" y="28" width="120" height="24" rx="5"/><text x="252" y="44" textAnchor="middle" style={textStyle}>事实 ✓</text>
        <rect x="192" y="61" width="120" height="24" rx="5"/><text x="252" y="77" textAnchor="middle" style={textStyle}>条件 ?</text>
        <rect x="192" y="94" width="120" height="24" rx="5"/><text x="252" y="110" textAnchor="middle" style={textStyle}>风险 ✓</text>
      </g>
      <g className={styles.mechanismRubricScore}><circle cx="171" cy="127" r="16"/><text x="171" y="131" textAnchor="middle" style={textStyle}>2/3</text></g>
      <text className={styles.mechanismCaption} x="92" y="116" textAnchor="middle" style={textStyle}>逐项证据</text>
    </svg>
  </HeroShell>;
}

export function HumanGraderHero() {
  return <HeroShell kind="humanGrader" label="两位评审先在各自的刻度尺上独立落点，分歧被送进第三人的校准框并留下三分">
    <svg className={styles.mechanismSvg} viewBox="0 0 340 150" role="img" aria-hidden="true">
      <path className={styles.graderRuler} d="M28 50 H141 M28 104 H141" />
      <path className={styles.graderTicks} d="M51 44 V56 M74 44 V56 M97 44 V56 M120 44 V56 M51 98 V110 M74 98 V110 M97 98 V110 M120 98 V110" />
      <circle className={styles.graderNeedleA} cx="120" cy="50" r="8" />
      <circle className={styles.graderNeedleB} cx="74" cy="104" r="8" />
      <text className={styles.mechanismText} x="28" y="35" style={textStyle}>甲 4 / 5</text>
      <text className={styles.mechanismText} x="28" y="89" style={textStyle}>乙 2 / 5</text>
      <path className={styles.graderBridge} d="M141 50 C165 50 166 77 186 77 M141 104 C165 104 166 77 186 77" />
      <rect className={styles.graderCalibrate} x="186" y="57" width="128" height="40" rx="9" />
      <text x="250" y="73" textAnchor="middle" style={textStyle}>校准样例</text>
      <text x="250" y="88" textAnchor="middle" style={textStyle}>3 / 5 · 留下理由</text>
    </svg>
  </HeroShell>;
}
