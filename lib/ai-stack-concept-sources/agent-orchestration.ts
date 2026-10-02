import { source } from "./shared";

export const agentOrchestrationSources = [
  source("OpenAI Agents SDK", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["orchestration-definition", "orchestration-parallel"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["orchestration-loop"]),
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", ["orchestration-pattern"]),
  source("Wu et al.", "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", "https://arxiv.org/abs/2308.08155", ["orchestration-multi"]),
  source("OpenAI Agents SDK", "Handoffs", "https://openai.github.io/openai-agents-python/handoffs/", ["orchestration-handoff"]),
];
