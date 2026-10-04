import type { Source } from "./backend-network-sources";

const make = (publisher: string, title: string, url: string, citations: string[]): Source => ({ publisher, title, date: "", url, citations });

export const tcpSources: Source[] = [
  make("IETF", "RFC 9293 · Transmission Control Protocol", "https://www.rfc-editor.org/rfc/rfc9293.html", ["tcp-stream", "tcp-sequence", "tcp-boundary"]),
  make("IETF", "RFC 5681 · TCP Congestion Control", "https://www.rfc-editor.org/rfc/rfc5681.html", ["tcp-congestion", "tcp-window"]),
  make("IETF", "RFC 1122 · Requirements for Internet Hosts", "https://www.rfc-editor.org/rfc/rfc1122.html", ["tcp-reliability", "tcp-app-boundary"]),
  make("IANA", "Service Name and Transport Protocol Port Number Registry", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", ["tcp-port"]),
];

export const udpSources: Source[] = [
  make("IETF", "RFC 768 · User Datagram Protocol", "https://www.rfc-editor.org/rfc/rfc768.html", ["udp-datagram", "udp-fields"]),
  make("IETF", "RFC 1122 · Requirements for Internet Hosts", "https://www.rfc-editor.org/rfc/rfc1122.html", ["udp-checksum", "udp-delivery"]),
  make("IETF", "RFC 8085 · UDP Usage Guidelines", "https://www.rfc-editor.org/rfc/rfc8085.html", ["udp-tradeoff", "udp-congestion", "udp-size", "udp-boundary"]),
  make("IANA", "Service Name and Transport Protocol Port Number Registry", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", ["udp-port"]),
];

export const tlsHandshakeSources: Source[] = [
  make("IETF", "RFC 8446 · The Transport Layer Security Protocol Version 1.3", "https://www.rfc-editor.org/rfc/rfc8446.html", ["tls-flow", "tls-keys", "tls-record", "tls-failure"]),
  make("IETF", "RFC 9525 · Service Identity in TLS", "https://www.rfc-editor.org/rfc/rfc9525.html", ["tls-identity", "tls-hostname"]),
  make("IETF", "RFC 6066 · TLS Extensions", "https://www.rfc-editor.org/rfc/rfc6066.html", ["tls-sni"]),
  make("Mozilla", "Transport Layer Security (TLS)", "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security", ["tls-boundary", "tls-failure"]),
];

export const responseBodySources: Source[] = [
  make("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["body-representation", "body-decode", "body-no-content", "body-method", "body-empty"]),
  make("MDN Web Docs", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages", ["body-message"]),
  make("MDN Web Docs", "Response: json() method", "https://developer.mozilla.org/en-US/docs/Web/API/Response/json", ["body-decode", "body-parse"]),
  make("MDN Web Docs", "204 No Content", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204", ["body-no-content", "body-empty"]),
];

export const responseHeaderSources: Source[] = [
  make("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["header-metadata", "header-location", "header-retry", "header-vary", "header-no-reuse"]),
  make("IETF", "RFC 9111 · HTTP Caching", "https://www.rfc-editor.org/rfc/rfc9111.html", ["header-cache", "header-vary", "header-no-reuse"]),
  make("MDN Web Docs", "HTTP headers", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers", ["header-fields", "header-metadata"]),
  make("MDN Web Docs", "Retry-After header", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After", ["header-retry"]),
];

export const cookieSources: Source[] = [
  make("IETF", "RFC 6265 · HTTP State Management Mechanism", "https://www.rfc-editor.org/rfc/rfc6265.html", ["cookie-store", "cookie-match", "cookie-header"]),
  make("MDN Web Docs", "Using HTTP cookies", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies", ["cookie-scope", "cookie-secure", "cookie-samesite", "cookie-httponly"]),
  make("MDN Web Docs", "Cookie header", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie", ["cookie-header", "cookie-attributes"]),
  make("NIST", "SP 800-63B · Session Management", "https://pages.nist.gov/800-63-4/sp800-63b/session/", ["cookie-session", "cookie-expiry"]),
  make("OWASP", "Session Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", ["cookie-defense", "cookie-csrf", "cookie-session"]),
];

export const corsSources: Source[] = [
  make("WHATWG", "Fetch Standard · CORS protocol", "https://fetch.spec.whatwg.org/#http-cors-protocol", ["cors-opt-in", "cors-preflight", "cors-response", "cors-credentials", "cors-vary"]),
  make("MDN Web Docs", "Cross-Origin Resource Sharing (CORS) configuration", "https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CORS", ["cors-origin", "cors-exposure", "cors-credentials", "cors-vary"]),
  make("MDN Web Docs", "Preflight request", "https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request", ["cors-preflight", "cors-max-age"]),
  make("MDN Web Docs", "Reason: CORS header 'Access-Control-Allow-Origin' missing", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowOrigin", ["cors-failure", "cors-vary"]),
];

export const websocketSources: Source[] = [
  make("IETF", "RFC 6455 · The WebSocket Protocol", "https://www.rfc-editor.org/rfc/rfc6455.html", ["ws-upgrade", "ws-frames", "ws-close", "ws-ping"]),
  make("MDN Web Docs", "Writing WebSocket client applications", "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications", ["ws-open", "ws-message", "ws-error", "ws-close"]),
  make("MDN Web Docs", "WebSocket", "https://developer.mozilla.org/en-US/docs/Web/API/WebSocket", ["ws-state", "ws-buffer"]),
  make("IETF", "RFC 8441 · Bootstrapping WebSockets with HTTP/2", "https://www.rfc-editor.org/rfc/rfc8441.html", ["ws-http2"]),
];

export const apiKeySources: Source[] = [
  make("OWASP", "REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", ["key-role", "key-bearer", "key-boundary", "key-revoke"]),
  make("Google Cloud", "Best practices for managing API keys", "https://docs.cloud.google.com/docs/authentication/api-keys-best-practices", ["key-storage", "key-query", "key-restrict", "key-rotate"]),
  make("AWS", "API Gateway usage plans and API keys", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html", ["key-meter", "key-quota"]),
  make("GitHub Docs", "Managing your personal access tokens", "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token", ["key-expiry", "key-rotate"]),
];

export const rbacSources: Source[] = [
  make("NIST", "Role Based Access Control", "https://csrc.nist.gov/Projects/Role-Based-Access-Control", ["rbac-model", "rbac-role", "rbac-hierarchy"]),
  make("NIST", "SP 800-162 · Guide to Attribute Based Access Control", "https://csrc.nist.gov/pubs/sp/800/162/upd2/final", ["rbac-boundary", "rbac-attributes"]),
  make("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["rbac-deny", "rbac-object", "rbac-least"]),
  make("Microsoft Learn", "Role-based access control", "https://learn.microsoft.com/en-us/azure/role-based-access-control/overview", ["rbac-role", "rbac-scope"]),
];
