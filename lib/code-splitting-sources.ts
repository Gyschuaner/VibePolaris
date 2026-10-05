import { source } from "./ai-stack-concept-sources/shared";

export const codeSplittingSources = [
  source("webpack", "Code Splitting", "https://webpack.js.org/guides/code-splitting/", ["split-boundary", "split-dynamic-import", "split-granularity"]),
  source("MDN", "import()", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import", ["split-import", "split-promise"]),
  source("web.dev", "Reduce JavaScript payloads with code splitting", "https://web.dev/articles/reduce-javascript-payloads-with-code-splitting", ["split-payload", "split-route"]),
  source("Next.js", "Lazy Loading", "https://nextjs.org/docs/app/guides/lazy-loading", ["split-next", "split-loading-ui"]),
  source("web.dev", "Optimize long tasks", "https://web.dev/articles/optimize-long-tasks", ["split-parse-execute"]),
];
