import { source } from "./ai-stack-concept-sources/shared";

export const systemPromptConceptSources = [
  source("OpenAI", "Model Spec", "https://github.com/openai/model_spec/blob/main/model_spec.md", ["system-hierarchy", "system-boundary-evidence", "system-practical-boundary"]),
  source("OpenAI", "Prompt engineering", "https://developers.openai.com/api/docs/guides/prompt-engineering", ["system-format"]),
  source("Anthropic", "Prompting best practices", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices", ["system-instruction-evidence", "system-role"]),
  source("Google", "Text generation: system instructions", "https://ai.google.dev/gemini-api/docs/system-instructions", ["system-instruction-evidence"]),
  source("OWASP", "LLM Prompt Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html", ["system-boundary-evidence", "system-separation", "system-practical-boundary"]),
];
