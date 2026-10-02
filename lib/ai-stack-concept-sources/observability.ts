import { source } from "./shared";

export const observabilitySources = [
  source("OpenTelemetry", "Signals", "https://opentelemetry.io/docs/concepts/signals/", ["observe-signals"]),
  source("OpenTelemetry", "Observability primer", "https://opentelemetry.io/docs/concepts/observability-primer/", ["observe-trace-definition"]),
  source("OpenTelemetry", "OpenTelemetry Logging", "https://opentelemetry.io/docs/specs/otel/logs/", ["observe-correlation"]),
  source("OpenTelemetry", "Context propagation", "https://opentelemetry.io/docs/concepts/context-propagation/", ["observe-context"]),
  source("Kubernetes", "Observability", "https://kubernetes.io/docs/concepts/cluster-administration/observability/", ["observe-kubernetes"]),
];
