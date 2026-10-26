"use client";

import dynamic from "next/dynamic";

import type { BespokeTermPageProps } from "./BespokeTermScaffold";

// Keep each term behind a client import boundary so one visit does not load every demo.
export const ResponsiveTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/responsive").then((module) => module.ResponsiveTermPage),
);

export const CssTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/css").then((module) => module.CssTermPage),
);

export const FormTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/form").then((module) => module.FormTermPage),
);

export const HtmlTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/html").then((module) => module.HtmlTermPage),
);

export const JavascriptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/javascript").then((module) => module.JavascriptTermPage),
);

export const DomTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/dom").then((module) => module.DomTermPage),
);

export const FrameworkTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/framework").then((module) => module.FrameworkTermPage),
);

export const SsgSsrTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/ssg-ssr").then((module) => module.SsgSsrTermPage),
);

export const LibraryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/library").then((module) => module.LibraryTermPage),
);

export const RuntimeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/frontend-foundations-pages/runtime").then((module) => module.RuntimeTermPage),
);

export const TypeScriptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/typescript-pages/typescript-page").then((module) => module.TypeScriptTermPage),
);

export const OfflineFirstTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.OfflineFirstTermPage),
);

export const AdaptiveLayoutTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.AdaptiveLayoutTermPage),
);

export const SafeAreaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.SafeAreaTermPage),
);

export const AppLifecycleTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.AppLifecycleTermPage),
);

export const AppPermissionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.AppPermissionTermPage),
);

export const PushNotificationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.PushNotificationTermPage),
);

export const CrossPlatformDevelopmentTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.CrossPlatformDevelopmentTermPage),
);

export const WebviewTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.WebviewTermPage),
);

export const CssSelectorTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.CssSelectorTermPage),
);

export const BoxModelTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MobileCssConceptPages").then((module) => module.BoxModelTermPage),
);

export const FlexboxTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flexbox-pages/flexbox-page").then((module) => module.FlexboxTermPage),
);

export const CssGridTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/css-grid-pages/css-grid-page").then((module) => module.CssGridTermPage),
);

export const BreakpointTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/breakpoint-pages/breakpoint-page").then((module) => module.BreakpointTermPage),
);

export const MediaQueryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/media-query-pages/media-query-page").then((module) => module.MediaQueryTermPage),
);

export const CodeSplittingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/code-splitting-pages/code-splitting-page").then((module) => module.CodeSplittingTermPage),
);

export const LazyLoadingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/lazy-loading-pages/lazy-loading-page").then((module) => module.LazyLoadingTermPage),
);

export const DockerfileTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/dockerfile-pages/dockerfile-page").then((module) => module.DockerfileTermPage),
);

export const InfrastructureAsCodeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/infrastructure-as-code-pages/infrastructure-as-code-page").then((module) => module.InfrastructureAsCodeTermPage),
);

export const CdnTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/cdn-pages/cdn-page").then((module) => module.CdnTermPage),
);

export const VisualRegressionTestingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/visual-regression-testing-pages/visual-regression-testing-page").then((module) => module.VisualRegressionTestingTermPage),
);

export const CascadeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/cascade-pages/cascade-page").then((module) => module.CascadeTermPage),
);

export const SpecificityTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/specificity-pages/specificity-page").then((module) => module.SpecificityTermPage),
);

export const PositioningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/positioning-pages/positioning-page").then((module) => module.PositioningTermPage),
);

export const ModuleTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/module-pages/module-page").then((module) => module.ModuleTermPage),
);

export const HydrationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/hydration-page").then((module) => module.HydrationTermPage),
);

export const CsrTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/csr-page").then((module) => module.CsrTermPage),
);

export const SsrTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/ssr-page").then((module) => module.SsrTermPage),
);

export const SsgTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/ssg-page").then((module) => module.SsgTermPage),
);

export const RoutingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/routing-page").then((module) => module.RoutingTermPage),
);

export const LocalStorageTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/rendering-pages/local-storage-page").then((module) => module.LocalStorageTermPage),
);

export const FocusManagementTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.FocusManagementTermPage),
);

export const IterationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.IterationTermPage),
);

export const ConversionRateTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.ConversionRateTermPage),
);

export const FunnelTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.FunnelTermPage),
);

export const UsabilityTestingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.UsabilityTestingTermPage),
);

export const MockupTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.MockupTermPage),
);

export const SitemapTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.SitemapTermPage),
);

export const DesignTokenTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.DesignTokenTermPage),
);

export const VisualHierarchyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.VisualHierarchyTermPage),
);

export const FeedbackTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/product-design-pages/ProductDesignPages").then((module) => module.FeedbackTermPage),
);

export const LoadingStateTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.LoadingStateTermPage),
);

export const MicrointeractionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.MicrointeractionTermPage),
);

export const ReducedMotionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.ReducedMotionTermPage),
);

export const DebounceTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DebounceConceptPage").then((module) => module.DebounceTermPage),
);

export const OptimisticUpdateTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/OptimisticUpdateConceptPage").then((module) => module.OptimisticUpdateTermPage),
);

export const CircuitBreakerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/CircuitBreakerConceptPage").then((module) => module.CircuitBreakerTermPage),
);

export const DataContractTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataContractConceptPage").then((module) => module.DataContractTermPage),
);

export const ContextCompactionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ContextCompactionConceptPage").then((module) => module.ContextCompactionTermPage),
);

export const ToolSchemaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ToolSchemaConceptPage").then((module) => module.ToolSchemaTermPage),
);

export const LatencyBudgetTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/LatencyBudgetConceptPage").then((module) => module.LatencyBudgetTermPage),
);

export const ColumnTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ColumnConceptPage").then((module) => module.ColumnTermPage),
);

export const AcidTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AcidConceptPage").then((module) => module.AcidTermPage),
);

export const ControlClientServerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.ControlClientServerTermPage),
);

export const ConditionalBranchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.ConditionalBranchTermPage),
);

export const LoopTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.LoopTermPage),
);

export const ObjectTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.ObjectTermPage),
);

export const ArrayTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.ArrayTermPage),
);

export const MonolithTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.MonolithTermPage),
);

export const MicroservicesTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.MicroservicesTermPage),
);

export const ServerlessTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.ServerlessTermPage),
);

export const DeployTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.DeployTermPage),
);

export const UserFlowTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.UserFlowTermPage),
);

export const WireframeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.WireframeTermPage),
);

export const PrototypeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.PrototypeTermPage),
);

export const IaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.IaTermPage),
);

export const A11yTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/flow-redesign-pages/FlowRedesignPages").then((module) => module.A11yTermPage),
);

export const LockfileTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.LockfileTermPage),
);

export const MonorepoTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.MonorepoTermPage),
);

export const EnvironmentVariableTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.EnvironmentVariableTermPage),
);

export const SourceMapTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.SourceMapTermPage),
);

export const LinterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.LinterTermPage),
);

export const FormatterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.FormatterTermPage),
);

export const ExpressionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.ExpressionTermPage),
);

export const FunctionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.FunctionTermPage),
);

export const ParameterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.ParameterTermPage),
);

export const ReturnValueTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages").then((module) => module.ReturnValueTermPage),
);

export const QuantizationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.QuantizationTermPage),
);

export const KnowledgeDistillationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.KnowledgeDistillationTermPage),
);

export const MixtureOfExpertsTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.MixtureOfExpertsTermPage),
);

export const SpeculativeDecodingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.SpeculativeDecodingTermPage),
);

export const BeamSearchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.BeamSearchTermPage),
);

export const ConfidenceCalibrationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.ConfidenceCalibrationTermPage),
);

export const DataContaminationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.DataContaminationTermPage),
);

export const OutOfDistributionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.OutOfDistributionTermPage),
);

export const ParameterEfficientFineTuningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.ParameterEfficientFineTuningTermPage),
);

export const ModelCardTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelMechanismsPages").then((module) => module.ModelCardTermPage),
);

export const ContainerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.ContainerTermPage),
);

export const InfrastructureContainerImageTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureContainerImageTermPage),
);

export const InfrastructureServiceDiscoveryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureServiceDiscoveryTermPage),
);

export const InfrastructureObservabilityTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureObservabilityTermPage),
);

export const InfrastructureSastTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureSastTermPage),
);

export const InfrastructureSecretScanningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureSecretScanningTermPage),
);

export const InfrastructureDependencyScanningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureDependencyScanningTermPage),
);

export const InfrastructureThreatModelingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureThreatModelingTermPage),
);

export const InfrastructureToolApprovalTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureToolApprovalTermPage),
);

export const ToolChoiceTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.ToolChoiceTermPage),
);

export const ToolResultTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.ToolResultTermPage),
);

export const PlanAndExecuteTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.PlanAndExecuteTermPage),
);

export const AgentOrchestrationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.AgentOrchestrationTermPage),
);

export const HandoffTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.HandoffTermPage),
);

export const SubagentTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.SubagentTermPage),
);

export const HumanInTheLoopTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.HumanInTheLoopTermPage),
);

export const GuardrailTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.GuardrailTermPage),
);

export const ModerationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.ModerationTermPage),
);

export const FineTuningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.FineTuningTermPage),
);

export const AgentLoopTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.AgentLoopTermPage),
);

export const AgentMemoryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.AgentMemoryTermPage),
);

export const WorkingMemoryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.WorkingMemoryTermPage),
);

export const ExecutionSandboxTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.ExecutionSandboxTermPage),
);

export const EmbeddingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.EmbeddingTermPage),
);

export const VectorStoreTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.VectorStoreTermPage),
);

export const RetrievalTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.RetrievalTermPage),
);

export const ChunkingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.ChunkingTermPage),
);

export const RerankingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.RerankingTermPage),
);

export const GenerativeAiConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GenerativeAiConceptPage").then((module) => module.GenerativeAiConceptTermPage),
);

export const MultimodalConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/MultimodalConceptPage").then((module) => module.MultimodalConceptTermPage),
);

export const ReasoningModelConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReasoningModelConceptPage").then((module) => module.ReasoningModelConceptTermPage),
);

export const SystemPromptConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/SystemPromptConceptPage").then((module) => module.SystemPromptConceptTermPage),
);

export const FewShotPromptingConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/FewShotPromptingConceptPage").then((module) => module.FewShotPromptingConceptTermPage),
);

export const ZeroShotPromptingConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ZeroShotPromptingConceptPage").then((module) => module.ZeroShotPromptingConceptTermPage),
);

export const TemperatureConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/TemperatureConceptPage").then((module) => module.TemperatureConceptTermPage),
);

export const ContextWindowConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ContextWindowConceptPage").then((module) => module.ContextWindowConceptTermPage),
);

export const TokenizationConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/TokenizationConceptPage").then((module) => module.TokenizationConceptTermPage),
);

export const PromptInjectionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.PromptInjectionTermPage),
);

export const CompilerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.CompilerTermPage),
);

export const InterpreterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.InterpreterTermPage),
);

export const TranspilerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.TranspilerTermPage),
);

export const BuildToolTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.BuildToolTermPage),
);

export const BundlerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.BundlerTermPage),
);

export const DevServerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.DevServerTermPage),
);

export const HotReloadTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.HotReloadTermPage),
);

export const HmrTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.HmrTermPage),
);

export const DependencyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.DependencyTermPage),
);

export const SemanticVersioningTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.SemanticVersioningTermPage),
);

export const TransformerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.TransformerTermPage),
);

export const AttentionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.AttentionTermPage),
);

export const InferenceTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.InferenceTermPage),
);

export const PretrainingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.PretrainingTermPage),
);

export const KvCacheTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.KvCacheTermPage),
);

export const AgentWorkflowTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.AgentWorkflowTermPage),
);

export const BackpressureTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.BackpressureTermPage),
);

export const DeadLetterQueueTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.DeadLetterQueueTermPage),
);

export const EventualConsistencyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AiStackConceptPages").then((module) => module.EventualConsistencyTermPage),
);

export const RepoCommitTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.RepoCommitTermPage),
);

export const BranchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.BranchTermPage),
);

export const WorkingTreeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.WorkingTreeTermPage),
);

export const StagingAreaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.StagingAreaTermPage),
);

export const DiffTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.DiffTermPage),
);

export const CheckoutSwitchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.CheckoutSwitchTermPage),
);

export const RemoteTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.RemoteTermPage),
);

export const CloneTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.CloneTermPage),
);

export const PullTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.PullTermPage),
);

export const GitFetchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.FetchTermPage),
);

export const PushTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.PushTermPage),
);

export const MergeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.MergeTermPage),
);

export const GitRebaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.RebaseTermPage),
);

export const MergeConflictTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.MergeConflictTermPage),
);

export const GitRevertTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.RevertTermPage),
);

export const GitStashTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.StashTermPage),
);

export const GitPullRequestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.PullRequestTermPage),
);

export const GitCodeReviewTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.CodeReviewTermPage),
);

export const CiTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.CiTermPage),
);

export const CdTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.CdTermPage),
);

export const PreviewDeploymentTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.PreviewDeploymentTermPage),
);

export const RollbackTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/GitConceptPages").then((module) => module.RollbackTermPage),
);

export const UserStoryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.UserStoryTermPage),
);

export const ProblemStatementTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.ProblemStatementTermPage),
);

export const TargetUserTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.TargetUserTermPage),
);

export const UseCaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.UseCaseTermPage),
);

export const AcceptanceCriteriaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.AcceptanceCriteriaTermPage),
);

export const ScopeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.ScopeTermPage),
);

export const RoadmapTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.RoadmapTermPage),
);

export const PriorityTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProductConceptPages").then((module) => module.PriorityTermPage),
);

export const RbacRoleTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/rbac").then((module) => module.RbacRoleTermPage),
);

export const RelationalDatabaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/BackendNetworkTermPages").then((module) => module.RelationalDatabaseTermPage),
);

export const NosqlTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/BackendNetworkTermPages").then((module) => module.NosqlTermPage),
);

export const RowTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/BackendNetworkTermPages").then((module) => module.RowTermPage),
);

export const TcpTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/tcp").then((module) => module.TcpTermPage),
);

export const UdpTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/udp").then((module) => module.UdpTermPage),
);

export const TlsHandshakeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/tls-handshake").then((module) => module.TlsHandshakeTermPage),
);

export const ResponseBodyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/response-body").then((module) => module.ResponseBodyTermPage),
);

export const ResponseHeaderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/response-header").then((module) => module.ResponseHeaderTermPage),
);

export const CookieTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/cookie").then((module) => module.CookieTermPage),
);

export const CorsTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/cors").then((module) => module.CorsTermPage),
);

export const WebSocketTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/websocket").then((module) => module.WebSocketTermPage),
);

export const ApiKeyLifecycleTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/transport-http-pages/api-key").then((module) => module.ApiKeyTermPage),
);

export const FirewallTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/firewall").then((module) => module.FirewallTermPage),
);

export const IpAddressTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/ip-address").then((module) => module.IpAddressTermPage),
);

export const NetworkPortTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/network-port").then((module) => module.NetworkPortTermPage),
);

export const PacketTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/packet").then((module) => module.PacketTermPage),
);

export const UrlTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/url").then((module) => module.UrlTermPage),
);

export const HostnameTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/hostname").then((module) => module.HostnameTermPage),
);

export const DnsRecordTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/dns-record").then((module) => module.DnsRecordTermPage),
);

export const DnsResolverTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/dns-resolver").then((module) => module.DnsResolverTermPage),
);

export const CacheControlTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/cache-control").then((module) => module.CacheControlTermPage),
);

export const MimeTypeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/backend-boundary-pages/mime-type").then((module) => module.MimeTypeTermPage),
);

export const FeatureFlagTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/feature-flag-pages/feature-flag-page").then((module) => module.FeatureFlagTermPage),
);

export const UnitTestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/unit-test-pages/unit-test-page").then((module) => module.UnitTestTermPage),
);

export const IntegrationTestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/integration-test-pages/integration-test-page").then((module) => module.IntegrationTestTermPage),
);

export const E2eTestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/e2e-test-pages/e2e-test-page").then((module) => module.E2eTestTermPage),
);

export const SmokeTestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/smoke-test-pages/smoke-test-page").then((module) => module.SmokeTestTermPage),
);

export const RegressionTestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/regression-test-pages/regression-test-page").then((module) => module.RegressionTestTermPage),
);

export const TestCaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/test-case-pages/test-case-page").then((module) => module.TestCaseTermPage),
);

export const MockTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/mock-pages/mock-page").then((module) => module.MockTermPage),
);

export const AssertionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/assertion-pages/assertion-page").then((module) => module.AssertionTermPage),
);

export const CodeCoverageTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/code-coverage-pages/code-coverage-page").then((module) => module.CodeCoverageTermPage),
);

export const ApiTestingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/api-testing-pages/api-testing-page").then((module) => module.ApiTestingTermPage),
);

export const LeastPrivilegeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/least-privilege-pages/least-privilege-page").then((module) => module.LeastPrivilegeTermPage),
);

export const HashingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/hashing-pages/hashing-page").then((module) => module.HashingTermPage),
);

export const InputValidationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/input-validation-pages/input-validation-page").then((module) => module.InputValidationTermPage),
);

export const EncryptionAtRestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/encryption-at-rest-pages/encryption-at-rest-page").then((module) => module.EncryptionAtRestTermPage),
);

export const EncryptionTransitTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EncryptionTransitConceptPage").then((module) => module.EncryptionTransitTermPage),
);

export const SessionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/IdentityConceptPages").then((module) => module.SessionTermPage),
);

export const JwtTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/IdentityConceptPages").then((module) => module.JwtTermPage),
);

export const OAuthTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/IdentityConceptPages").then((module) => module.OAuthTermPage),
);

export const LoadBalancerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AccessConceptPages").then((module) => module.LoadBalancerTermPage),
);

export const AuthTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AccessConceptPages").then((module) => module.AuthTermPage),
);

export const AuthorizationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AccessConceptPages").then((module) => module.AuthorizationTermPage),
);

export const ServerTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EdgeConceptPages").then((module) => module.ServerTermPage),
);

export const ApiGatewayTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EdgeConceptPages").then((module) => module.ApiGatewayTermPage),
);

export const ReverseProxyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EdgeConceptPages").then((module) => module.ReverseProxyTermPage),
);

export const StreamingOutputTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelOutputPages").then((module) => module.StreamingOutputTermPage),
);

export const StructuredOutputTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelOutputPages").then((module) => module.StructuredOutputTermPage),
);

export const FunctionCallingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelOutputPages").then((module) => module.FunctionCallingTermPage),
);

export const ModelRoutingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelDeliveryPages").then((module) => module.ModelRoutingTermPage),
);

export const ModelFallbackTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelDeliveryPages").then((module) => module.ModelFallbackTermPage),
);

export const PromptCachingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ModelDeliveryPages").then((module) => module.PromptCachingTermPage),
);

export const BenchmarkTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AssessmentConceptPages").then((module) => module.BenchmarkTermPage),
);

export const GraderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AssessmentConceptPages").then((module) => module.GraderTermPage),
);

export const InfrastructureEvaluationDatasetTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/InfrastructureRedesignPages").then((module) => module.InfrastructureEvaluationDatasetTermPage),
);

export const BoundaryPermissionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryPermissionTermPage),
);

export const BoundaryXssTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryXssTermPage),
);

export const BoundarySkillTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundarySkillTermPage),
);

export const BoundaryEvaluationRunTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryEvaluationRunTermPage),
);

export const BoundarySafetyEvaluationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundarySafetyEvaluationTermPage),
);

export const BoundaryCostEvaluationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryCostEvaluationTermPage),
);

export const BoundaryLatencyEvaluationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryLatencyEvaluationTermPage),
);

export const BoundaryPassFailGraderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryPassFailGraderTermPage),
);

export const BoundaryGradingRubricTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryGradingRubricTermPage),
);

export const BoundaryHumanGraderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages").then((module) => module.BoundaryHumanGraderTermPage),
);

export const RegressionEvaluationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AssessmentConceptPages").then((module) => module.RegressionEvaluationTermPage),
);

export const ModelGraderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AssessmentConceptPages").then((module) => module.ModelGraderTermPage),
);

export const ContextOverflowTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AssessmentConceptPages").then((module) => module.ContextOverflowTermPage),
);

export const GroundingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/QualityConceptPages").then((module) => module.GroundingTermPage),
);

export const HallucinationConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HallucinationConceptPage").then((module) => module.HallucinationConceptTermPage),
);

export const EvaluationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/QualityConceptPages").then((module) => module.EvaluationTermPage),
);

export const HybridSearchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EvidenceConceptPages").then((module) => module.HybridSearchTermPage),
);

export const CitationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EvidenceConceptPages").then((module) => module.CitationTermPage),
);

export const SemanticSearchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/SemanticConceptPages").then((module) => module.SemanticSearchTermPage),
);

export const RagConceptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/SemanticConceptPages").then((module) => module.RagConceptTermPage),
);

export const FrameTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RetrievalConceptPages").then((module) => module.FrameTermPage),
);

export const FullTextTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RetrievalConceptPages").then((module) => module.FullTextTermPage),
);

export const VectorDatabaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RetrievalConceptPages").then((module) => module.VectorDatabaseTermPage),
);

export const DatasetTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProvenanceConceptPages").then((module) => module.DatasetTermPage),
);

export const QualityTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProvenanceConceptPages").then((module) => module.QualityTermPage),
);

export const LineageTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProvenanceConceptPages").then((module) => module.LineageTermPage),
);

export const IngestionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataFlowConceptPages").then((module) => module.IngestionTermPage),
);

export const TransformationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataFlowConceptPages").then((module) => module.TransformationTermPage),
);

export const ValidationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataFlowConceptPages").then((module) => module.ValidationTermPage),
);

export const PipelineTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/CoordinationConceptPages").then((module) => module.PipelineTermPage),
);

export const WebhookTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/CoordinationConceptPages").then((module) => module.WebhookTermPage),
);

export const DistributedSystemTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.DistributedSystemTermPage),
);

export const BatchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProcessingConceptPages").then((module) => module.BatchTermPage),
);

export const StreamTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ProcessingConceptPages").then((module) => module.StreamTermPage),
);

export const EventDrivenArchitectureTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/control-redesign-pages/ControlRedesignPages").then((module) => module.EventDrivenArchitectureTermPage),
);

export const BackupTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DistributionConceptPages").then((module) => module.BackupTermPage),
);

export const ShardingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DistributionConceptPages").then((module) => module.ShardingTermPage),
);

export const QueueTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DistributionConceptPages").then((module) => module.QueueTermPage),
);

export const CacheTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReuseConceptPages").then((module) => module.CacheTermPage),
);

export const PoolTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReuseConceptPages").then((module) => module.PoolTermPage),
);

export const ReplicationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReuseConceptPages").then((module) => module.ReplicationTermPage),
);

export const SqlTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/QueryConceptPages").then((module) => module.SqlTermPage),
);

export const MigrationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/QueryConceptPages").then((module) => module.MigrationTermPage),
);

export const OrmTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/QueryConceptPages").then((module) => module.OrmTermPage),
);

export const DatabaseSchemaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StructureConceptPages").then((module) => module.DatabaseSchemaTermPage),
);

export const JoinTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StructureConceptPages").then((module) => module.JoinTermPage),
);

export const UniqueConstraintTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StructureConceptPages").then((module) => module.UniqueConstraintTermPage),
);

export const AgentHarnessTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AgentHarnessTermPage").then((module) => module.AgentHarnessTermPage),
);

export const ToolCallingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RelatedConceptPages").then((module) => module.ToolCallingTermPage),
);

export const ContextTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RelatedConceptPages").then((module) => module.ContextTermPage),
);

export const MemoryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ExtendedConceptPages").then((module) => module.MemoryTermPage),
);

export const PromptTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ExtendedConceptPages").then((module) => module.PromptTermPage),
);

export const McpTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ExtendedConceptPages").then((module) => module.McpTermPage),
);

export const LlmTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/FoundationConceptPages").then((module) => module.LlmTermPage),
);

export const TokenTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/FoundationConceptPages").then((module) => module.TokenTermPage),
);

export const AgentTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/FoundationConceptPages").then((module) => module.AgentTermPage),
);

export const ComponentTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/UiConceptPages").then((module) => module.ComponentTermPage),
);

export const PropsTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/UiConceptPages").then((module) => module.PropsTermPage),
);

export const StateTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/UiConceptPages").then((module) => module.StateTermPage),
);

export const EventTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EventConceptPages").then((module) => module.EventTermPage),
);

export const BubblingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EventConceptPages").then((module) => module.BubblingTermPage),
);

export const HookTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/EventConceptPages").then((module) => module.HookTermPage),
);

export const EffectTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/BrowserConceptPages").then((module) => module.EffectTermPage),
);

export const BrowserApiTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/BrowserConceptPages").then((module) => module.BrowserApiTermPage),
);

export const FetchTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AsyncConceptPages").then((module) => module.FetchTermPage),
);

export const PromiseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AsyncConceptPages").then((module) => module.PromiseTermPage),
);

export const AwaitTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/AsyncConceptPages").then((module) => module.AwaitTermPage),
);

export const JsonTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataConceptPages").then((module) => module.JsonTermPage),
);

export const JsonSchemaTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/DataConceptPages").then((module) => module.JsonSchemaTermPage),
);

export const RequestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HttpConceptPages").then((module) => module.RequestTermPage),
);

export const ResponseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HttpConceptPages").then((module) => module.ResponseTermPage),
);

export const HttpMethodTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HttpConceptPages").then((module) => module.HttpMethodTermPage),
);

export const StatusCodeTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HttpConceptPages").then((module) => module.StatusCodeTermPage),
);

export const HttpHeaderTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/HttpConceptPages").then((module) => module.HttpHeaderTermPage),
);

export const QueryParameterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RequestInputPages").then((module) => module.QueryParameterTermPage),
);

export const PathParameterTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RequestInputPages").then((module) => module.PathParameterTermPage),
);

export const RequestBodyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RequestInputPages").then((module) => module.RequestBodyTermPage),
);

export const ApiTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ApiConceptPages").then((module) => module.ApiTermPage),
);

export const EndpointTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ApiConceptPages").then((module) => module.EndpointTermPage),
);

export const RestTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ApiConceptPages").then((module) => module.RestTermPage),
);

export const PaginationTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ApiConceptPages").then((module) => module.PaginationTermPage),
);

export const RateLimitingTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ApiConceptPages").then((module) => module.RateLimitingTermPage),
);

export const TimeoutTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReliabilityConceptPages").then((module) => module.TimeoutTermPage),
);

export const RetryTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReliabilityConceptPages").then((module) => module.RetryTermPage),
);

export const IdempotencyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/ReliabilityConceptPages").then((module) => module.IdempotencyTermPage),
);

export const DatabaseTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StorageConceptPages").then((module) => module.DatabaseTermPage),
);

export const IndexTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StorageConceptPages").then((module) => module.IndexTermPage),
);

export const TransactionTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/StorageConceptPages").then((module) => module.TransactionTermPage),
);

export const TableTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RelationalConceptPages").then((module) => module.TableTermPage),
);

export const PrimaryKeyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RelationalConceptPages").then((module) => module.PrimaryKeyTermPage),
);

export const ForeignKeyTermPage = dynamic<BespokeTermPageProps>(() =>
  import("@/components/terms/RelationalConceptPages").then((module) => module.ForeignKeyTermPage),
);
