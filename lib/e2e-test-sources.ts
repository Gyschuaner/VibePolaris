import { source } from "./ai-stack-concept-sources/shared";

export const e2eTestSources = [
  source("Playwright", "Best Practices", "https://playwright.dev/docs/best-practices", ["e2e-user-visible", "e2e-isolation", "e2e-locator"]),
  source("Playwright", "Auto-waiting", "https://playwright.dev/docs/actionability", ["e2e-wait", "e2e-actionability"]),
  source("Playwright", "Introduction", "https://playwright.dev/docs/intro", ["e2e-browser"]),
  source("Martin Fowler", "The Practical Test Pyramid", "https://martinfowler.com/articles/practical-test-pyramid.html", ["e2e-definition", "e2e-cost-evidence"]),
  source("Google Testing Blog", "Just Say No to More End-to-End Tests", "https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html", ["e2e-balance", "e2e-failure-evidence"]),
];
