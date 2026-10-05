import { source } from "./ai-stack-concept-sources/shared";

export const lazyLoadingSources = [
  source("MDN", "Lazy loading", "https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading", ["lazy-strategy", "lazy-resource", "lazy-priority"]),
  source("MDN", "Intersection Observer API", "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API", ["lazy-intersection", "lazy-root-margin"]),
  source("web.dev", "Browser-level image lazy loading", "https://web.dev/articles/browser-level-image-lazy-loading", ["lazy-image", "lazy-loading-attribute"]),
  source("Next.js", "Lazy Loading", "https://nextjs.org/docs/app/guides/lazy-loading", ["lazy-component"]),
  source("WHATWG", "Lazy loading attributes", "https://html.spec.whatwg.org/multipage/urls.html#lazy-loading-attributes", ["lazy-fetch"]),
];
