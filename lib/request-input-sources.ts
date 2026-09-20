const mdn = (title: string, path: string, citations: string[]) => ({ publisher: "MDN Web Docs · 贡献者", title, date: "", url: `https://developer.mozilla.org/en-US/docs/${path}`, citations });
export const queryParameterSources = [
  { publisher: "IETF · Tim Berners-Lee、Roy Fielding、Larry Masinter", title: "RFC 3986 — URI Generic Syntax · §3.4", date: "2005-01", url: "https://www.rfc-editor.org/rfc/rfc3986.html#section-3.4", citations: ["query-component"] },
  mdn("URLSearchParams", "Web/API/URLSearchParams", ["query-reading", "query-empty", "query-encoding"]),
  { publisher: "OWASP · Robert Gilbert；Michal Biesiada", title: "Information exposure through query strings in URL", date: "", url: "https://community.owasp.org/vulnerabilities/Information_exposure_through_query_strings_in_url", citations: ["query-secrets"] },
];
export const pathParameterSources = [
  { publisher: "OpenAPI Initiative", title: "OpenAPI Specification 3.1.1 · Path Templating", date: "2024-10-24", url: "https://spec.openapis.org/oas/v3.1.1.html#path-templating", citations: ["path-template", "path-spec"] },
  { publisher: "FastAPI · 官方文档", title: "Path Parameters", date: "", url: "https://fastapi.tiangolo.com/tutorial/path-params/", citations: ["path-runtime", "path-types", "path-slash"] },
  { publisher: "OWASP Cheat Sheet Series", title: "Authorization Cheat Sheet", date: "", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", citations: ["path-access"] },
];
export const requestBodySources = [
  mdn("Using the Fetch API", "Web/API/Fetch_API/Using_Fetch", ["body-content", "body-method", "body-stream"]),
  mdn("Content-Type header", "Web/HTTP/Reference/Headers/Content-Type", ["body-type"]),
  mdn("Using FormData Objects", "Web/API/XMLHttpRequest_API/Using_FormData_Objects", ["body-multipart"]),
  mdn("415 Unsupported Media Type", "Web/HTTP/Reference/Status/415", ["body-media-error"]),
  { publisher: "OWASP Cheat Sheet Series", title: "Input Validation Cheat Sheet", date: "", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html", citations: ["body-validation"] },
];
