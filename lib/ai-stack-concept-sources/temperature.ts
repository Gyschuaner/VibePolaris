import { source } from "./shared";

export const temperatureSources = [
  source("OpenAI", "Create a response", "https://platform.openai.com/docs/api-reference/responses/create", ["temperature-api", "temperature-boundary"]),
  source("OpenAI", "Text generation", "https://platform.openai.com/docs/guides/text?api-mode=responses", ["temperature-sampling"]),
  source("Hugging Face", "Generation strategies", "https://huggingface.co/docs/transformers/main/en/generation_strategies", ["temperature-sampling", "temperature-decode"]),
  source("Hugging Face", "GenerationConfig", "https://huggingface.co/docs/transformers/main/en/main_classes/text_generation", ["temperature-api"]),
  source("Holtzman et al.", "The Curious Case of Neural Text Degeneration", "https://arxiv.org/abs/1904.09751", ["temperature-decode", "temperature-boundary"]),
];
