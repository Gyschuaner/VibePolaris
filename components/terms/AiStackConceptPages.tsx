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
import { HandoffTermPage } from "./ai-stack-pages/handoff";
import { SubagentTermPage } from "./ai-stack-pages/subagent";
import { HumanInTheLoopTermPage } from "./ai-stack-pages/human-in-the-loop";
import { GuardrailTermPage } from "./ai-stack-pages/guardrail";
import { ModerationTermPage } from "./ai-stack-pages/moderation";
import { FineTuningTermPage } from "./ai-stack-pages/fine-tuning";
import { ContextWindowTermPage } from "./ai-stack-pages/context-window";
import { AgentLoopTermPage } from "./ai-stack-pages/agent-loop";
import { AgentMemoryTermPage } from "./ai-stack-pages/agent-memory";
import { WorkingMemoryTermPage } from "./ai-stack-pages/working-memory";
import { ExecutionSandboxTermPage } from "./ai-stack-pages/execution-sandbox";
import { EmbeddingTermPage } from "./ai-stack-pages/embedding";
import { VectorStoreTermPage } from "./ai-stack-pages/vector-store";
import { RetrievalTermPage } from "./ai-stack-pages/retrieval";
import { ChunkingTermPage } from "./ai-stack-pages/chunking";
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
export { HandoffTermPage } from "./ai-stack-pages/handoff";
export { SubagentTermPage } from "./ai-stack-pages/subagent";
export { HumanInTheLoopTermPage } from "./ai-stack-pages/human-in-the-loop";
export { GuardrailTermPage } from "./ai-stack-pages/guardrail";
export { ModerationTermPage } from "./ai-stack-pages/moderation";
export { FineTuningTermPage } from "./ai-stack-pages/fine-tuning";
export { ContextWindowTermPage } from "./ai-stack-pages/context-window";
export { AgentLoopTermPage } from "./ai-stack-pages/agent-loop";
export { AgentMemoryTermPage } from "./ai-stack-pages/agent-memory";
export { WorkingMemoryTermPage } from "./ai-stack-pages/working-memory";
export { ExecutionSandboxTermPage } from "./ai-stack-pages/execution-sandbox";
export { EmbeddingTermPage } from "./ai-stack-pages/embedding";
export { VectorStoreTermPage } from "./ai-stack-pages/vector-store";
export { RetrievalTermPage } from "./ai-stack-pages/retrieval";
export { ChunkingTermPage } from "./ai-stack-pages/chunking";

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
  handoff: HandoffTermPage,
  subagent: SubagentTermPage,
  "human-in-the-loop": HumanInTheLoopTermPage,
  guardrail: GuardrailTermPage,
  moderation: ModerationTermPage,
  "fine-tuning": FineTuningTermPage,
  "context-window": ContextWindowTermPage,
  "agent-loop": AgentLoopTermPage,
  "agent-memory": AgentMemoryTermPage,
  "working-memory": WorkingMemoryTermPage,
  "execution-sandbox": ExecutionSandboxTermPage,
  "embedding": EmbeddingTermPage,
  "vector-store": VectorStoreTermPage,
  "retrieval": RetrievalTermPage,
  "chunking": ChunkingTermPage,
} as const;
