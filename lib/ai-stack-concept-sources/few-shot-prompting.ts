import { source } from "./shared";

export const fewShotPromptingSources = [
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["few-shot-definition-evidence", "few-shot-generalization-evidence"]),
  source("OpenAI", "Prompt engineering", "https://developers.openai.com/api/docs/guides/prompt-engineering", ["few-shot-format-evidence", "few-shot-examples"]),
  source("Google", "Prompt design strategies", "https://ai.google.dev/gemini-api/docs/prompting-strategies", ["few-shot-examples"]),
  source("Anthropic", "Prompt engineering overview", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", ["few-shot-format-evidence"]),
  source("Min et al.", "Rethinking the Role of Demonstrations", "https://arxiv.org/abs/2202.12837", ["few-shot-generalization-evidence"]),
];
