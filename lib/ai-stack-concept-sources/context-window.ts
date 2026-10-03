import { source } from "./shared";

export const contextWindowSources = [
  source("OpenAI", "Conversation state", "https://developers.openai.com/api/docs/guides/conversation-state", ["context-budget", "context-state"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["context-session"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["context-selection"]),
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["context-attention"]),
  source("Liu et al.", "Lost in the Middle", "https://arxiv.org/abs/2307.03172", ["context-utilization"]),
];
