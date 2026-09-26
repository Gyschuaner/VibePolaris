const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const datasetSources = [
  source('World Wide Web Consortium', 'Data Catalog Vocabulary (DCAT) — Version 3', 'https://www.w3.org/TR/vocab-dcat-3/', ['dataset-definition', 'dataset-version'], '2024-08-22'),
  source('Timnit Gebru 等', 'Datasheets for Datasets', 'https://arxiv.org/pdf/1803.09010', ['dataset-scope', 'dataset-limits'], '2021-12-01'),
  source('Hugging Face', 'Dataset Cards', 'https://huggingface.co/docs/hub/datasets-cards', ['dataset-card']),
  source('DVC', '.dvc Files', 'https://doc.dvc.org/user-guide/project-structure/dvc-files', ['dataset-identity']),
];
export const qualitySources = [
  source('World Wide Web Consortium', 'Data on the Web Best Practices: Data Quality Vocabulary', 'https://www.w3.org/TR/vocab-dqv/', ['quality-purpose', 'quality-record']),
  source('UK Government', 'The Government Data Quality Framework', 'https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework', ['quality-dimensions', 'quality-fact']),
  source('AWS Labs', 'Deequ — Data Quality Checks', 'https://github.com/awslabs/deequ', ['quality-automation']),
  source('Amazon Web Services', 'AWS Glue Data Quality', 'https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html', ['quality-score']),
];
export const lineageSources = [
  source('World Wide Web Consortium', 'PROV-DM: The PROV Data Model', 'https://www.w3.org/TR/prov-dm/', ['lineage-relations'], '2013-04-30'),
  source('OpenLineage', 'Object Model', 'https://openlineage.io/docs/spec/object-model/', ['lineage-run']),
  source('OpenLineage', 'Column Level Lineage Dataset Facet', 'https://openlineage.io/docs/spec/facets/dataset-facets/column_lineage_facet/', ['lineage-columns']),
  source('DataHub', 'About DataHub Lineage', 'https://docs.datahub.com/docs/features/feature-guides/lineage', ['lineage-history', 'lineage-impact']),
];
