import { source } from "./shared";

export const toolApprovalSources = [
  source("OpenAI Agents SDK", "Human-in-the-loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["approval-pause", "approval-decide"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["approval-tool"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["approval-mcp", "approval-control", "approval-server"]),
  source("Model Context Protocol", "Server overview", "https://modelcontextprotocol.io/specification/draft/server/index", ["approval-control"]),
  source("OpenAI Agents SDK", "MCP", "https://openai.github.io/openai-agents-python/mcp/", ["approval-server"]),
];
