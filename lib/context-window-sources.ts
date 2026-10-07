import { source } from "./ai-stack-concept-sources/shared";

export const contextWindowConceptSources = [
  source("OpenAI", "Conversation state", "https://developers.openai.com/api/docs/guides/conversation-state", ["context-window-limit", "context-window-overflow"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["context-window-history"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["context-window-engineering"], "2025"),
  source("Anthropic", "Context windows", "https://platform.claude.com/docs/en/build-with-claude/context-windows", ["context-window-components", "context-window-rot"]),
  source("Google AI for Developers", "Understand and count tokens", "https://ai.google.dev/gemini-api/docs/tokens", ["context-window-token-count"]),
  source("Vaswani 等", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["context-window-attention"], "2017"),
  source("Liu 等", "Lost in the Middle: How Language Models Use Long Contexts", "https://arxiv.org/abs/2307.03172", ["context-window-middle"], "2023"),
];
