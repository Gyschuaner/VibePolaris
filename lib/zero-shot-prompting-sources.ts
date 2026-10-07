import { source } from "./ai-stack-concept-sources/shared";

export const zeroShotPromptingConceptSources = [
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["zeroshot-definition-evidence", "zeroshot-limit-evidence"]),
  source("OpenAI", "Reasoning best practices", "https://developers.openai.com/api/docs/guides/reasoning-best-practices", ["zeroshot-instruction-evidence", "zeroshot-limit-evidence"]),
  source("Google", "Prompt design strategies", "https://ai.google.dev/gemini-api/docs/prompting-strategies", ["zeroshot-instruction-evidence", "zeroshot-constraint-evidence"]),
  source("Kojima et al.", "Large Language Models are Zero-Shot Reasoners", "https://arxiv.org/abs/2205.11916", ["zeroshot-reasoning"]),
  source("Wei et al.", "Finetuned Language Models Are Zero-Shot Learners", "https://arxiv.org/abs/2109.01652", ["zeroshot-limit-evidence"]),
];
