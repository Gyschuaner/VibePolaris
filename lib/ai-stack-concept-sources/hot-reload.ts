import { source } from "./shared";

export const hotReloadSources = [
  source("Vite", "Features", "https://vite.dev/guide/features", ["hot-reload-definition-text", "hot-reload-update", "hot-reload-boundary-text"]),
  source("MDN Web Docs", "Location.reload()", "https://developer.mozilla.org/en-US/docs/Web/API/Location/reload", ["hot-reload-reload"]),
  source("webpack", "DevServer", "https://webpack.js.org/configuration/dev-server/", ["hot-reload-dev-server", "hot-reload-update"]),
  source("React Refresh Webpack Plugin", "README", "https://github.com/pmmmwh/react-refresh-webpack-plugin", ["hot-reload-state", "hot-reload-boundary-text"]),
];
