import { source } from "./ai-stack-concept-sources/shared";

export const apiTestingSources = [
  source("Playwright", "API testing", "https://playwright.dev/docs/api-testing", ["api-direct-request", "api-postcondition", "api-auth-state"]),
  source("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["api-http-status", "api-idempotency", "api-security-scope"]),
  source("OpenAPI Initiative", "OpenAPI Specification 3.1.0", "https://spec.openapis.org/oas/v3.1.0.html", ["api-response-contract", "api-schema"]),
  source("OWASP", "OWASP Top 10 API Security Risks · 2023", "https://api-security.owasp.org/editions/2023/en/0x11-t10/", ["api-object-authorization", "api-security-scope"]),
  source("Stripe", "Idempotent requests", "https://docs.stripe.com/api/idempotent_requests", ["api-retry-key", "api-retry-boundary"]),
];
