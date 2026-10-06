import type { ReactNode } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./ControlRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: Parameters<typeof ControlRedesignRuntime>[0]["kind"]; label: string; children: ReactNode }) {
  return <ControlRedesignRuntime kind={kind} label={label}>{children}</ControlRedesignRuntime>;
}

const textStyle = { fontFamily: "ui-monospace, SFMono-Regular, monospace" };

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
