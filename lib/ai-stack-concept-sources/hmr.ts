import { source } from "./shared";

export const hmrSources = [
  source("webpack", "Hot Module Replacement", "https://webpack.js.org/concepts/hot-module-replacement/", ["hmr-definition-text", "hmr-transport", "hmr-bubble"]),
  source("Vite", "HMR API", "https://vite.dev/guide/api-hmr", ["hmr-accept", "hmr-framework"]),
  source("webpack", "HMR API", "https://webpack.js.org/api/hot-module-replacement/", ["hmr-dispose"]),
  source("Next.js", "Fast Refresh", "https://nextjs.org/docs/architecture/fast-refresh", ["hmr-state", "hmr-fallback"]),
];
