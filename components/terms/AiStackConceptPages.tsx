import { ContainerImageTermPage } from "./ai-stack-pages/container-image";
import { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
import { ObservabilityTermPage } from "./ai-stack-pages/observability";
export { ContainerImageTermPage } from "./ai-stack-pages/container-image";
export { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
export { ObservabilityTermPage } from "./ai-stack-pages/observability";

export const aiStackArticlePages = {
  "container-image": ContainerImageTermPage,
  "service-discovery": ServiceDiscoveryTermPage,
  observability: ObservabilityTermPage,
} as const;
