import { source } from "./shared";

export const bundlerSources = [
  source("Rollup", "Introduction", "https://rollupjs.org/introduction/", ["bundler-definition-text", "bundler-entry", "bundler-tooling"]),
  source("webpack", "Concepts", "https://webpack.js.org/concepts/", ["bundler-definition-text", "bundler-entry", "bundler-split-text"]),
  source("esbuild", "esbuild", "https://esbuild.github.io/", ["bundler-tooling", "bundler-boundary-text"]),
  source("Vite", "Dependency Pre-Bundling", "https://vite.dev/guide/dep-pre-bundling", ["bundler-split-text", "bundler-dynamic", "bundler-runtime"]),
];
