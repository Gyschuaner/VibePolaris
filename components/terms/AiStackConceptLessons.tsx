import { ContainerImageLesson, DependencyScanningLesson, ObservabilityLesson, SastLesson, SecretScanningLesson, ServiceDiscoveryLesson, ThreatModelingLesson } from "./ai-stack-lessons";
export { Caption } from "./AiStackConceptLessonShared";
export { ContainerImageLesson } from "./ai-stack-lessons/container-image";

export const aiStackLessons = {
  "container-image": ContainerImageLesson,
  "service-discovery": ServiceDiscoveryLesson,
  observability: ObservabilityLesson,
  sast: SastLesson,
  "secret-scanning": SecretScanningLesson,
  "dependency-scanning": DependencyScanningLesson,
  "threat-modeling": ThreatModelingLesson,
} as const;
