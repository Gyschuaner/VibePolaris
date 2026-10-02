import { source } from "./shared";

export const toolResultSources = [
  source("OpenAI", "Function calling", "https://developers.openai.com/api/docs/guides/function-calling", ["result-call", "result-return"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["result-structure", "result-error"]),
  source("Anthropic", "Tool use with Claude", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", ["result-provider"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["result-agent"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["result-loop"]),
];
