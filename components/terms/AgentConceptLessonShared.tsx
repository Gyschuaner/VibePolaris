import { useEffect, useRef } from "react";
import type { useScene } from "./HarnessStoryScenes";

export function useResetOnSceneStart(scene: ReturnType<typeof useScene>, reset: () => void) {
  const previousStep = useRef(scene.step);
  useEffect(() => {
    if (scene.step === 0 && previousStep.current !== 0) reset();
    previousStep.current = scene.step;
  }, [scene.step, reset]);
}
