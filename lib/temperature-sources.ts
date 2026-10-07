import { source } from "./ai-stack-concept-sources/shared";

export const temperatureConceptSources = [
  source("OpenAI", "Text generation", "https://developers.openai.com/api/docs/guides/text", ["temperature-generation"]),
  source("Google AI for Developers", "Prompt design strategies", "https://ai.google.dev/gemini-api/docs/prompting-strategies", ["temperature-definition", "temperature-evidence", "temperature-defaults"]),
  source("Google AI for Developers", "Models", "https://ai.google.dev/api/models", ["temperature-api"]),
  source("Hugging Face", "Transformers · GenerationConfig", "https://huggingface.co/docs/transformers/main/en/main_classes/text_generation", ["temperature-settings"]),
  source("Ari Holtzman 等", "The Curious Case of Neural Text Degeneration · §3.3", "https://arxiv.org/abs/1904.09751", ["temperature-distribution", "temperature-quality"], "2020"),
];
