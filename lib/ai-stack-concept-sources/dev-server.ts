import { source } from "./shared";

export const devServerSources = [
  source("Vite", "Getting Started", "https://vite.dev/guide/", ["dev-server-definition-text", "dev-server-entry", "dev-server-boundary-text"]),
  source("Vite", "Features", "https://vite.dev/guide/features", ["dev-server-update", "dev-server-hmr", "dev-server-error"]),
  source("webpack", "DevServer", "https://webpack.js.org/configuration/dev-server/", ["dev-server-proxy", "dev-server-error", "dev-server-boundary-text"]),
  source("Node.js", "HTTP", "https://nodejs.org/api/http.html", ["dev-server-http", "dev-server-definition-text"]),
];
