const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const hybridSources = [
  source('Microsoft', 'Hybrid search using vectors and full text in Azure AI Search', 'https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview', ['hybrid-definition']),
  source('Elastic', 'Reciprocal rank fusion', 'https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion', ['hybrid-calculation', 'hybrid-window']),
  source('Weaviate', 'Hybrid search', 'https://docs.weaviate.io/weaviate/concepts/search/hybrid-search', ['hybrid-scales']),
  source('Gordon V. Cormack、Charles L. A. Clarke、Stefan Büttcher', 'Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods', 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', ['hybrid-evaluation'], '2009'),
];
export const storeSources = [
  source('LangChain', 'Vector stores', 'https://docs.langchain.com/oss/python/integrations/vectorstores', ['store-definition', 'store-lifetime']),
  source('Qdrant', 'Points, Vectors and Payloads', 'https://qdrant.tech/course/essentials/day-1/embedding-models/', ['store-record']),
  source('Pinecone', 'Upsert records', 'https://docs.pinecone.io/guides/index-data/upsert-data', ['store-upsert']),
  source('Chroma', 'Updating Data in Chroma Collections', 'https://docs.trychroma.com/docs/collections/update-data', ['store-sync']),
];
export const citationSources = [
  source('The Chicago Manual of Style', 'Notes and Bibliography: Sample Citations', 'https://www.chicagomanualofstyle.org/tools_citationguide/citation-guide-1.html', ['citation-location']),
  source('W3C', 'Web Annotation Data Model', 'https://www.w3.org/TR/annotation-model/', ['citation-selector']),
  source('Tianyu Gao、Howard Yen、Jiatong Yu、Danqi Chen', 'Enabling Large Language Models to Generate Text with Citations', 'https://arxiv.org/pdf/2305.14627', ['citation-support', 'citation-limits'], '2023'),
  source('Crossref', 'Display guidelines', 'https://www.crossref.org/display-guidelines/', ['citation-identifiers']),
];
