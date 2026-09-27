const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const routingSources = [
  source('Isaac Ong、Amjad Almahairi、Vincent Wu 等', 'RouteLLM: Learning to Route LLMs from Preference Data', 'https://arxiv.org/pdf/2406.18665', ['routing-definition'], '2025'),
  source('Amazon Web Services', 'Use Amazon Bedrock Intelligent Prompt Routing', 'https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-routing.html', ['routing-estimate', 'routing-names']),
  source('Lingjiao Chen、Matei Zaharia、James Zou', 'FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance', 'https://arxiv.org/pdf/2305.05176', ['routing-cascade'], '2023'),
  source('LiteLLM', 'Router — Load Balancing', 'https://docs.litellm.ai/docs/routing', ['routing-load']),
];
export const fallbackSources = [
  source('LiteLLM', 'Router — Basic Reliability', 'https://docs.litellm.ai/docs/routing', ['fallback-definition']),
  source('Mark Nottingham、Roy T. Fielding', 'RFC 6585: Additional HTTP Status Codes', 'https://www.rfc-editor.org/rfc/rfc6585#section-4', ['fallback-errors'], '2012-04'),
  source('Portkey', 'How to Setup Fallback from OpenAI to Azure OpenAI（归档示例）', 'https://github.com/Portkey-AI/portkey-cookbook/blob/main/ai-gateway/how-to-setup-fallback-from-openai-to-azure-openai.md', ['fallback-policy']),
  source('Amazon Web Services', 'Retry with backoff pattern', 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html', ['fallback-bounds']),
];
export const promptCachingSources = [
  source('OpenAI', 'Prompt caching', 'https://developers.openai.com/api/docs/guides/prompt-caching', ['pcache-definition']),
  source('vLLM', 'Automatic Prefix Caching', 'https://docs.vllm.ai/en/latest/design/prefix_caching/', ['pcache-prefix']),
  source('Anthropic', 'Prompt caching', 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching', ['pcache-conditions']),
  source('Lianmin Zheng、Liangsheng Yin、Zhiqiang Xie 等', 'SGLang: Efficient Execution of Structured Language Model Programs', 'https://papers.nips.cc/paper_files/paper/2024/file/724be4472168f31ba1c9ac630f15dec8-Paper-Conference.pdf', ['pcache-eviction'], '2024'),
];
