import { source } from "./ai-stack-concept-sources/shared";

export const generativeAiConceptSources = [
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1", ["gen-definition", "gen-risk"]),
  source("OpenAI", "Text generation", "https://platform.openai.com/docs/guides/text?api-mode=responses", ["gen-prompt", "gen-output"]),
  source("Google", "Text generation with the Gemini API", "https://ai.google.dev/gemini-api/docs/text-generation", ["gen-output"]),
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["gen-prompt", "gen-generalization"]),
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["gen-sequence"]),
];
