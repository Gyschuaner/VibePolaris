"use client";

import { type ReactNode } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ConceptMechanismHeroRuntime.module.css";

export type MechanismScene = ReturnType<typeof useScene>;

export function MechanismFrame({ scene, title, labels, caption, children }: { scene: MechanismScene; title: string; labels: string[]; caption: string; children: ReactNode }) {
  return <figure ref={scene.ref} className={styles.hero} role="region" aria-label={title} data-step={scene.step}>
    <div className={styles.header}><span>{title}</span><strong>{String(scene.step + 1).padStart(2, "0")}</strong></div>
    <SceneControls scene={scene} labels={labels} compact />
    <div className={styles.canvas}>{children}</div>
    <figcaption className={styles.caption} aria-live="polite"><span>{String(scene.step + 1).padStart(2, "0")}</span><p>{caption}</p></figcaption>
  </figure>;
}

export { styles as mechanismStyles };
