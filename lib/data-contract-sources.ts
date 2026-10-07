import { source } from "./ai-stack-concept-sources/shared";

export const dataContractSources = [
  source("OpenAPI Initiative", "OpenAPI Specification", "https://spec.openapis.org/oas/latest.html", ["data-contract-definition", "data-contract-boundary"]),
  source("JSON Schema", "Understanding JSON Schema · object", "https://json-schema.org/understanding-json-schema/reference/object", ["data-contract-definition", "data-contract-additive", "data-contract-boundary"]),
  source("Pact", "Introduction", "https://docs.pact.io/", ["data-contract-consumer", "data-contract-migration", "data-contract-boundary"]),
  source("Buf", "Detecting breaking changes", "https://buf.build/docs/breaking/", ["data-contract-breaking", "data-contract-migration"]),
];
