import { source } from "./shared";

export const zeroShotPromptingSources = [
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["zero-shot-definition", "zero-shot-limit"]),
  source("OpenAI", "Prompt engineering", "https://platform.openai.com/docs/guides/prompt-engineering", ["zero-shot-instruction", "zero-shot-format"]),
  source("Google", "Prompt design strategies", "https://ai.google.dev/gemini-api/docs/prompting-strategies", ["zero-shot-instruction"]),
  source("Kojima et al.", "Large Language Models are Zero-Shot Reasoners", "https://arxiv.org/abs/2205.11916", ["zero-shot-reasoning"]),
  source("Wei et al.", "Finetuned Language Models Are Zero-Shot Learners", "https://arxiv.org/abs/2109.01652", ["zero-shot-limit"]),
];
