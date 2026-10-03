import { source } from "./shared";

export const agentLoopSources = [
  source("OpenAI Agents SDK", "Running agents", "https://openai.github.io/openai-agents-python/running_agents/", ["loop-runner", "loop-limit"]),
  source("Yao et al.", "ReAct", "https://arxiv.org/abs/2210.03629", ["loop-reason-act"]),
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/research/building-effective-agents", ["loop-workflow"]),
  source("OpenAI Agents SDK", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["loop-orchestration"]),
  source("LangChain", "LangGraph overview", "https://docs.langchain.com/oss/python/langgraph/overview", ["loop-state"]),
];
