import { ContainerImageTermPage } from "./ai-stack-pages/container-image";
import { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
export { ContainerImageTermPage } from "./ai-stack-pages/container-image";
export { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";

export const aiStackArticlePages = {
  "container-image": ContainerImageTermPage,
  "service-discovery": ServiceDiscoveryTermPage,
} as const;
