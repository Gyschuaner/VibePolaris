import { source } from "./ai-stack-concept-sources/shared";

export const circuitBreakerSources = [
  source("Microsoft Learn", "Circuit Breaker pattern", "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker", ["breaker-definition", "breaker-states", "breaker-boundary"]),
  source("Martin Fowler", "Circuit Breaker", "https://martinfowler.com/bliki/CircuitBreaker.html", ["breaker-definition", "breaker-half-open", "breaker-boundary"]),
  source("Resilience4j", "CircuitBreaker", "https://resilience4j.readme.io/docs/circuitbreaker", ["breaker-window", "breaker-states", "breaker-concurrency"]),
  source("Polly", "Circuit breaker resilience strategy", "https://www.pollydocs.org/strategies/circuit-breaker.html", ["breaker-window", "breaker-half-open", "breaker-boundary"]),
];
