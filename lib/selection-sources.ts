const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const retrievalSources = [
  source('Christopher D. Manning、Prabhakar Raghavan、Hinrich Schütze', 'Introduction to Information Retrieval · Boolean retrieval', 'https://nlp.stanford.edu/IR-book/html/htmledition/boolean-retrieval-1.html', ['retrieval-definition']),
  source('Elastic', 'Retrievers overview', 'https://www.elastic.co/docs/solutions/search/retrievers-overview', ['retrieval-stages']),
  source('Vladimir Karpukhin 等', 'Dense Passage Retrieval for Open-Domain Question Answering', 'https://arxiv.org/pdf/2004.04906', ['retrieval-output']),
  source('PostgreSQL', 'PostgreSQL 18 · Controlling Text Search', 'https://www.postgresql.org/docs/18/textsearch-controls.html', ['retrieval-relevance']),
];
export const chunkingSources = [
  source('Microsoft', 'Chunk large documents for vector search solutions', 'https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents', ['chunk-purpose']),
  source('LangChain', 'Splitting recursively', 'https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter', ['chunk-size', 'chunk-language']),
  source('Unstructured', 'Chunking', 'https://docs.unstructured.io/open-source/core-functionality/chunking', ['chunk-structure', 'chunk-provenance']),
  source('Brandon Smith、Anton Troynikov · Chroma', 'Evaluating Chunking Strategies for Retrieval', 'https://www.trychroma.com/research/evaluating-chunking', ['chunk-evaluation'], '2024-07-03'),
];
export const rerankingSources = [
  source('Sentence Transformers', 'Retrieve & Re-Rank', 'https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html', ['rerank-pairs']),
  source('Rodrigo Nogueira、Kyunghyun Cho', 'Passage Re-ranking with BERT', 'https://arxiv.org/pdf/1901.04085', ['rerank-learning']),
  source('Cohere', 'Rerank overview', 'https://docs.cohere.com/docs/rerank-overview', ['rerank-index']),
  source('Elastic', 'Rescore search results', 'https://www.elastic.co/docs/reference/elasticsearch/rest-apis/rescore-search-results', ['rerank-window']),
];
