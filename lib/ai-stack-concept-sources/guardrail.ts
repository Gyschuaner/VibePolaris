import { source } from "./shared";

export const guardrailSources = [
  source("OpenAI Agents SDK", "Guardrails", "https://openai.github.io/openai-agents-python/guardrails/", ["guardrail-check", "guardrail-stage", "guardrail-position", "guardrail-failure"]),
  source("OpenAI Agents SDK", "Human-in-the-loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["guardrail-review", "guardrail-escalate"]),
  source("NIST", "AI 600-1 Generative AI Profile", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["guardrail-risk", "guardrail-scope"]),
  source("NIST", "AI Risk Management Framework Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["guardrail-govern"]),
  source("OpenAI", "Safety best practices", "https://developers.openai.com/api/docs/guides/safety-best-practices", ["guardrail-safety"]),
];
