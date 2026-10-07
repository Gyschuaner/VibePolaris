import { source } from "./ai-stack-concept-sources/shared";

export const multimodalConceptSources = [
  source("OpenAI", "Images and vision", "https://platform.openai.com/docs/guides/images-vision", ["mm-input", "mm-capability"]),
  source("Google", "Image understanding", "https://ai.google.dev/gemini-api/docs/vision", ["mm-input", "mm-capability", "mm-boundary"]),
  source("Radford et al.", "Learning Transferable Visual Models From Natural Language Supervision", "https://arxiv.org/abs/2103.00020", ["mm-alignment"]),
  source("Alayrac et al.", "Flamingo: a Visual Language Model for Few-Shot Learning", "https://arxiv.org/abs/2204.14198", ["mm-bridge"]),
  source("NIST", "Artificial Intelligence Risk Management Framework: Generative AI Profile", "https://doi.org/10.6028/NIST.AI.600-1", ["mm-risk"]),
];
