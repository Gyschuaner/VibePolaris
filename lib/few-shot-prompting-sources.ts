import { source } from "./ai-stack-concept-sources/shared";

export const fewShotPromptingConceptSources = [
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["fewshot-definition-evidence", "fewshot-no-update", "fewshot-limit-evidence"]),
  source("OpenAI", "Prompt engineering", "https://developers.openai.com/api/docs/guides/prompt-engineering", ["fewshot-definition-evidence", "fewshot-pattern-evidence", "fewshot-examples"]),
  source("Google", "Prompt design strategies", "https://ai.google.dev/gemini-api/docs/prompting-strategies", ["fewshot-pattern-evidence", "fewshot-examples", "fewshot-limit-evidence"]),
  source("Anthropic", "Prompt engineering overview", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", ["fewshot-evaluation"]),
  source("Min et al.", "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?", "https://arxiv.org/abs/2202.12837", ["fewshot-pattern-evidence", "fewshot-limit-evidence"]),
];
