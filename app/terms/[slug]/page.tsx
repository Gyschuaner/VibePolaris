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
import { AgentLoopTermPage, ContextTermPage, ToolCallingTermPage } from "@/components/terms/RelatedConceptPages";
import { MemoryTermPage, ContextWindowTermPage, PromptTermPage, McpTermPage, SandboxTermPage } from "@/components/terms/ExtendedConceptPages";
import { LlmTermPage, TokenTermPage, AgentTermPage } from "@/components/terms/FoundationConceptPages";
import { EmbeddingTermPage, SemanticSearchTermPage, RagConceptTermPage } from "@/components/terms/SemanticConceptPages";
import { HybridSearchTermPage, VectorStoreTermPage, CitationTermPage } from "@/components/terms/EvidenceConceptPages";
import { RetrievalTermPage, ChunkingTermPage, RerankingTermPage } from "@/components/terms/SelectionConceptPages";
import { RebaseTermPage } from "@/components/terms/RebaseTermPage";
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
import { BenchmarkTermPage, GraderTermPage, EvalDatasetTermPage } from '@/components/terms/AssessmentConceptPages';

import { ModelRoutingTermPage, ModelFallbackTermPage, PromptCachingTermPage } from '@/components/terms/ModelDeliveryPages';

import { StreamingOutputTermPage, StructuredOutputTermPage, FunctionCallingTermPage } from '@/components/terms/ModelOutputPages';
import { ServerTermPage, ApiGatewayTermPage, ReverseProxyTermPage } from '@/components/terms/EdgeConceptPages';
import { LoadBalancerTermPage, AuthTermPage, AuthorizationTermPage } from '@/components/terms/AccessConceptPages';
import { SessionTermPage, JwtTermPage, OAuthTermPage } from '@/components/terms/IdentityConceptPages';
import { SkillTermPage } from '@/components/terms/SkillConceptPages';
import { AdaptiveLayoutTermPage, AppLifecycleTermPage, AppPermissionTermPage, BoxModelTermPage, CrossPlatformDevelopmentTermPage, CssSelectorTermPage, OfflineFirstTermPage, PushNotificationTermPage, SafeAreaTermPage, WebviewTermPage } from '@/components/terms/MobileCssConceptPages';
import { ContainerImageTermPage, ObservabilityTermPage, SastTermPage, SecretScanningTermPage, ServiceDiscoveryTermPage } from '@/components/terms/AiStackConceptPages';

const articleTermPages = {
  skill: SkillTermPage,
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
  'container-image': ContainerImageTermPage,
  'service-discovery': ServiceDiscoveryTermPage,
  observability: ObservabilityTermPage,
  sast: SastTermPage,
  'secret-scanning': SecretScanningTermPage,
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
  'evaluation-dataset': EvalDatasetTermPage,
  grounding: GroundingTermPage,
  hallucination: HallucinationTermPage,
  eval: EvaluationTermPage,
  "hybrid-search": HybridSearchTermPage,
  "vector-store": VectorStoreTermPage,
  citation: CitationTermPage,
  retrieval: RetrievalTermPage,
  chunking: ChunkingTermPage,
  reranking: RerankingTermPage,
  embedding: EmbeddingTermPage,
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
  "distributed-system": DistributedTermPage,
  "batch-processing": BatchTermPage,
  "stream-processing": StreamTermPage,
  "event-driven-architecture": EventDrivenTermPage,
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
  "agent-loop": AgentLoopTermPage,
  memory: MemoryTermPage,
  "context-window": ContextWindowTermPage,
  prompt: PromptTermPage,
  mcp: McpTermPage,
  "execution-sandbox": SandboxTermPage,
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
  rebase: RebaseTermPage,
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
