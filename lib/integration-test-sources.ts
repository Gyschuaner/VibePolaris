import { source } from "./ai-stack-concept-sources/shared";

export const integrationTestSources = [
  source("Martin Fowler", "Integration Test", "https://martinfowler.com/bliki/IntegrationTest.html", ["integration-definition", "integration-narrow", "integration-double"]),
  source("Microsoft Learn", "Integration tests in ASP.NET Core", "https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-10.0", ["integration-boundary-evidence", "integration-sequence-evidence", "integration-fixture-evidence"]),
  source("Playwright", "API testing", "https://playwright.dev/docs/api-testing", ["integration-request"]),
  source("Playwright", "APIResponseAssertions", "https://playwright.dev/docs/api/class-apiresponseassertions", ["integration-response"]),
  source("Google Testing Blog", "How Much Testing is Enough?", "https://testing.googleblog.com/2021/06/how-much-testing-is-enough.html", ["integration-size-evidence"]),
];
