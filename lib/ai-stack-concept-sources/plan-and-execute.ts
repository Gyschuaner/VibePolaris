import { source } from "./shared";

export const planAndExecuteSources = [
  source("OpenAI Agents SDK", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["plan-orchestration"]),
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["plan-loop", "plan-limit"]),
  source("Yao et al.", "ReAct: Synergizing Reasoning and Acting in Language Models", "https://arxiv.org/abs/2210.03629", ["plan-react"]),
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", ["plan-workflow"]),
  source("LangChain", "Plan-and-execute agents", "https://www.langchain.com/blog/planning-agents", ["plan-update"]),
];
