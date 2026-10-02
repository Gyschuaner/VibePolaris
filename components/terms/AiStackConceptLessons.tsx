import { ContainerImageLesson, DependencyScanningLesson, ObservabilityLesson, SastLesson, SecretScanningLesson, ServiceDiscoveryLesson, ThreatModelingLesson, ToolApprovalLesson } from "./ai-stack-lessons";
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
  "tool-approval": ToolApprovalLesson,
} as const;
