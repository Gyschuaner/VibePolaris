import { source } from "./shared";

export const generativeAiSources = [
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["generative-definition-evidence", "generative-risk"]),
  source("OpenAI", "Text generation", "https://platform.openai.com/docs/guides/text?api-mode=responses", ["generative-output", "generative-prompt"]),
  source("Google", "Text generation with the Gemini API", "https://ai.google.dev/gemini-api/docs/text-generation", ["generative-output"]),
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["generative-prompt", "generative-generalization"]),
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["generative-sequence"]),
];
