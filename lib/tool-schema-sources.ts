import { source } from "./ai-stack-concept-sources/shared";

export const toolSchemaSources = [
  source("OpenAI", "Function calling", "https://platform.openai.com/docs/guides/function-calling", ["tool-schema-definition", "tool-schema-input", "tool-schema-rejection", "tool-schema-output"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["tool-schema-definition", "tool-schema-rejection", "tool-schema-output", "tool-schema-boundary"]),
  source("JSON Schema", "Validation", "https://json-schema.org/draft/2020-12/json-schema-validation", ["tool-schema-input"]),
  source("Anthropic", "Tool use", "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", ["tool-schema-definition", "tool-schema-rejection", "tool-schema-output"]),
];
