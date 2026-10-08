import { source } from "./shared";

export const bundlerSources = [
  source("webpack", "Concepts", "https://webpack.js.org/concepts/", ["bundler-definition-text", "bundler-entry"]),
  source("webpack", "Code Splitting", "https://webpack.js.org/guides/code-splitting/", ["bundler-deduplicate", "bundler-split-text", "bundler-runtime"]),
  source("Rollup", "Introduction", "https://rollupjs.org/introduction/", ["bundler-tree-shaking"]),
  source("Vite", "Features", "https://vite.dev/guide/features", ["bundler-css", "bundler-typecheck"]),
];
