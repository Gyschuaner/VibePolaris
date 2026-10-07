import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import { ReadingNotes } from "@/components/notes/ReadingNotes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermDetailExperience } from "@/components/TermDetailExperience";
import type { BespokeTermPageProps } from "@/components/terms/BespokeTermScaffold";
import { ComponentTermPage, PropsTermPage, StateTermPage } from "@/components/terms/UiConceptPages";
import { EventTermPage, BubblingTermPage, HookTermPage } from "@/components/terms/EventConceptPages";
import { EffectTermPage, BrowserApiTermPage } from "@/components/terms/BrowserConceptPages";
import { FetchTermPage, PromiseTermPage, AwaitTermPage } from "@/components/terms/AsyncConceptPages";
import { JsonTermPage, JsonSchemaTermPage } from "@/components/terms/DataConceptPages";
import { RequestTermPage, ResponseTermPage, HttpMethodTermPage, StatusCodeTermPage, HttpHeaderTermPage } from "@/components/terms/HttpConceptPages";
import { QueryParameterTermPage, PathParameterTermPage, RequestBodyTermPage } from "@/components/terms/RequestInputPages";
import { ApiTermPage, EndpointTermPage, RestTermPage, PaginationTermPage, RateLimitingTermPage } from "@/components/terms/ApiConceptPages";
import { TimeoutTermPage, RetryTermPage, IdempotencyTermPage } from "@/components/terms/ReliabilityConceptPages";
import { DatabaseTermPage, IndexTermPage, TransactionTermPage } from "@/components/terms/StorageConceptPages";
import { TableTermPage, PrimaryKeyTermPage, ForeignKeyTermPage } from "@/components/terms/RelationalConceptPages";
import { DatabaseSchemaTermPage, JoinTermPage, UniqueConstraintTermPage } from "@/components/terms/StructureConceptPages";
import { CacheTermPage, PoolTermPage, ReplicationTermPage } from "@/components/terms/ReuseConceptPages";
import { AgentHarnessTermPage } from "@/components/terms/AgentHarnessTermPage";
import { ContextTermPage, ToolCallingTermPage } from "@/components/terms/RelatedConceptPages";
import { MemoryTermPage, PromptTermPage, McpTermPage, SandboxTermPage } from "@/components/terms/ExtendedConceptPages";
import { LlmTermPage, TokenTermPage, AgentTermPage } from "@/components/terms/FoundationConceptPages";
import { SemanticSearchTermPage, RagConceptTermPage } from "@/components/terms/SemanticConceptPages";
import { HybridSearchTermPage, CitationTermPage } from "@/components/terms/EvidenceConceptPages";
import { TermExperiencePage } from "@/components/terms/TermExperiencePage";
import { getPublishedTerm, getRelatedTerms, publishedTerms } from "@/lib/content";
import { getTermExperience } from "@/lib/term-experiences";

type TermPageProps = { params: Promise<{ slug: string }> };

import { SqlTermPage, MigrationTermPage, OrmTermPage } from "@/components/terms/QueryConceptPages";

import { BackupTermPage, ShardingTermPage, QueueTermPage } from "@/components/terms/DistributionConceptPages";

import { BatchTermPage, StreamTermPage, EventDrivenTermPage } from "@/components/terms/ProcessingConceptPages";
import { PipelineTermPage, WebhookTermPage, DistributedTermPage } from "@/components/terms/CoordinationConceptPages";
import { IngestionTermPage, TransformationTermPage, ValidationTermPage } from "@/components/terms/DataFlowConceptPages";
import { DatasetTermPage, QualityTermPage, LineageTermPage } from "@/components/terms/ProvenanceConceptPages";

import { FrameTermPage, FullTextTermPage, VectorDatabaseTermPage } from "@/components/terms/RetrievalConceptPages";

import { GroundingTermPage, HallucinationTermPage, EvaluationTermPage } from '@/components/terms/QualityConceptPages';
import { BenchmarkTermPage, GraderTermPage, EvalDatasetTermPage, EvaluationRunTermPage, GradingRubricTermPage, RegressionEvaluationTermPage, SafetyEvaluationTermPage, CostEvaluationTermPage, LatencyEvaluationTermPage, HumanGraderTermPage, ModelGraderTermPage, PassFailGraderTermPage, ContextOverflowTermPage } from '@/components/terms/AssessmentConceptPages';

import { ModelRoutingTermPage, ModelFallbackTermPage, PromptCachingTermPage } from '@/components/terms/ModelDeliveryPages';

import { StreamingOutputTermPage, StructuredOutputTermPage, FunctionCallingTermPage } from '@/components/terms/ModelOutputPages';
import { ServerTermPage, ApiGatewayTermPage, ReverseProxyTermPage } from '@/components/terms/EdgeConceptPages';
import { LoadBalancerTermPage, AuthTermPage, AuthorizationTermPage } from '@/components/terms/AccessConceptPages';
import { SessionTermPage, JwtTermPage, OAuthTermPage } from '@/components/terms/IdentityConceptPages';
import { SkillTermPage } from '@/components/terms/SkillConceptPages';
import { AdaptiveLayoutTermPage, AppLifecycleTermPage, AppPermissionTermPage, BoxModelTermPage, CrossPlatformDevelopmentTermPage, CssSelectorTermPage, OfflineFirstTermPage, PushNotificationTermPage, SafeAreaTermPage, WebviewTermPage } from '@/components/terms/MobileCssConceptPages';
import { ContainerImageTermPage, DependencyScanningTermPage, ObservabilityTermPage, PermissionBoundaryTermPage, SastTermPage, SecretScanningTermPage, ServiceDiscoveryTermPage, ThreatModelingTermPage, ToolApprovalTermPage, XssTermPage, ToolChoiceTermPage, ToolResultTermPage, PlanAndExecuteTermPage, AgentOrchestrationTermPage, HandoffTermPage, SubagentTermPage, HumanInTheLoopTermPage, GuardrailTermPage, ModerationTermPage, FineTuningTermPage, AgentLoopTermPage, AgentMemoryTermPage, WorkingMemoryTermPage, ExecutionSandboxTermPage, EmbeddingTermPage, VectorStoreTermPage, RetrievalTermPage, ChunkingTermPage, RerankingTermPage, TemperatureTermPage, TokenizationTermPage, PromptInjectionTermPage, CompilerTermPage, InterpreterTermPage, TranspilerTermPage, BuildToolTermPage, BundlerTermPage, DevServerTermPage, HotReloadTermPage, HmrTermPage, DependencyTermPage, SemanticVersioningTermPage, TransformerTermPage, AttentionTermPage, InferenceTermPage, PretrainingTermPage, KvCacheTermPage, AgentWorkflowTermPage, BackpressureTermPage, DeadLetterQueueTermPage, EventualConsistencyTermPage } from '@/components/terms/AiStackConceptPages';
import { ReasoningModelConceptTermPage } from '@/components/terms/ReasoningModelConceptPage';
import { SystemPromptConceptTermPage } from '@/components/terms/SystemPromptConceptPage';
import { FewShotPromptingConceptTermPage } from '@/components/terms/FewShotPromptingConceptPage';
import { ZeroShotPromptingConceptTermPage } from '@/components/terms/ZeroShotPromptingConceptPage';
import { TemperatureConceptTermPage } from '@/components/terms/TemperatureConceptPage';
import { ContextWindowConceptTermPage } from '@/components/terms/ContextWindowConceptPage';
import { ContainerTermPage, InfrastructureContainerImageTermPage, InfrastructureServiceDiscoveryTermPage, InfrastructureObservabilityTermPage, InfrastructureSastTermPage, InfrastructureSecretScanningTermPage, InfrastructureDependencyScanningTermPage, InfrastructureThreatModelingTermPage, InfrastructureToolApprovalTermPage, InfrastructureEvaluationDatasetTermPage } from '@/components/terms/control-redesign-pages/InfrastructureRedesignPages';
import { BoundaryPermissionTermPage, BoundaryXssTermPage, BoundarySkillTermPage, BoundaryEvaluationRunTermPage, BoundarySafetyEvaluationTermPage, BoundaryCostEvaluationTermPage, BoundaryLatencyEvaluationTermPage, BoundaryPassFailGraderTermPage, BoundaryGradingRubricTermPage, BoundaryHumanGraderTermPage } from '@/components/terms/control-redesign-pages/BoundaryEvaluationRedesignPages';
import { BranchTermPage, CheckoutSwitchTermPage, CdTermPage, CiTermPage, CloneTermPage, CodeReviewTermPage as GitCodeReviewTermPage, DiffTermPage, FetchTermPage as GitFetchTermPage, MergeConflictTermPage, MergeTermPage, PreviewDeploymentTermPage, PullRequestTermPage as GitPullRequestTermPage, PullTermPage, PushTermPage, RebaseTermPage as GitRebaseTermPage, RemoteTermPage, RepoCommitTermPage, RevertTermPage as GitRevertTermPage, RollbackTermPage, StashTermPage as GitStashTermPage, StagingAreaTermPage, WorkingTreeTermPage } from "@/components/terms/GitConceptPages";
import { AcceptanceCriteriaTermPage, PriorityTermPage, ProblemStatementTermPage, RoadmapTermPage, ScopeTermPage, TargetUserTermPage, UseCaseTermPage, UserStoryTermPage } from "@/components/terms/ProductConceptPages";
import { NosqlTermPage, RelationalDatabaseTermPage, RowTermPage } from "@/components/terms/BackendNetworkTermPages";
import { TcpTermPage } from "@/components/terms/transport-http-pages/tcp";
import { UdpTermPage } from "@/components/terms/transport-http-pages/udp";
import { TlsHandshakeTermPage } from "@/components/terms/transport-http-pages/tls-handshake";
import { ResponseBodyTermPage } from "@/components/terms/transport-http-pages/response-body";
import { ResponseHeaderTermPage } from "@/components/terms/transport-http-pages/response-header";
import { CookieTermPage } from "@/components/terms/transport-http-pages/cookie";
import { CorsTermPage } from "@/components/terms/transport-http-pages/cors";
import { WebSocketTermPage } from "@/components/terms/transport-http-pages/websocket";
import { ApiKeyTermPage as ApiKeyLifecycleTermPage } from "@/components/terms/transport-http-pages/api-key";
import { RbacRoleTermPage } from "@/components/terms/transport-http-pages/rbac";
import { FirewallTermPage } from "@/components/terms/backend-boundary-pages/firewall";
import { IpAddressTermPage } from "@/components/terms/backend-boundary-pages/ip-address";
import { NetworkPortTermPage } from "@/components/terms/backend-boundary-pages/network-port";
import { PacketTermPage } from "@/components/terms/backend-boundary-pages/packet";
import { UrlTermPage } from "@/components/terms/backend-boundary-pages/url";
import { HostnameTermPage } from "@/components/terms/backend-boundary-pages/hostname";
import { DnsRecordTermPage } from "@/components/terms/backend-boundary-pages/dns-record";
import { DnsResolverTermPage } from "@/components/terms/backend-boundary-pages/dns-resolver";
import { CacheControlTermPage } from "@/components/terms/backend-boundary-pages/cache-control";
import { MimeTypeTermPage } from "@/components/terms/backend-boundary-pages/mime-type";
import { FeatureFlagTermPage } from "@/components/terms/feature-flag-pages/feature-flag-page";
import { UnitTestTermPage } from "@/components/terms/unit-test-pages/unit-test-page";
import { IntegrationTestTermPage } from "@/components/terms/integration-test-pages/integration-test-page";
import { E2eTestTermPage } from "@/components/terms/e2e-test-pages/e2e-test-page";
import { SmokeTestTermPage } from "@/components/terms/smoke-test-pages/smoke-test-page";
import { RegressionTestTermPage } from "@/components/terms/regression-test-pages/regression-test-page";
import { TestCaseTermPage } from "@/components/terms/test-case-pages/test-case-page";
import { MockTermPage } from "@/components/terms/mock-pages/mock-page";
import { AssertionTermPage } from "@/components/terms/assertion-pages/assertion-page";
import { CodeCoverageTermPage } from "@/components/terms/code-coverage-pages/code-coverage-page";
import { ApiTestingTermPage } from "@/components/terms/api-testing-pages/api-testing-page";
import { LeastPrivilegeTermPage } from "@/components/terms/least-privilege-pages/least-privilege-page";
import { HashingTermPage } from "@/components/terms/hashing-pages/hashing-page";
import { InputValidationTermPage } from "@/components/terms/input-validation-pages/input-validation-page";
import { EncryptionAtRestTermPage } from "@/components/terms/encryption-at-rest-pages/encryption-at-rest-page";
import { EncryptionTransitTermPage } from "@/components/terms/EncryptionTransitConceptPage";
import { GenerativeAiConceptTermPage } from "@/components/terms/GenerativeAiConceptPage";
import { MultimodalConceptTermPage } from "@/components/terms/MultimodalConceptPage";
import { FlexboxTermPage } from "@/components/terms/flexbox-pages/flexbox-page";
import { CssGridTermPage } from "@/components/terms/css-grid-pages/css-grid-page";
import { BreakpointTermPage } from "@/components/terms/breakpoint-pages/breakpoint-page";
import { MediaQueryTermPage } from "@/components/terms/media-query-pages/media-query-page";
import { CodeSplittingTermPage } from "@/components/terms/code-splitting-pages/code-splitting-page";
import { LazyLoadingTermPage } from "@/components/terms/lazy-loading-pages/lazy-loading-page";
import { DockerfileTermPage } from "@/components/terms/dockerfile-pages/dockerfile-page";
import { InfrastructureAsCodeTermPage } from "@/components/terms/infrastructure-as-code-pages/infrastructure-as-code-page";
import { CdnTermPage } from "@/components/terms/cdn-pages/cdn-page";
import { VisualRegressionTestingTermPage } from "@/components/terms/visual-regression-testing-pages/visual-regression-testing-page";
import { CascadeTermPage } from "@/components/terms/cascade-pages/cascade-page";
import { SpecificityTermPage } from "@/components/terms/specificity-pages/specificity-page";
import { PositioningTermPage } from "@/components/terms/positioning-pages/positioning-page";
import { ModuleTermPage } from "@/components/terms/module-pages/module-page";
import { HydrationTermPage } from "@/components/terms/rendering-pages/hydration-page";
import { CsrTermPage } from "@/components/terms/rendering-pages/csr-page";
import { SsrTermPage } from "@/components/terms/rendering-pages/ssr-page";
import { SsgTermPage } from "@/components/terms/rendering-pages/ssg-page";
import { RoutingTermPage } from "@/components/terms/rendering-pages/routing-page";
import { LocalStorageTermPage } from "@/components/terms/rendering-pages/local-storage-page";
import { ConversionRateTermPage, DesignTokenTermPage, FeedbackTermPage, FocusManagementTermPage, FunnelTermPage, IterationTermPage, MockupTermPage, SitemapTermPage, UsabilityTestingTermPage, VisualHierarchyTermPage } from "@/components/terms/product-design-pages/ProductDesignPages";
import { A11yTermPage, ClientServerTermPage, DeployTermPage, IaTermPage, LoadingStateTermPage, MicrointeractionTermPage, PrototypeTermPage, ReducedMotionTermPage, UserFlowTermPage, WireframeTermPage } from "@/components/terms/flow-redesign-pages/FlowRedesignPages";
import { DebounceTermPage } from "@/components/terms/DebounceConceptPage";
import { OptimisticUpdateTermPage } from "@/components/terms/OptimisticUpdateConceptPage";
import { CircuitBreakerTermPage } from "@/components/terms/CircuitBreakerConceptPage";
import { DataContractTermPage } from "@/components/terms/DataContractConceptPage";
import { ContextCompactionTermPage } from "@/components/terms/ContextCompactionConceptPage";
import { ToolSchemaTermPage } from "@/components/terms/ToolSchemaConceptPage";
import { LatencyBudgetTermPage } from "@/components/terms/LatencyBudgetConceptPage";
import { ColumnTermPage } from "@/components/terms/ColumnConceptPage";
import { AcidTermPage } from "@/components/terms/AcidConceptPage";
import { EnvironmentVariableTermPage, ExpressionTermPage, FormatterTermPage, FunctionTermPage, LinterTermPage, LockfileTermPage, MonorepoTermPage, ParameterTermPage, ReturnValueTermPage, SourceMapTermPage } from "@/components/terms/toolchain-redesign-pages/ToolchainRedesignPages";
import { ArrayTermPage, ConditionalBranchTermPage, ControlClientServerTermPage, DistributedSystemTermPage, EventDrivenArchitectureTermPage, LoopTermPage, MicroservicesTermPage, MonolithTermPage, ObjectTermPage, ServerlessTermPage } from "@/components/terms/control-redesign-pages/ControlRedesignPages";

const articleTermPages = {
  'offline-first': OfflineFirstTermPage,
  'adaptive-layout': AdaptiveLayoutTermPage,
  'safe-area': SafeAreaTermPage,
  'app-lifecycle': AppLifecycleTermPage,
  'app-permission': AppPermissionTermPage,
  'push-notification': PushNotificationTermPage,
  'cross-platform-development': CrossPlatformDevelopmentTermPage,
  webview: WebviewTermPage,
  'css-selector': CssSelectorTermPage,
  'box-model': BoxModelTermPage,
  flexbox: FlexboxTermPage,
  'css-grid': CssGridTermPage,
  breakpoint: BreakpointTermPage,
  'media-query': MediaQueryTermPage,
  'code-splitting': CodeSplittingTermPage,
  'lazy-loading': LazyLoadingTermPage,
  dockerfile: DockerfileTermPage,
  'infrastructure-as-code': InfrastructureAsCodeTermPage,
  cdn: CdnTermPage,
  'visual-regression-testing': VisualRegressionTestingTermPage,
  cascade: CascadeTermPage,
  specificity: SpecificityTermPage,
  positioning: PositioningTermPage,
  module: ModuleTermPage,
  hydration: HydrationTermPage,
  csr: CsrTermPage,
  ssr: SsrTermPage,
  ssg: SsgTermPage,
  routing: RoutingTermPage,
  'local-storage': LocalStorageTermPage,
  'focus-management': FocusManagementTermPage,
  iteration: IterationTermPage,
  'conversion-rate': ConversionRateTermPage,
  funnel: FunnelTermPage,
  'usability-testing': UsabilityTestingTermPage,
  mockup: MockupTermPage,
  sitemap: SitemapTermPage,
  'design-token': DesignTokenTermPage,
  'visual-hierarchy': VisualHierarchyTermPage,
  feedback: FeedbackTermPage,
  'loading-state': LoadingStateTermPage,
  microinteraction: MicrointeractionTermPage,
  'reduced-motion': ReducedMotionTermPage,
  debounce: DebounceTermPage,
  'optimistic-update': OptimisticUpdateTermPage,
  'circuit-breaker': CircuitBreakerTermPage,
  'data-contract': DataContractTermPage,
  'context-compaction': ContextCompactionTermPage,
  'tool-schema': ToolSchemaTermPage,
  'latency-budget': LatencyBudgetTermPage,
  column: ColumnTermPage,
  acid: AcidTermPage,
  'client-server': ControlClientServerTermPage,
  'conditional-branch': ConditionalBranchTermPage,
  loop: LoopTermPage,
  object: ObjectTermPage,
  array: ArrayTermPage,
  monolith: MonolithTermPage,
  microservices: MicroservicesTermPage,
  serverless: ServerlessTermPage,
  deploy: DeployTermPage,
  'user-flow': UserFlowTermPage,
  wireframe: WireframeTermPage,
  prototype: PrototypeTermPage,
  ia: IaTermPage,
  a11y: A11yTermPage,
  lockfile: LockfileTermPage,
  monorepo: MonorepoTermPage,
  'environment-variable': EnvironmentVariableTermPage,
  'source-map': SourceMapTermPage,
  linter: LinterTermPage,
  formatter: FormatterTermPage,
  expression: ExpressionTermPage,
  function: FunctionTermPage,
  parameter: ParameterTermPage,
  'return-value': ReturnValueTermPage,
  container: ContainerTermPage,
  'container-image': InfrastructureContainerImageTermPage,
  'service-discovery': InfrastructureServiceDiscoveryTermPage,
  observability: InfrastructureObservabilityTermPage,
  sast: InfrastructureSastTermPage,
  'secret-scanning': InfrastructureSecretScanningTermPage,
  'dependency-scanning': InfrastructureDependencyScanningTermPage,
  'threat-modeling': InfrastructureThreatModelingTermPage,
  'tool-approval': InfrastructureToolApprovalTermPage,
  'tool-choice': ToolChoiceTermPage,
  'tool-result': ToolResultTermPage,
  'plan-and-execute': PlanAndExecuteTermPage,
  'agent-orchestration': AgentOrchestrationTermPage,
  handoff: HandoffTermPage,
  subagent: SubagentTermPage,
  'human-in-the-loop': HumanInTheLoopTermPage,
  guardrail: GuardrailTermPage,
  moderation: ModerationTermPage,
  'fine-tuning': FineTuningTermPage,
  'agent-loop': AgentLoopTermPage,
  'agent-memory': AgentMemoryTermPage,
  'working-memory': WorkingMemoryTermPage,
  'execution-sandbox': ExecutionSandboxTermPage,
  'embedding': EmbeddingTermPage,
  'vector-store': VectorStoreTermPage,
  'retrieval': RetrievalTermPage,
  'chunking': ChunkingTermPage,
  'reranking': RerankingTermPage,
  'generative-ai': GenerativeAiConceptTermPage,
  multimodal: MultimodalConceptTermPage,
  'reasoning-model': ReasoningModelConceptTermPage,
  'system-prompt': SystemPromptConceptTermPage,
  'few-shot-prompting': FewShotPromptingConceptTermPage,
  'zero-shot-prompting': ZeroShotPromptingConceptTermPage,
  temperature: TemperatureConceptTermPage,
  'context-window': ContextWindowConceptTermPage,
  tokenization: TokenizationTermPage,
  'prompt-injection': PromptInjectionTermPage,
  compiler: CompilerTermPage,
  interpreter: InterpreterTermPage,
  transpiler: TranspilerTermPage,
  'build-tool': BuildToolTermPage,
  bundler: BundlerTermPage,
  'dev-server': DevServerTermPage,
  'hot-reload': HotReloadTermPage,
  hmr: HmrTermPage,
  dependency: DependencyTermPage,
  'semantic-versioning': SemanticVersioningTermPage,
  transformer: TransformerTermPage,
  attention: AttentionTermPage,
  inference: InferenceTermPage,
  pretraining: PretrainingTermPage,
  "kv-cache": KvCacheTermPage,
  "agent-workflow": AgentWorkflowTermPage,
  backpressure: BackpressureTermPage,
  "dead-letter-queue": DeadLetterQueueTermPage,
  "eventual-consistency": EventualConsistencyTermPage,
  "repo-commit": RepoCommitTermPage,
  branch: BranchTermPage,
  "working-tree": WorkingTreeTermPage,
  "staging-area": StagingAreaTermPage,
  diff: DiffTermPage,
  "checkout-switch": CheckoutSwitchTermPage,
  remote: RemoteTermPage,
  clone: CloneTermPage,
  pull: PullTermPage,
  fetch: GitFetchTermPage,
  push: PushTermPage,
  merge: MergeTermPage,
  rebase: GitRebaseTermPage,
  "merge-conflict": MergeConflictTermPage,
  revert: GitRevertTermPage,
  stash: GitStashTermPage,
  "pull-request": GitPullRequestTermPage,
  "code-review": GitCodeReviewTermPage,
  ci: CiTermPage,
  cd: CdTermPage,
  "preview-deployment": PreviewDeploymentTermPage,
  rollback: RollbackTermPage,
  'user-story': UserStoryTermPage,
  'problem-statement': ProblemStatementTermPage,
  'target-user': TargetUserTermPage,
  'use-case': UseCaseTermPage,
  'acceptance-criteria': AcceptanceCriteriaTermPage,
  scope: ScopeTermPage,
  roadmap: RoadmapTermPage,
  priority: PriorityTermPage,
  rbac: RbacRoleTermPage,
  "relational-database": RelationalDatabaseTermPage,
  nosql: NosqlTermPage,
  row: RowTermPage,
  tcp: TcpTermPage,
  udp: UdpTermPage,
  "tls-handshake": TlsHandshakeTermPage,
  "response-body": ResponseBodyTermPage,
  "response-header": ResponseHeaderTermPage,
  cookie: CookieTermPage,
  cors: CorsTermPage,
  websocket: WebSocketTermPage,
  "api-key": ApiKeyLifecycleTermPage,
  firewall: FirewallTermPage,
  "ip-address": IpAddressTermPage,
  "network-port": NetworkPortTermPage,
  packet: PacketTermPage,
  url: UrlTermPage,
  hostname: HostnameTermPage,
  "dns-record": DnsRecordTermPage,
  "dns-resolver": DnsResolverTermPage,
  "cache-control": CacheControlTermPage,
  "mime-type": MimeTypeTermPage,
  "feature-flag": FeatureFlagTermPage,
  "unit-test": UnitTestTermPage,
  "integration-test": IntegrationTestTermPage,
  "e2e-test": E2eTestTermPage,
  "smoke-test": SmokeTestTermPage,
  "regression-test": RegressionTestTermPage,
  "test-case": TestCaseTermPage,
  "mock": MockTermPage,
  "assertion": AssertionTermPage,
  "code-coverage": CodeCoverageTermPage,
  "api-testing": ApiTestingTermPage,
  "least-privilege": LeastPrivilegeTermPage,
  "hashing": HashingTermPage,
  "input-validation": InputValidationTermPage,
  "encryption-at-rest": EncryptionAtRestTermPage,
  "encryption-in-transit": EncryptionTransitTermPage,
  session: SessionTermPage,
  jwt: JwtTermPage,
  oauth: OAuthTermPage,
  'load-balancer': LoadBalancerTermPage,
  auth: AuthTermPage,
  authorization: AuthorizationTermPage,
  server: ServerTermPage,
  'api-gateway': ApiGatewayTermPage,
  'reverse-proxy': ReverseProxyTermPage,
  'streaming-output': StreamingOutputTermPage,
  'structured-output': StructuredOutputTermPage,
  'function-calling': FunctionCallingTermPage,
  'model-routing': ModelRoutingTermPage,
  'model-fallback': ModelFallbackTermPage,
  'prompt-caching': PromptCachingTermPage,
  benchmark: BenchmarkTermPage,
  grader: GraderTermPage,
  'evaluation-dataset': InfrastructureEvaluationDatasetTermPage,
  'permission-boundary': BoundaryPermissionTermPage,
  xss: BoundaryXssTermPage,
  skill: BoundarySkillTermPage,
  'evaluation-run': BoundaryEvaluationRunTermPage,
  'safety-evaluation': BoundarySafetyEvaluationTermPage,
  'cost-evaluation': BoundaryCostEvaluationTermPage,
  'latency-evaluation': BoundaryLatencyEvaluationTermPage,
  'pass-fail-grader': BoundaryPassFailGraderTermPage,
  'grading-rubric': BoundaryGradingRubricTermPage,
  'human-grader': BoundaryHumanGraderTermPage,
  'regression-evaluation': RegressionEvaluationTermPage,
  'model-grader': ModelGraderTermPage,
  'context-overflow': ContextOverflowTermPage,
  grounding: GroundingTermPage,
  hallucination: HallucinationTermPage,
  eval: EvaluationTermPage,
  "hybrid-search": HybridSearchTermPage,
  citation: CitationTermPage,
  "semantic-search": SemanticSearchTermPage,
  rag: RagConceptTermPage,
  dataframe: FrameTermPage,
  "full-text-search": FullTextTermPage,
  "vector-database": VectorDatabaseTermPage,
  "dataset-data": DatasetTermPage,
  "data-quality": QualityTermPage,
  "data-lineage": LineageTermPage,
  "data-ingestion": IngestionTermPage,
  "data-transformation": TransformationTermPage,
  "data-validation": ValidationTermPage,
  "data-pipeline": PipelineTermPage,
  webhook: WebhookTermPage,
  "distributed-system": DistributedSystemTermPage,
  "batch-processing": BatchTermPage,
  "stream-processing": StreamTermPage,
  "event-driven-architecture": EventDrivenArchitectureTermPage,
  backup: BackupTermPage,
  sharding: ShardingTermPage,
  queue: QueueTermPage,
  cache: CacheTermPage,
  "connection-pool": PoolTermPage,
  replication: ReplicationTermPage,
  sql: SqlTermPage,
  "database-migration": MigrationTermPage,
  orm: OrmTermPage,
  "database-schema": DatabaseSchemaTermPage,
  join: JoinTermPage,
  "unique-constraint": UniqueConstraintTermPage,
  "agent-harness": AgentHarnessTermPage,
  tools: ToolCallingTermPage,
  context: ContextTermPage,
  memory: MemoryTermPage,
  prompt: PromptTermPage,
  mcp: McpTermPage,
  llm: LlmTermPage,
  token: TokenTermPage,
  agent: AgentTermPage,
  component: ComponentTermPage,
  props: PropsTermPage,
  state: StateTermPage,
  event: EventTermPage,
  "event-bubbling": BubblingTermPage,
  hook: HookTermPage,
  effect: EffectTermPage,
  "browser-api": BrowserApiTermPage,
  "fetch-api": FetchTermPage,
  promise: PromiseTermPage,
  "async-await": AwaitTermPage,
  json: JsonTermPage,
  "json-schema": JsonSchemaTermPage,
  request: RequestTermPage,
  response: ResponseTermPage,
  "http-method": HttpMethodTermPage,
  "status-code": StatusCodeTermPage,
  "http-header": HttpHeaderTermPage,
  "query-parameter": QueryParameterTermPage,
  "path-parameter": PathParameterTermPage,
  "request-body": RequestBodyTermPage,
  api: ApiTermPage,
  endpoint: EndpointTermPage,
  rest: RestTermPage,
  pagination: PaginationTermPage,
  "rate-limiting": RateLimitingTermPage,
  timeout: TimeoutTermPage,
  retry: RetryTermPage,
  idempotency: IdempotencyTermPage,
  database: DatabaseTermPage,
  index: IndexTermPage,
  transaction: TransactionTermPage,
  table: TableTermPage,
  "primary-key": PrimaryKeyTermPage,
  "foreign-key": ForeignKeyTermPage,
} satisfies Record<string, ComponentType<BespokeTermPageProps>>;

const dedicatedTermPages = {
  ...articleTermPages,
  css: TermDetailExperience,
  html: TermDetailExperience,
  javascript: TermDetailExperience,
} satisfies Record<string, ComponentType<BespokeTermPageProps>>;

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTerms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const term = getPublishedTerm((await params).slug);
  if (!term) return {};
  return {
    title: `${term.zh}${term.en ? ` ${term.en}` : ""}`,
    description: `用简短说明和交互演示了解${term.zh}，并查看常见用法与相关概念。`,
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const term = getPublishedTerm((await params).slug);
  if (!term) notFound();
  const related = getRelatedTerms(term);
  const currentIndex = publishedTerms.findIndex((candidate) => candidate.slug === term.slug);
  const previous = publishedTerms[(currentIndex - 1 + publishedTerms.length) % publishedTerms.length];
  const next = publishedTerms[(currentIndex + 1) % publishedTerms.length];
  const experience = getTermExperience(term.slug);
  const DedicatedTermPage = term.slug in dedicatedTermPages
    ? dedicatedTermPages[term.slug as keyof typeof dedicatedTermPages]
    : null;

  if (!DedicatedTermPage && !experience) notFound();

  return (
    <>
      <SiteHeader wide termSlug={term.slug} />
      <ReadingNotes key={term.slug} path={`/terms/${term.slug}`} title={term.zh} layout={term.slug in articleTermPages ? "concept" : "standalone"}>
      {DedicatedTermPage ? (
        <DedicatedTermPage term={term} previous={previous} next={next} related={related} />
      ) : (
        <TermExperiencePage term={term} experience={experience!} previous={previous} next={next} related={related} />
      )}
      </ReadingNotes>
      {!(term.slug in articleTermPages) && <aside className="term-graph-entry"><Link className="term-graph-link" href={`/?term=${term.slug}`}><span className="brand-star-only" aria-hidden="true" />在星图中探索「{term.zh}」<span aria-hidden="true">↗</span></Link></aside>}
      <SiteFooter />
    </>
  );
}
