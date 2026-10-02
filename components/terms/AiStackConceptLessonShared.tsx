"use client";

import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ConceptArticle.module.css";

export function Caption({ scene, labels, titles, copy }: { scene: ReturnType<typeof useScene>; labels: string[]; titles: string[]; copy: string[] }) {
  return <>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.inputExample} aria-live="polite"><strong>{titles[scene.step]}</strong>{copy[scene.step]}</div>
  </>;
}
