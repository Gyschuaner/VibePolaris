const mdn = (title: string, path: string, citations: string[]) => ({ publisher: "MDN Web Docs · 贡献者", title, date: "", url: `https://developer.mozilla.org/en-US/docs/${path}`, citations });
export const requestSources = [
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html", citations: ["request-message", "request-method"] },
  mdn("HTTP messages", "Web/HTTP/Guides/Messages", ["request-message", "request-target", "request-wire"]),
  mdn("Using the Fetch API", "Web/API/Fetch_API/Using_Fetch", ["request-format", "request-object", "request-body-rule"]),
  { publisher: "WHATWG", title: "Fetch Standard — HTTP-network-or-cache fetch", date: "", url: "https://fetch.spec.whatwg.org/#http-network-or-cache-fetch", citations: ["request-body-rule"] },
  { publisher: "IETF · Tim Berners-Lee、Roy Fielding、Larry Masinter", title: "RFC 3986 — URI Generic Syntax", date: "2005-01", url: "https://www.rfc-editor.org/rfc/rfc3986.html", citations: ["request-target"] },
  mdn("Request: Request() constructor", "Web/API/Request/Request", ["request-object"]),
  mdn("Request: clone() method", "Web/API/Request/clone", ["request-inspect"]),
];
export const responseSources = [
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html", citations: ["response-parts"] },
  mdn("HTTP messages", "Web/HTTP/Guides/Messages", ["response-parts"]),
  mdn("201 Created", "Web/HTTP/Reference/Status/201", ["response-created"]),
  mdn("204 No Content", "Web/HTTP/Reference/Status/204", ["response-empty"]),
  mdn("Using the Fetch API", "Web/API/Fetch_API/Using_Fetch", ["response-read", "response-format", "response-status"]),
  mdn("Response: Response() constructor", "Web/API/Response/Response", ["response-native"]),
  mdn("422 Unprocessable Content", "Web/HTTP/Reference/Status/422", ["response-error"]),
  mdn("Response: json() method", "Web/API/Response/json", ["response-read", "response-empty", "response-parse"]),
];
export const methodSources = [
  mdn("HTTP request methods", "Web/HTTP/Reference/Methods", ["method-purpose", "method-others"]),
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics · §9.2", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2", citations: ["method-safe", "method-retry"] },
  mdn("Idempotent", "Glossary/Idempotent", ["method-repeat", "method-delete", "method-identical", "method-implementation"]),
  mdn("PUT request method", "Web/HTTP/Reference/Methods/PUT", ["method-purpose", "method-repeat"]),
  mdn("POST request method", "Web/HTTP/Reference/Methods/POST", ["method-purpose", "method-retry"]),
];
export const statusSources = [
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics · §15", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-15", citations: ["status-classes", "status-categories"] },
  mdn("HTTP response status codes", "Web/HTTP/Reference/Status", ["status-classes", "status-categories", "status-other"]),
  mdn("202 Accepted", "Web/HTTP/Reference/Status/202", ["status-accepted"]),
  mdn("409 Conflict", "Web/HTTP/Reference/Status/409", ["status-other"]),
  mdn("429 Too Many Requests", "Web/HTTP/Reference/Status/429", ["status-other"]),
  mdn("Retry-After header", "Web/HTTP/Reference/Headers/Retry-After", ["status-retry"]),
  mdn("422 Unprocessable Content", "Web/HTTP/Reference/Status/422", ["status-correct"]),
  mdn("503 Service Unavailable", "Web/HTTP/Reference/Status/503", ["status-unavailable"]),
];
export const headerSources = [
  mdn("HTTP headers", "Web/HTTP/Reference/Headers", ["header-fields"]),
  mdn("Accept header", "Web/HTTP/Reference/Headers/Accept", ["header-accept", "header-auto"]),
  mdn("Content-Type header", "Web/HTTP/Reference/Headers/Content-Type", ["header-content"]),
  mdn("Content negotiation", "Web/HTTP/Guides/Content_negotiation", ["header-negotiation"]),
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics · §12.5.5 Vary", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.5", citations: ["header-vary"] },
  mdn("Forbidden request header", "Glossary/Forbidden_request_header", ["header-browser"]),
];
