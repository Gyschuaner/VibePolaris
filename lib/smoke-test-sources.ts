import { source } from "./ai-stack-concept-sources/shared";

export const smokeTestSources = [
  source("Microsoft Learn", "Automating the Build Process", "https://learn.microsoft.com/en-us/biztalk/technical-guides/automating-the-build-process", ["smoke-definition", "smoke-fast", "smoke-build-check"]),
  source("GitLab Docs", "GitLab Testing Strategy", "https://docs.gitlab.com/development/testing_guide/testing_strategy/", ["smoke-priority", "smoke-blocking", "smoke-placement"]),
  source("GitLab Docs", "Smoke Tests", "https://docs.gitlab.com/development/testing_guide/smoke/", ["smoke-coverage", "smoke-health"]),
  source("Martin Fowler", "Continuous Integration", "https://www.martinfowler.com/articles/originalContinuousIntegration.html", ["smoke-build", "smoke-feedback"]),
  source("GitLab Docs", "CI/CD pipelines", "https://docs.gitlab.com/ci/pipelines/", ["smoke-gate", "smoke-stage"]),
];
