import { source } from "./ai-stack-concept-sources/shared";

export const reasoningModelConceptSources = [
  source("OpenAI", "Reasoning models", "https://developers.openai.com/api/docs/guides/reasoning", ["reasoning-effort", "reasoning-budget"]),
  source("OpenAI", "Reasoning best practices", "https://developers.openai.com/api/docs/guides/reasoning-best-practices", ["reasoning-boundary"]),
  source("Wei et al.", "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "https://arxiv.org/abs/2201.11903", ["reasoning-chain"]),
  source("Yao et al.", "Tree of Thoughts: Deliberate Problem Solving with Large Language Models", "https://arxiv.org/abs/2305.10601", ["reasoning-tree"]),
  source("DeepSeek-AI et al.", "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning", "https://arxiv.org/abs/2501.12948", ["reasoning-training"]),
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1", ["reasoning-boundary"]),
];
