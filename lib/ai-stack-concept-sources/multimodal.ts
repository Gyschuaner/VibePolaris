import { source } from "./shared";

export const multimodalSources = [
  source("OpenAI", "Images and vision", "https://platform.openai.com/docs/guides/images-vision", ["multimodal-vision", "multimodal-input"]),
  source("Google", "Gemini vision", "https://ai.google.dev/gemini-api/docs/vision", ["multimodal-input", "multimodal-missing"]),
  source("Radford et al.", "Learning Transferable Visual Models From Natural Language Supervision", "https://arxiv.org/abs/2103.00020", ["multimodal-alignment"]),
  source("Alayeen et al.", "Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198", ["multimodal-fusion"]),
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["multimodal-risk"]),
];
