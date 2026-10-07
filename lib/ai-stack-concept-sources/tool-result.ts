import { source } from "./shared";

export const toolResultSources = [
  source("OpenAI", "Function calling", "https://developers.openai.com/api/docs/guides/function-calling", ["result-call", "result-return"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["result-structure"]),
  source("Anthropic", "How tool use works", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works", ["result-provider"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["result-agent", "result-loop"]),
  source("IETF", "RFC 9110 HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html#name-200-ok", ["result-error"]),
];
