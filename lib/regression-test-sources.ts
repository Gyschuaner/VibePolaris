import { source } from "./ai-stack-concept-sources/shared";

export const regressionTestSources = [
  source("Microsoft Learn", "Types of tests that implementation projects use", "https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/testing-strategy-test-types", ["reg-definition", "reg-change-trigger", "reg-scope", "reg-automation"]),
  source("Microsoft Learn", "Architecture strategies for testing", "https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing", ["reg-risk", "reg-suite", "reg-history"]),
  source("Microsoft Learn", "Use Test Impact Analysis", "https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis?view=azure-devops", ["reg-impact", "reg-fallback", "reg-validate"]),
  source("GitLab Docs", "GitLab Testing Strategy", "https://docs.gitlab.com/development/testing_guide/testing_strategy/", ["reg-fast", "reg-ownership", "reg-maintenance"]),
  source("Martin Fowler", "Maintainability sensors for coding agents", "https://www.martinfowler.com/articles/sensors-for-coding-agents.html", ["reg-sensor", "reg-failure", "reg-coverage-boundary"]),
];
