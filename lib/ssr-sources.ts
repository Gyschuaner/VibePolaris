import { source } from "./ai-stack-concept-sources";

export const ssrSources = [
  source("React", "renderToPipeableStream", "https://react.dev/reference/react-dom/server/renderToPipeableStream", ["ssr-request", "ssr-data", "ssr-stream", "ssr-hydrate"]),
  source("Next.js", "Server Components", "https://nextjs.org/docs/app/building-your-application/rendering/server-components", ["ssr-request", "ssr-data"]),
  source("web.dev", "Rendering on the web", "https://web.dev/articles/rendering-on-the-web", ["ssr-stream", "ssr-hydrate"]),
  source("Node.js", "Stream", "https://nodejs.org/api/stream.html", ["ssr-stream"]),
];
