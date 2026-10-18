import { source } from "./shared";

export const embeddingSources = [
  source("Reimers & Gurevych", "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks", "https://arxiv.org/html/1908.10084v1", ["embedding-definition", "embedding-representation", "embedding-model"], "2019-08-27"),
  source("Sentence Transformers", "Semantic Search", "https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html", ["embedding-search"]),
  source("scikit-learn", "cosine_similarity", "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html", ["embedding-distance"]),
  source("Sentence Transformers", "Semantic Textual Similarity", "https://sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html", ["embedding-metric"]),
];
