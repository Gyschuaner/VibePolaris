const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const streamingSources = [
  source('OpenAI', 'Streaming API responses', 'https://developers.openai.com/api/docs/guides/streaming-responses', ['stream-definition', 'stream-completion']),
  source('WHATWG', 'HTML Standard — Server-sent events', 'https://html.spec.whatwg.org/multipage/server-sent-events.html', ['stream-framing']),
  source('Anthropic', 'Streaming messages', 'https://platform.claude.com/docs/en/build-with-claude/streaming', ['stream-errors']),
  source('MDN contributors', 'AbortController: abort() method', 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort', ['stream-cancel'], '2025-09-17'),
];
export const structuredSources = [
  source('OpenAI', 'Structured model outputs', 'https://developers.openai.com/api/docs/guides/structured-outputs', ['structured-definition', 'structured-truth']),
  source('JSON Schema', 'Understanding JSON Schema — object', 'https://json-schema.org/understanding-json-schema/reference/object', ['structured-fields']),
  source('Anthropic', 'Structured outputs', 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs', ['structured-decoding', 'structured-terminal']),
  source('Brandon T. Willard、Rémi Louf', 'Efficient Guided Generation for Large Language Models', 'https://arxiv.org/pdf/2307.09702', ['structured-guidance'], '2023'),
];
export const functionSources = [
  source('OpenAI', 'Function calling', 'https://developers.openai.com/api/docs/guides/function-calling', ['function-definition', 'function-return']),
  source('Anthropic', 'Tool use with Claude', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview', ['function-executor']),
  source('Model Context Protocol', 'Tools — Specification 2025-06-18', 'https://modelcontextprotocol.io/specification/2025-06-18/server/tools', ['function-controls'], '2025-06-18'),
  source('Timo Schick、Jane Dwivedi-Yu、Roberto Dessì 等', 'Toolformer: Language Models Can Teach Themselves to Use Tools', 'https://arxiv.org/pdf/2302.04761', ['function-learning'], '2023'),
];
