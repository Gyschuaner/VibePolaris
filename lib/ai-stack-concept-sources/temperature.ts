import { source } from "./shared";

export const temperatureSources = [
  source("OpenAI", "Create a response", "https://developers.openai.com/api/reference/resources/responses/methods/create", ["temperature-api", "temperature-boundary-evidence"]),
  source("OpenAI", "Text generation", "https://platform.openai.com/docs/guides/text?api-mode=responses", ["temperature-sampling-evidence"]),
  source("Hugging Face", "Generation strategies", "https://huggingface.co/docs/transformers/main/en/generation_strategies", ["temperature-sampling-evidence", "temperature-decode-evidence"]),
  source("Hugging Face", "GenerationConfig", "https://huggingface.co/docs/transformers/main/en/main_classes/text_generation", ["temperature-api"]),
  source("Holtzman et al.", "The Curious Case of Neural Text Degeneration", "https://arxiv.org/abs/1904.09751", ["temperature-decode-evidence", "temperature-boundary-evidence"]),
];
