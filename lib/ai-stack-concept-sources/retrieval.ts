import { source } from "./shared";

export const retrievalSources = [
  source("OpenAI", "Retrieval", "https://developers.openai.com/api/docs/guides/retrieval", ["retrieval-semantic", "retrieval-candidates"]),
  source("Karpukhin et al.", "Dense Passage Retrieval", "https://arxiv.org/abs/2004.04906", ["retrieval-dense"]),
  source("Lewis et al.", "Retrieval-Augmented Generation", "https://arxiv.org/abs/2005.11401", ["retrieval-rag-boundary"]),
  source("Sentence Transformers", "Retrieve and rerank", "https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html", ["retrieval-topk"]),
  source("Elastic", "Similarity module", "https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html", ["retrieval-bm25"]),
];
