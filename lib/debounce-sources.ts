import { source } from "./ai-stack-concept-sources/shared";

export const debounceSources = [
  source("MDN Web Docs", "Debounce · Glossary", "https://developer.mozilla.org/en-US/docs/Glossary/Debounce", ["debounce-definition", "debounce-window"]),
  source("Lodash", "_.debounce", "https://lodash.com/docs/4.17.15#debounce", ["debounce-window", "debounce-leading", "debounce-boundary"]),
  source("ReactiveX", "debounceTime · RxJS API", "https://rxjs.dev/api/operators/debounceTime", ["debounce-stream", "debounce-window"]),
  source("Underscore.js", "_.debounce", "https://underscorejs.org/#debounce", ["debounce-leading", "debounce-boundary"]),
];
