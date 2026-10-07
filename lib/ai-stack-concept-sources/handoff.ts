import { source } from "./shared";

export const handoffSources = [
  source("OpenAI Agents SDK", "Handoffs", "https://openai.github.io/openai-agents-python/handoffs/", ["handoff-definition", "handoff-context", "handoff-package", "handoff-filter"]),
  source("OpenAI Agents SDK", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["handoff-route"]),
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", ["handoff-specialist", "handoff-cost"]),
  source("Wu et al.", "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", "https://arxiv.org/abs/2308.08155", ["handoff-conversation", "handoff-history"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["handoff-loop"]),
];
