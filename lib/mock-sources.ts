import { source } from "./ai-stack-concept-sources/shared";

export const mockSources = [
  source("Martin Fowler", "Test Double", "https://martinfowler.com/bliki/TestDouble.html", ["mock-definition", "mock-kinds"]),
  source("Jest", "Mock Functions", "https://jestjs.io/docs/mock-function-api", ["mock-control", "mock-calls", "mock-async"]),
  source("Vitest", "Mocking", "https://vitest.dev/guide/mocking.html", ["mock-reset", "mock-module"]),
  source("Martin Fowler", "Mocks Aren't Stubs", "https://martinfowler.com/articles/mocksArentStubs.html", ["mock-state-behavior", "mock-choice", "mock-refactor"]),
  source("Google Testing Blog", "Increase Test Fidelity By Avoiding Mocks", "https://testing.googleblog.com/2024/02/increase-test-fidelity-by-avoiding-mocks.html", ["mock-fidelity", "mock-contract"]),
];
