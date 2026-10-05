import { source } from "./ai-stack-concept-sources/shared";

export const mediaQuerySources = [
  source("W3C", "Media Queries Level 5", "https://www.w3.org/TR/mediaqueries-5/", ["mq-condition", "mq-feature", "mq-range", "mq-combine"]),
  source("MDN", "Using media queries", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries", ["mq-width", "mq-fallback"]),
  source("MDN", "@media", "https://developer.mozilla.org/en-US/docs/Web/CSS/@media", ["mq-at-rule", "mq-logical"]),
  source("MDN", "prefers-reduced-motion", "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion", ["mq-motion"]),
  source("MDN", "hover", "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover", ["mq-hover"]),
  source("web.dev", "Media queries", "https://web.dev/learn/design/media-queries", ["mq-order", "mq-combine-web"]),
];
