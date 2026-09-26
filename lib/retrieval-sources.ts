const source = (publisher: string, title: string, url: string, citations: string[]) => ({ publisher, title, url, citations, date: '' });
export const frameSources = [
  source('pandas', 'How do I select a subset of a DataFrame?', 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/03_subset_data.html', ['frame-selection', 'frame-labels']),
  source('Polars', 'Expressions and contexts', 'https://docs.pola.rs/user-guide/concepts/expressions-and-contexts/', ['frame-operations']),
  source('Apache Arrow', 'Arrow Columnar Format', 'https://arrow.apache.org/docs/format/Columnar.html', ['frame-storage']),
  source('Apache Spark', 'Spark SQL, DataFrames and Datasets Guide', 'https://spark.apache.org/docs/latest/sql-programming-guide.html', ['frame-execution']),
];
export const textSources = [
  source('PostgreSQL', '18 · Full Text Search: Introduction', 'https://www.postgresql.org/docs/18/textsearch-intro.html', ['text-definition', 'text-analysis']),
  source('PostgreSQL', '18 · Controlling Text Search', 'https://www.postgresql.org/docs/18/textsearch-controls.html', ['text-ranking']),
  source('SQLite', 'FTS5 Extension', 'https://sqlite.org/fts5.html', ['text-positions']),
  source('Elastic', 'Elasticsearch · Match query', 'https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-match-query', ['text-configuration']),
];
export const vectorSources = [
  source('Qdrant', 'Points', 'https://qdrant.tech/documentation/manage-data/points/', ['vector-records']),
  source('Faiss', 'Getting started', 'https://github.com/facebookresearch/faiss/wiki/Getting-started', ['vector-distance']),
  source('Yu. A. Malkov、D. A. Yashunin', 'Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs', 'https://arxiv.org/pdf/1603.09320', ['vector-index']),
  source('Qdrant', 'Filtering', 'https://qdrant.tech/documentation/search/filtering/', ['vector-filter']),
];
