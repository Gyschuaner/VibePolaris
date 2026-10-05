import { source } from "./ai-stack-concept-sources/shared";

export const breakpointSources = [
  source("web.dev", "Responsive web design basics", "https://web.dev/articles/responsive-web-design-basics", ["breakpoint-content", "breakpoint-mobile-first"]),
  source("web.dev", "Media queries", "https://web.dev/learn/design/media-queries", ["breakpoint-definition", "breakpoint-range"]),
  source("MDN", "Media query fundamentals", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries", ["breakpoint-failure", "breakpoint-without-query"]),
  source("MDN", "CSS media queries", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries", ["breakpoint-feature", "breakpoint-container", "breakpoint-viewport"]),
  source("W3C", "Media Queries Level 5", "https://www.w3.org/TR/mediaqueries-5/", ["breakpoint-media-feature", "breakpoint-range-syntax"]),
];
