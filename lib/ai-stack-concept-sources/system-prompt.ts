import { source } from "./shared";

export const systemPromptSources = [
  source("OpenAI", "Model Spec", "https://model-spec.openai.com/", ["system-priority", "system-boundary"]),
  source("OpenAI", "Prompt engineering", "https://platform.openai.com/docs/guides/prompt-engineering", ["system-instruction", "system-output"]),
  source("Anthropic", "System prompts", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#give-claude-a-role", ["system-instruction"]),
  source("Google", "System instructions", "https://ai.google.dev/gemini-api/docs/system-instructions", ["system-instruction", "system-output"]),
  source("OWASP", "LLM Prompt Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html", ["system-boundary"]),
];
