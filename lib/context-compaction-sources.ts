import { source } from "./ai-stack-concept-sources/shared";

export const contextCompactionSources = [
  source("Anthropic", "Context windows", "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", ["context-window", "context-overflow", "context-compaction", "context-recovery"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["context-selection", "context-compaction"]),
  source("LangChain", "Short-term memory", "https://docs.langchain.com/oss/python/langchain/short-term-memory", ["context-window", "context-overflow", "context-state", "context-boundary"]),
  source("Microsoft Semantic Kernel", "Creating and managing a chat history object", "https://learn.microsoft.com/en-us/semantic-kernel/concepts/ai-services/chat-completion/chat-history", ["context-tools", "context-state", "context-recovery"]),
];
