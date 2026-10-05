import { source } from "./ai-stack-concept-sources/shared";

export const assertionSources = [
  source("Playwright", "Playwright Assertions", "https://playwright.dev/docs/api/class-playwrightassertions", ["assertion-web-first", "assertion-target"]),
  source("Jest", "Expect", "https://jestjs.io/docs/expect", ["assertion-definition", "assertion-matcher", "assertion-async", "assertion-precise", "assertion-diff"]),
  source("Testing Library", "Async Methods", "https://testing-library.com/docs/dom-testing-library/api-async/", ["assertion-findby", "assertion-waitfor", "assertion-disappearance"]),
  source("Cypress", "Retry-ability", "https://docs.cypress.io/app/core-concepts/retry-ability", ["assertion-retry", "assertion-boundary", "assertion-chain"]),
  source("Playwright", "Timeouts", "https://playwright.dev/docs/test-timeouts", ["assertion-timeout", "assertion-failure"]),
];
