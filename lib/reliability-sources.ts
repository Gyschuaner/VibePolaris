const backoff = (citations: string[]) => ({ publisher: "Marc Brooker · Amazon Builders’ Library", title: "Timeouts, retries, and backoff with jitter", date: "2019", url: "https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf", citations });
const semantics = (citations: string[]) => ({ publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke", title: "RFC 9110 — HTTP Semantics · §9.2.2", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2", citations });
export const timeoutSources = [
  backoff(["timeout-wait", "timeout-budget"]),
  { publisher: "Malcolm Featonby · Amazon Builders’ Library", title: "Making retries safe with idempotent APIs", date: "", url: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/", citations: ["timeout-unknown", "timeout-followup"] },
  { publisher: "MDN Web Docs · 贡献者", title: "AbortSignal: timeout() static method", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static", citations: ["timeout-browser"] },
  { publisher: "Go 项目", title: "Canceling in-progress operations", date: "", url: "https://go.dev/doc/database/cancel-operations", citations: ["timeout-cancel"] },
];
export const retrySources = [backoff(["retry-backoff", "retry-jitter", "retry-load"]), semantics(["retry-safe"])];
export const idempotencySources = [
  semantics(["idempotency-effect", "idempotency-response"]),
  { publisher: "Stripe · API Reference", title: "Idempotent requests", date: "", url: "https://docs.stripe.com/api/idempotent_requests", citations: ["idempotency-key", "idempotency-retention"] },
];
