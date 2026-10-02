import { source } from "./shared";

export const humanInTheLoopSources = [
  source("OpenAI Agents SDK", "Human-in-the-loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["hitl-pause", "hitl-decision"]),
  source("OpenAI Agents SDK", "Guardrails", "https://openai.github.io/openai-agents-python/guardrails/", ["hitl-risk"]),
  source("NIST", "AI Risk Management Framework Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["hitl-govern"]),
  source("NIST", "AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework", ["hitl-framework"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["hitl-tool"]),
];
