import { source } from "./shared";

export const multimodalSources = [
  source("OpenAI", "Images and vision", "https://platform.openai.com/docs/guides/images-vision", ["multimodal-vision", "multimodal-input-evidence"]),
  source("Google", "Gemini vision", "https://ai.google.dev/gemini-api/docs/vision", ["multimodal-input-evidence", "multimodal-missing-evidence"]),
  source("Radford et al.", "Learning Transferable Visual Models From Natural Language Supervision", "https://arxiv.org/abs/2103.00020", ["multimodal-alignment"]),
  source("Alayeen et al.", "Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198", ["multimodal-fusion-evidence"]),
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1", ["multimodal-risk"]),
];
