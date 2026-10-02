import { source } from "./shared";

export const subagentSources = [
  source("OpenAI Agents SDK", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["subagent-definition", "subagent-merge"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["subagent-tool"]),
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", ["subagent-specialist"]),
  source("Wu et al.", "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation", "https://arxiv.org/abs/2308.08155", ["subagent-conversation"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["subagent-run"]),
];
