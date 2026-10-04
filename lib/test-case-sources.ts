import { source } from "./ai-stack-concept-sources/shared";

export const testCaseSources = [
  source("Microsoft Learn", "Create a test plan for your implementation projects", "https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/testing-strategy-planning", ["case-definition", "case-fields", "case-negative", "case-result"]),
  source("Microsoft Learn", "Azure Test Plans overview", "https://learn.microsoft.com/en-us/azure/devops/test/overview?source=recommendations&view=azure-devops", ["case-steps", "case-traceability"]),
  source("OWASP", "Forgot Password Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html", ["case-token", "case-side-effect"]),
  source("GitLab Docs", "Testing best practices", "https://docs.gitlab.com/development/testing_guide/best_practices/", ["case-fixture", "case-assertion"]),
  source("Playwright", "Assertions", "https://playwright.dev/docs/test-assertions", ["case-async"]),
];
