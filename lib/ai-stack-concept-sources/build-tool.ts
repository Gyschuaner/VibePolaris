import { source } from "./shared";

export const buildToolSources = [
  source("Vite", "Getting Started", "https://vite.dev/guide/", ["build-definition", "build-vite", "build-boundary"]),
  source("GNU Make", "GNU Make Manual", "https://www.gnu.org/software/make/manual/make.html", ["build-graph", "build-failure"]),
  source("npm", "Scripts", "https://docs.npmjs.com/cli/v11/using-npm/scripts", ["build-scripts", "build-lifecycle"]),
  source("Bazel", "Build Basics", "https://bazel.build/basics", ["build-graph", "build-parallel", "build-boundary"]),
];
