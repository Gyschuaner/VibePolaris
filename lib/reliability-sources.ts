const backoff = (citations: string[]) => ({ publisher: "Marc Brooker · Amazon Builders’ Library", title: "Timeouts, retries, and backoff with jitter", date: "2019", url: "https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf", citations });
const semantics = (citations: string[]) => ({ publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke", title: "RFC 9110 — HTTP Semantics · §9.2.2", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2", citations });
export const timeoutSources = [
  backoff(["timeout-wait", "timeout-budget"]),
  { publisher: "Malcolm Featonby · Amazon Builders’ Library", title: "Making retries safe with idempotent APIs", date: "", url: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/", citations: ["timeout-unknown", "timeout-followup"] },
  { publisher: "MDN Web Docs · 贡献者", title: "AbortSignal: timeout() static method", date: "", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static", citations: ["timeout-browser"] },
  { publisher: "Go 项目", title: "Canceling in-progress operations", date: "", url: "https://go.dev/doc/database/cancel-operations", citations: ["timeout-cancel"] },
];
export const retrySources = [
  { publisher: "Google Cloud · Cloud Storage 文档", title: "Retry strategy", date: "", url: "https://docs.cloud.google.com/storage/docs/retry-strategy", citations: ["retry-decision", "retry-sdk"] },
  semantics(["retry-safe"]),
  backoff(["retry-backoff", "retry-load"]),
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke", title: "RFC 9110 — HTTP Semantics · §10.2.3", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.3", citations: ["retry-after"] },
  { publisher: "Marc Brooker · AWS Architecture Blog", title: "Exponential Backoff And Jitter", date: "2015-03-04，2023-05 更新", url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/", citations: ["retry-jitter"] },
];
export const idempotencySources = [
  semantics(["idempotency-effect", "idempotency-methods", "idempotency-response"]),
  { publisher: "Stripe · API Reference", title: "Idempotent requests", date: "", url: "https://docs.stripe.com/api/idempotent_requests", citations: ["idempotency-key", "idempotency-unique", "idempotency-retention", "idempotency-current"] },
  { publisher: "Amazon EC2 · Developer Guide", title: "Ensuring idempotency in Amazon EC2 API requests", date: "", url: "https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-idempotency.html", citations: ["idempotency-scope", "idempotency-current"] },
  { publisher: "PayPal · Developer", title: "Idempotency", date: "2026-08-11", url: "https://developer.paypal.com/api/rest/reference/idempotency/", citations: ["idempotency-current", "idempotency-concurrent"] },
  { publisher: "Malcolm Featonby · Amazon Builders’ Library", title: "Making retries safe with idempotent APIs", date: "", url: "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/", citations: ["idempotency-atomic"] },
];
