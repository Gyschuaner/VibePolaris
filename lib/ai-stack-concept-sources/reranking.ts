import { source } from "./shared";

export const rerankingSources = [
  source("Sentence Transformers", "Retrieve & Re-Rank", "https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html", ["rerank-definition", "rerank-budget"]),
  source("Sentence Transformers", "Cross-Encoders", "https://sbert.net/examples/cross_encoder/applications/README.html", ["rerank-crossencoder"]),
  source("Nogueira & Cho", "Passage Re-ranking with BERT", "https://arxiv.org/html/1901.04085v5", ["rerank-limit", "rerank-truncation"], "2020-04-14"),
  source("Google Cloud", "Improve search and RAG quality with ranking API", "https://docs.cloud.google.com/generative-ai-app-builder/docs/ranking", ["rerank-topn", "rerank-scores"]),
];
