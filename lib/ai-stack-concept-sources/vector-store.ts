import { source } from "./shared";

export const vectorStoreSources = [
  source("OpenAI", "Retrieval", "https://developers.openai.com/api/docs/guides/retrieval", ["vector-store-definition", "vector-store-filter"]),
  source("Johnson et al.", "Billion-scale similarity search with GPUs", "https://arxiv.org/abs/1702.08734", ["vector-store-index"]),
  source("Malkov & Yashunin", "Efficient and robust approximate nearest neighbor search", "https://arxiv.org/abs/1603.09320", ["vector-store-ann"]),
  source("Qdrant", "Collections", "https://qdrant.tech/documentation/concepts/collections/", ["vector-store-metadata"]),
  source("Pinecone", "Vector database", "https://www.pinecone.io/learn/vector-database/", ["vector-store-lifecycle"]),
];
