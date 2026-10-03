import { source } from "./shared";

export const toolApprovalSources = [
  source("OpenAI Agents SDK", "Human-in-the-loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["approval-pause-evidence", "approval-decide"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["approval-tool"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["approval-mcp"]),
  source("Model Context Protocol", "Authorization", "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization", ["approval-authorization"]),
  source("OpenAI Agents SDK", "MCP", "https://openai.github.io/openai-agents-python/mcp/", ["approval-server"]),
];
