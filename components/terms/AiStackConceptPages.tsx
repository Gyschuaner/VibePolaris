import { ContainerImageTermPage } from "./ai-stack-pages/container-image";
import { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
import { ObservabilityTermPage } from "./ai-stack-pages/observability";
import { SastTermPage } from "./ai-stack-pages/sast";
import { SecretScanningTermPage } from "./ai-stack-pages/secret-scanning";
import { DependencyScanningTermPage } from "./ai-stack-pages/dependency-scanning";
export { ContainerImageTermPage } from "./ai-stack-pages/container-image";
export { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
export { ObservabilityTermPage } from "./ai-stack-pages/observability";
export { SastTermPage } from "./ai-stack-pages/sast";
export { SecretScanningTermPage } from "./ai-stack-pages/secret-scanning";
export { DependencyScanningTermPage } from "./ai-stack-pages/dependency-scanning";

export const aiStackArticlePages = {
  "container-image": ContainerImageTermPage,
  "service-discovery": ServiceDiscoveryTermPage,
  observability: ObservabilityTermPage,
  sast: SastTermPage,
  "secret-scanning": SecretScanningTermPage,
  "dependency-scanning": DependencyScanningTermPage,
} as const;
