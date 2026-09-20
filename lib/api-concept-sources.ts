const openapi = (citations: string[]) => ({ publisher: "OpenAPI Initiative", title: "OpenAPI Specification 3.1.1", date: "2024-10-24", url: "https://spec.openapis.org/oas/v3.1.1.html", citations });
const fielding = (citations: string[]) => ({ publisher: "Roy T. Fielding · 加州大学欧文分校", title: "Architectural Styles and the Design of Network-based Software Architectures · 第5章", date: "2000", url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm", citations });
export const apiSources = [
  { publisher: "MDN Web Docs · 贡献者", title: "API — Glossary", date: "", url: "https://developer.mozilla.org/en-US/docs/Glossary/API", citations: ["api-scope"] },
  openapi(["api-contract"]),
  { publisher: "Microsoft · Azure Architecture Center", title: "Web API design best practices", date: "", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design", citations: ["api-mapping", "api-compatibility"] },
];
export const endpointSources = [
  openapi(["endpoint-address", "endpoint-operation"]),
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke", title: "RFC 9110 — HTTP Semantics · §15.5.5–6", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.6", citations: ["endpoint-method"] },
];
export const restSources = [
  fielding(["rest-resource", "rest-stateless", "rest-constraints"]),
  { publisher: "Roy T. Fielding", title: "REST APIs must be hypertext-driven", date: "2008-10-20", url: "https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven", citations: ["rest-controls"] },
  { publisher: "GitHub · 官方文档", title: "Best practices for using the REST API", date: "", url: "https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#do-not-manually-parse-urls", citations: ["rest-links-example"] },
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke", title: "RFC 9110 — HTTP Semantics · §9.2.1", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.1", citations: ["rest-safe"] },
];
export const paginationSources = [
  { publisher: "PostgreSQL Global Development Group", title: "PostgreSQL 18 · LIMIT and OFFSET", date: "", url: "https://www.postgresql.org/docs/18/queries-limit.html", citations: ["pagination-order", "pagination-offset", "pagination-cost"] },
  { publisher: "Stripe · API Reference", title: "Pagination · v1 list APIs", date: "", url: "https://docs.stripe.com/api/pagination", citations: ["pagination-cursor", "pagination-end"] },
];
export const rateSources = [
  { publisher: "Amazon Web Services", title: "Throttle requests to your REST APIs for better throughput in API Gateway", date: "", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html", citations: ["rate-bucket", "rate-scope", "rate-limits"] },
  { publisher: "IETF · Mark Nottingham、Roy Fielding", title: "RFC 6585 — Additional HTTP Status Codes · §4", date: "2012-04", url: "https://www.rfc-editor.org/rfc/rfc6585.html#section-4", citations: ["rate-response"] },
];
