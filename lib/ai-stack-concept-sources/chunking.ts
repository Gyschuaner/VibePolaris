import { source } from "./shared";

export const chunkingSources = [
  source("OpenAI", "Retrieval", "https://developers.openai.com/api/docs/guides/retrieval", ["chunking-service"]),
  source("Anthropic", "Effective context engineering for AI agents", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", ["chunking-context"]),
  source("Lewis et al.", "Retrieval-Augmented Generation", "https://arxiv.org/abs/2005.11401", ["chunking-rag"]),
  source("LangChain", "Text splitters", "https://docs.langchain.com/oss/python/integrations/splitters", ["chunking-rules"]),
  source("LlamaIndex", "Node parsers and text splitters", "https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/", ["chunking-structure"]),
];
