import { source } from "./shared";

export const embeddingSources = [
  source("OpenAI", "Vector embeddings", "https://developers.openai.com/api/docs/guides/embeddings", ["embedding-definition", "embedding-distance"]),
  source("OpenAI", "Embeddings guide", "https://platform.openai.com/docs/guides/embeddings", ["embedding-search"]),
  source("Reimers & Gurevych", "Sentence-BERT", "https://arxiv.org/abs/1908.10084", ["embedding-model", "embedding-representation"]),
  source("Sentence Transformers", "Usage", "https://sbert.net/docs/sentence_transformer/usage/usage.html", ["embedding-biencoder"]),
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["embedding-attention"]),
];
