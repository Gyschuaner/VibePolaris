import { source } from "./shared";

export const rerankingSources = [
  source("Cohere", "Rerank", "https://docs.cohere.com/v2/docs/rerank", ["rerank-definition", "rerank-limit"]),
  source("Sentence Transformers", "Retrieve and rerank", "https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html", ["rerank-pipeline"]),
  source("Nogueira & Cho", "Passage Re-ranking with BERT", "https://arxiv.org/abs/1901.04085", ["rerank-crossencoder"]),
  source("Khattab & Zaharia", "ColBERT", "https://arxiv.org/abs/2004.12832", ["rerank-late-interaction"]),
  source("OpenAI", "Retrieval", "https://developers.openai.com/api/docs/guides/retrieval", ["rerank-candidates"]),
];
