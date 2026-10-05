import { source } from "./ai-stack-concept-sources/shared";

export const cdnSources = [
  source("Cloudflare", "Caching overview", "https://developers.cloudflare.com/cache/", ["cdn-definition", "cdn-edge"]),
  source("Cloudflare", "Purge cache", "https://developers.cloudflare.com/cache/how-to/purge-cache/", ["cdn-purge"]),
  source("MDN", "HTTP caching", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching", ["cdn-freshness", "cdn-revalidate"]),
  source("IETF", "HTTP caching (RFC 9111)", "https://www.rfc-editor.org/rfc/rfc9111.html", ["cdn-cache-control", "cdn-revalidate"]),
  source("web.dev", "HTTP cache", "https://web.dev/articles/http-cache", ["cdn-versioning", "cdn-freshness"]),
];
