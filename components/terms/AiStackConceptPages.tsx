import { ContainerImageTermPage } from "./ai-stack-pages/container-image";
import { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
import { ObservabilityTermPage } from "./ai-stack-pages/observability";
import { SastTermPage } from "./ai-stack-pages/sast";
export { ContainerImageTermPage } from "./ai-stack-pages/container-image";
export { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
export { ObservabilityTermPage } from "./ai-stack-pages/observability";
export { SastTermPage } from "./ai-stack-pages/sast";

export const aiStackArticlePages = {
  "container-image": ContainerImageTermPage,
  "service-discovery": ServiceDiscoveryTermPage,
  observability: ObservabilityTermPage,
  sast: SastTermPage,
} as const;
