import { source } from "./shared";

export const agentWorkflowSources = [
  source("Anthropic", "Building effective agents", "https://www.anthropic.com/engineering/building-effective-agents", ["workflow-distinction", "workflow-predictability"]),
  source("OpenAI", "Agent orchestration", "https://openai.github.io/openai-agents-python/multi_agent/", ["workflow-routing", "workflow-agents-tools"]),
  source("OpenAI", "Agents SDK quickstart", "https://openai.github.io/openai-agents-python/quickstart/", ["workflow-runner", "workflow-handoff"]),
  source("OpenAI", "Guardrails", "https://openai.github.io/openai-agents-python/guardrails/", ["workflow-guardrails", "workflow-boundaries"]),
  source("OpenAI", "Handoffs", "https://openai.github.io/openai-agents-python/handoffs/", ["workflow-transfer", "workflow-filter"]),
];
