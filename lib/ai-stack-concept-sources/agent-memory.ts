import { source } from "./shared";

export const agentMemorySources = [
  source("LangChain", "Memory concepts", "https://docs.langchain.com/oss/python/concepts/memory", ["memory-definition", "memory-scope"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["memory-selection"]),
  source("Park et al.", "Generative Agents", "https://arxiv.org/abs/2304.03442", ["memory-reflection"]),
  source("Packer et al.", "MemGPT", "https://arxiv.org/abs/2310.08560", ["memory-virtual"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["memory-session"]),
];
