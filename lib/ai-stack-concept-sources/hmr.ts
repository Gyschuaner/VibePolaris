import { source } from "./shared";

export const hmrSources = [
  source("Vite", "HMR API", "https://vite.dev/guide/api-hmr", ["hmr-definition-text", "hmr-update", "hmr-accept"]),
  source("webpack", "Hot Module Replacement", "https://webpack.js.org/concepts/hot-module-replacement/", ["hmr-definition-text", "hmr-update", "hmr-boundary-text"]),
  source("webpack", "HMR API", "https://webpack.js.org/api/hot-module-replacement/", ["hmr-accept", "hmr-fallback"]),
  source("React Refresh Webpack Plugin", "README", "https://github.com/pmmmwh/react-refresh-webpack-plugin", ["hmr-boundary-text", "hmr-fallback"]),
];
