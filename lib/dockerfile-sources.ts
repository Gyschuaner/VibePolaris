import { source } from "./ai-stack-concept-sources/shared";

export const dockerfileSources = [
  source("Docker Docs", "Dockerfile reference", "https://docs.docker.com/reference/dockerfile/", ["docker-instruction", "docker-layer"]),
  source("Docker Docs", "Build cache", "https://docs.docker.com/build/cache/", ["docker-cache", "docker-invalidation"]),
  source("Docker Docs", "Multi-stage builds", "https://docs.docker.com/build/building/multi-stage/", ["docker-stage", "docker-runtime"]),
  source("Docker Docs", "Build context", "https://docs.docker.com/build/concepts/context/", ["docker-context", "docker-ignore"]),
  source("Docker Docs", "Optimize cache usage", "https://docs.docker.com/build/cache/optimize/", ["docker-order"]),
];
