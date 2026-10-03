import { source } from "./shared";

export const reasoningModelSources = [
  source("OpenAI", "Reasoning models", "https://platform.openai.com/docs/guides/reasoning", ["reasoning-definition-evidence", "reasoning-budget"]),
  source("Wei et al.", "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", "https://arxiv.org/abs/2201.11903", ["reasoning-steps-evidence", "reasoning-prompt"]),
  source("Yao et al.", "Tree of Thoughts", "https://arxiv.org/abs/2305.10601", ["reasoning-search"]),
  source("DeepSeek-AI", "DeepSeek-R1", "https://arxiv.org/abs/2501.12948", ["reasoning-training"]),
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1", ["reasoning-boundary-evidence"]),
];
