const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const embeddingSources = [
  source('Tomas Mikolov 等', 'Efficient Estimation of Word Representations in Vector Space', 'https://arxiv.org/pdf/1301.3781', ['embedding-learning']),
  source('Nils Reimers、Iryna Gurevych', 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', 'https://arxiv.org/html/1908.10084', ['embedding-sentences']),
  source('Hugging Face', 'Feature Extraction', 'https://huggingface.co/tasks/feature-extraction', ['embedding-output']),
  source('Sentence Transformers', 'Computing Embeddings', 'https://www.sbert.net/examples/sentence_transformer/applications/computing-embeddings/README.html', ['embedding-config', 'embedding-length']),
];
export const semanticSources = [
  source('Vladimir Karpukhin 等', 'Dense Passage Retrieval for Open-Domain Question Answering', 'https://arxiv.org/pdf/2004.04906', ['semantic-encoding']),
  source('Sentence Transformers', 'Retrieve & Re-Rank', 'https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html', ['semantic-rerank']),
  source('Nandan Thakur 等', 'BEIR: A Heterogenous Benchmark for Zero-shot Evaluation of Information Retrieval Models', 'https://arxiv.org/pdf/2104.08663', ['semantic-generalization']),
  source('Christopher D. Manning、Prabhakar Raghavan、Hinrich Schütze', 'Introduction to Information Retrieval · Evaluation of unranked retrieval sets', 'https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html', ['semantic-evaluation']),
];
export const ragSources = [
  source('Patrick Lewis 等', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', 'https://arxiv.org/pdf/2005.11401', ['rag-definition', 'rag-original']),
  source('Hugging Face', 'Transformers · RAG', 'https://huggingface.co/docs/transformers/model_doc/rag', ['rag-index']),
  source('Nelson F. Liu 等', 'Lost in the Middle: How Language Models Use Long Contexts', 'https://arxiv.org/pdf/2307.03172', ['rag-context']),
  source('Shahul Es、Jithin James、Luis Espinosa-Anke、Steven Schockaert', 'RAGAS: Automated Evaluation of Retrieval Augmented Generation', 'https://arxiv.org/pdf/2309.15217', ['rag-evaluation']),
];
