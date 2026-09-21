const mdn = (title: string, path: string, citations: string[]) => ({ publisher: "MDN Web Docs · 贡献者", title, date: "", url: `https://developer.mozilla.org/en-US/docs/${path}`, citations });
export const requestSources = [
  mdn("HTTP messages", "Web/HTTP/Guides/Messages", ["request-message", "request-target", "request-wire"]),
  mdn("Request: Request() constructor", "Web/API/Request/Request", ["request-object"]),
  mdn("Using the Fetch API", "Web/API/Fetch_API/Using_Fetch", ["request-body-rule"]),
];
export const responseSources = [
  mdn("HTTP messages", "Web/HTTP/Guides/Messages", ["response-parts"]),
  mdn("201 Created", "Web/HTTP/Reference/Status/201", ["response-created"]),
  mdn("204 No Content", "Web/HTTP/Reference/Status/204", ["response-empty"]),
  mdn("Response: Response() constructor", "Web/API/Response/Response", ["response-native"]),
  mdn("422 Unprocessable Content", "Web/HTTP/Reference/Status/422", ["response-error"]),
];
export const methodSources = [
  mdn("HTTP request methods", "Web/HTTP/Reference/Methods", ["method-purpose", "method-others"]),
  { publisher: "IETF · Roy Fielding、Mark Nottingham、Julian Reschke（编）", title: "RFC 9110 — HTTP Semantics · §9.2", date: "2022-06", url: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2", citations: ["method-safe", "method-retry"] },
  mdn("Idempotent", "Glossary/Idempotent", ["method-repeat", "method-delete", "method-implementation"]),
];
export const statusSources = [
  mdn("HTTP response status codes", "Web/HTTP/Reference/Status", ["status-classes", "status-other"]),
  mdn("202 Accepted", "Web/HTTP/Reference/Status/202", ["status-accepted"]),
  mdn("422 Unprocessable Content", "Web/HTTP/Reference/Status/422", ["status-correct"]),
  mdn("503 Service Unavailable", "Web/HTTP/Reference/Status/503", ["status-unavailable"]),
];
export const headerSources = [
  mdn("HTTP headers", "Web/HTTP/Reference/Headers", ["header-fields"]),
  mdn("Accept header", "Web/HTTP/Reference/Headers/Accept", ["header-accept"]),
  mdn("Content-Type header", "Web/HTTP/Reference/Headers/Content-Type", ["header-content"]),
  mdn("Content negotiation", "Web/HTTP/Guides/Content_negotiation", ["header-negotiation", "header-vary"]),
  mdn("Forbidden request header", "Glossary/Forbidden_request_header", ["header-browser"]),
];
