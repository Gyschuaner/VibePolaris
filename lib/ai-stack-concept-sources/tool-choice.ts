import { source } from "./shared";

export const toolChoiceSources = [
  source("OpenAI", "Function calling", "https://developers.openai.com/api/docs/guides/function-calling", ["choice-policy-text", "choice-call"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["choice-definition", "choice-input"]),
  source("Anthropic", "Tool use with Claude", "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", ["choice-provider"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["choice-agent"]),
  source("OpenAI Agents SDK", "Human-in-the-loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["choice-approval"]),
];
