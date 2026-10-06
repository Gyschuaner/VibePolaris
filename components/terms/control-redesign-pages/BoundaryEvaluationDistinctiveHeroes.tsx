import type { ReactNode } from "react";
import { ControlRedesignRuntime } from "./ControlRedesignRuntime";
import styles from "./ControlRedesignConcepts.module.css";

function HeroShell({ kind, label, children }: { kind: Parameters<typeof ControlRedesignRuntime>[0]["kind"]; label: string; children: ReactNode }) {
  return <ControlRedesignRuntime kind={kind} label={label}>{children}</ControlRedesignRuntime>;
}

const textStyle = { fontFamily: "ui-monospace, SFMono-Regular, monospace" };

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
