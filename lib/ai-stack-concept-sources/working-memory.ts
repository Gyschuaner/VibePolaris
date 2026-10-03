import { source } from "./shared";

export const workingMemorySources = [
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["working-state", "working-session"]),
  source("LangChain", "Memory concepts", "https://docs.langchain.com/oss/python/concepts/memory", ["working-short-term"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["working-context"]),
  source("Packer et al.", "MemGPT", "https://arxiv.org/abs/2310.08560", ["working-hierarchy"]),
  source("Yao et al.", "ReAct", "https://arxiv.org/abs/2210.03629", ["working-observation"]),
];
