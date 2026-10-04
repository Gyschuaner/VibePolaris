import { source } from "./shared";

export const transpilerSources = [
  source("TypeScript", "TypeScript for the New Programmer", "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html", ["transpiler-definition-text", "transpiler-type", "transpiler-transform"]),
  source("TypeScript", "TSConfig Reference", "https://www.typescriptlang.org/tsconfig/", ["transpiler-sourcemap", "transpiler-config", "transpiler-boundary-text"]),
  source("Babel", "What is Babel?", "https://babeljs.io/docs/", ["transpiler-tooling", "transpiler-boundary-text"]),
  source("SWC", "@swc/core", "https://swc.rs/docs/usage/core", ["transpiler-transform", "transpiler-tooling"]),
];
