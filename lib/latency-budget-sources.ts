import { source } from "./ai-stack-concept-sources/shared";

export const latencyBudgetSources = [
  source("Google SRE", "Handling overload", "https://sre.google/sre-book/handling-overload/", ["latency-budget-definition", "latency-budget-breakdown", "latency-budget-tail"]),
  source("AWS Builders' Library", "Timeouts, retries, and backoff with jitter", "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", ["latency-budget-retry", "latency-budget-boundary"]),
  source("OpenTelemetry", "HTTP metrics semantic conventions", "https://opentelemetry.io/docs/specs/semconv/http/http-metrics/", ["latency-budget-breakdown", "latency-budget-tail"]),
  source("Google Cloud", "Performance optimization", "https://cloud.google.com/architecture/framework/performance-optimization", ["latency-budget-definition", "latency-budget-tradeoff", "latency-budget-boundary"]),
];
