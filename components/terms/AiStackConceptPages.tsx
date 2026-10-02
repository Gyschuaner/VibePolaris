import { ContainerImageTermPage } from "./ai-stack-pages/container-image";
import { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
import { ObservabilityTermPage } from "./ai-stack-pages/observability";
import { SastTermPage } from "./ai-stack-pages/sast";
import { SecretScanningTermPage } from "./ai-stack-pages/secret-scanning";
import { DependencyScanningTermPage } from "./ai-stack-pages/dependency-scanning";
import { ThreatModelingTermPage } from "./ai-stack-pages/threat-modeling";
import { ToolApprovalTermPage } from "./ai-stack-pages/tool-approval";
import { PermissionBoundaryTermPage } from "./ai-stack-pages/permission-boundary";
import { XssTermPage } from "./ai-stack-pages/xss";
import { ToolChoiceTermPage } from "./ai-stack-pages/tool-choice";
import { ToolResultTermPage } from "./ai-stack-pages/tool-result";
import { PlanAndExecuteTermPage } from "./ai-stack-pages/plan-and-execute";
import { AgentOrchestrationTermPage } from "./ai-stack-pages/agent-orchestration";
export { ContainerImageTermPage } from "./ai-stack-pages/container-image";
export { ServiceDiscoveryTermPage } from "./ai-stack-pages/service-discovery";
export { ObservabilityTermPage } from "./ai-stack-pages/observability";
export { SastTermPage } from "./ai-stack-pages/sast";
export { SecretScanningTermPage } from "./ai-stack-pages/secret-scanning";
export { DependencyScanningTermPage } from "./ai-stack-pages/dependency-scanning";
export { ThreatModelingTermPage } from "./ai-stack-pages/threat-modeling";
export { ToolApprovalTermPage } from "./ai-stack-pages/tool-approval";
export { PermissionBoundaryTermPage } from "./ai-stack-pages/permission-boundary";
export { XssTermPage } from "./ai-stack-pages/xss";
export { ToolChoiceTermPage } from "./ai-stack-pages/tool-choice";
export { ToolResultTermPage } from "./ai-stack-pages/tool-result";
export { PlanAndExecuteTermPage } from "./ai-stack-pages/plan-and-execute";
export { AgentOrchestrationTermPage } from "./ai-stack-pages/agent-orchestration";

export const aiStackArticlePages = {
  "container-image": ContainerImageTermPage,
  "service-discovery": ServiceDiscoveryTermPage,
  observability: ObservabilityTermPage,
  sast: SastTermPage,
  "secret-scanning": SecretScanningTermPage,
  "dependency-scanning": DependencyScanningTermPage,
  "threat-modeling": ThreatModelingTermPage,
  "tool-approval": ToolApprovalTermPage,
  "permission-boundary": PermissionBoundaryTermPage,
  xss: XssTermPage,
  "tool-choice": ToolChoiceTermPage,
  "tool-result": ToolResultTermPage,
  "plan-and-execute": PlanAndExecuteTermPage,
  "agent-orchestration": AgentOrchestrationTermPage,
} as const;
