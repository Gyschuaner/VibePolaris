import { ContainerImageLesson, ObservabilityLesson, SastLesson, ServiceDiscoveryLesson } from "./ai-stack-lessons";
export { Caption } from "./AiStackConceptLessonShared";
export { ContainerImageLesson } from "./ai-stack-lessons/container-image";

export const aiStackLessons = {
  "container-image": ContainerImageLesson,
  "service-discovery": ServiceDiscoveryLesson,
  observability: ObservabilityLesson,
  sast: SastLesson,
} as const;
