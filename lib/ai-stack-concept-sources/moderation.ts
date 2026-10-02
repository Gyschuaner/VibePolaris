import { source } from "./shared";

export const moderationSources = [
  source("OpenAI", "Moderation", "https://developers.openai.com/api/docs/guides/moderation", ["moderation-score", "moderation-label"]),
  source("OpenAI Agents SDK", "Guardrails", "https://openai.github.io/openai-agents-python/guardrails/", ["moderation-stage"]),
  source("NIST", "AI 600-1 Generative AI Profile", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["moderation-risk"]),
  source("NIST", "AI Risk Management Framework Playbook", "https://airc.nist.gov/airmf-resources/playbook/", ["moderation-govern"]),
  source("OpenAI", "Safety best practices", "https://developers.openai.com/api/docs/guides/safety-best-practices", ["moderation-safety"]),
];
