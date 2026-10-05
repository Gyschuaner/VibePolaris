import { source } from "./ai-stack-concept-sources";

export const hydrationSources = [
  source("React", "hydrateRoot", "https://react.dev/reference/react-dom/client/hydrateRoot", ["hydration-server", "hydration-match", "hydration-events"]),
  source("React", "renderToPipeableStream", "https://react.dev/reference/react-dom/server/renderToPipeableStream", ["hydration-server", "hydration-stream"]),
  source("Next.js", "Text content does not match server-rendered HTML", "https://nextjs.org/docs/messages/react-hydration-error", ["hydration-mismatch"]),
];
