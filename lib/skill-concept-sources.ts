const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });

export const skillSources = [
  source('Anthropic Engineering', 'Equipping agents for the real world with Agent Skills', 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills', ['skill-purpose', 'skill-disclosure', 'skill-trigger', 'skill-scripts', 'skill-mcp', 'skill-security'], ''),
  source('Agent Skills', 'Specification', 'https://agentskills.io/specification', ['skill-structure', 'skill-disclosure', 'skill-description'], ''),
  source('Anthropic Docs', 'Agent Skills overview', 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview', ['skill-disclosure', 'skill-trigger', 'skill-scripts', 'skill-prompt-diff', 'skill-security'], ''),
  source('Anthropic', 'Introducing Agent Skills', 'https://claude.com/blog/skills', ['skill-purpose'], '2025-10'),
];
