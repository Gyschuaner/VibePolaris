const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });

export const skillSources = [
  source('Agent Skills', 'Specification', 'https://agentskills.io/specification', ['skill-structure', 'skill-description', 'skill-disclosure', 'skill-trigger', 'skill-description-example']),
  source('Anthropic Engineering', 'Equipping agents for the real world with Agent Skills', 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', ['skill-purpose', 'skill-disclosure', 'skill-scripts', 'skill-mcp', 'skill-security'], '2025-10'),
  source('Anthropic Docs', 'Agent Skills overview', 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview', ['skill-disclosure', 'skill-trigger', 'skill-scripts', 'skill-security']),
  source('OpenAI Developers', 'Skills | OpenAI API', 'https://developers.openai.com/api/docs/guides/tools-skills', ['skill-purpose', 'skill-structure', 'skill-disclosure', 'skill-trigger', 'skill-prompt-diff', 'skill-scripts', 'skill-security']),
  source('OpenAI Developers', 'Skills | Plugins', 'https://developers.openai.com/plugins/concepts/skills', ['skill-trigger', 'skill-tools', 'skill-mcp']),
  source('Anthropic Docs', 'Memory tool', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool', ['skill-memory']),
  source('OpenAI Help Center', 'Memory in ChatGPT', 'https://help.openai.com/en/articles/8590148-memory-in-chatgpt', ['skill-memory']),
];
