import { source } from "./ai-stack-concept-sources/shared";

export const codeCoverageSources = [
  source("Istanbul", "How Istanbul works", "https://istanbul.js.org/", ["coverage-definition", "coverage-counters"]),
  source("Jest", "Configuring Jest", "https://jestjs.io/docs/configuration#collectcoverage-boolean", ["coverage-collection", "coverage-scope", "coverage-threshold"]),
  source("JaCoCo", "Coverage Counters", "https://www.jacoco.org/jacoco/trunk/doc/counters.html", ["coverage-dimensions", "coverage-lines", "coverage-branches"]),
  source("Vitest", "Coverage", "https://vitest.dev/guide/coverage.html", ["coverage-provider", "coverage-report"]),
  source("LLVM", "Source-based Code Coverage", "https://clang.llvm.org/docs/SourceBasedCodeCoverage.html", ["coverage-workflow", "coverage-mcdc", "coverage-limitation"]),
];
