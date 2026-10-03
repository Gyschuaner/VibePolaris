import { source } from "./shared";

export const promptInjectionSources = [
  source("OWASP GenAI Security Project", "LLM01:2025 Prompt Injection", "https://genai.owasp.org/llmrisk/llm01-prompt-injection/", ["prompt-definition", "prompt-types", "prompt-impact", "prompt-controls"]),
  source("OpenAI", "Understanding prompt injections", "https://openai.com/safety/prompt-injections/", ["prompt-definition", "prompt-external", "prompt-confirmation"]),
  source("OpenAI API", "Safety in building agents", "https://developers.openai.com/api/docs/guides/agent-builder-safety", ["prompt-flow", "prompt-structured", "prompt-boundary"]),
  source("Anthropic", "Mitigating the risk of prompt injections in browser use", "https://www.anthropic.com/research/prompt-injection-defenses?slug=helpful-honest-harmless-ai", ["prompt-external", "prompt-limits"]),
  source("NIST", "AI 600-1 Generative AI Profile", "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf", ["prompt-govern"]),
];
