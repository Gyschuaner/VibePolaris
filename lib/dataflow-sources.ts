const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const ingestionSources = [
  source('Amazon Web Services', 'What is Data Ingestion?', 'https://aws.amazon.com/what-is/data-ingestion/', ['ingestion-entry', 'ingestion-modes']),
  source('Debezium', 'PostgreSQL connector · Snapshot, streaming and failures', 'https://debezium.io/documentation/reference/stable/connectors/postgresql.html', ['ingestion-cdc', 'ingestion-restart']),
  source('Airbyte', 'Incremental Sync – Append + Deduped', 'https://docs.airbyte.com/platform/using-airbyte/core-concepts/sync-modes/incremental-append-deduped', ['ingestion-position', 'ingestion-duplicates']),
  source('AWS Database Migration Service', 'AWS DMS data validation', 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html', ['ingestion-reconcile']),
];
export const transformationSources = [
  source('dbt Labs', 'SQL models', 'https://docs.getdbt.com/docs/build/sql-models', ['transform-definition']),
  source('Python Software Foundation', 'decimal — Decimal fixed-point and floating-point arithmetic', 'https://docs.python.org/3/library/decimal.html', ['transform-precision']),
  source('PostgreSQL Global Development Group', 'Numeric Types', 'https://www.postgresql.org/docs/current/datatype-numeric.html', ['transform-type']),
  source('PostgreSQL Global Development Group', 'Aggregate Functions', 'https://www.postgresql.org/docs/current/functions-aggregate.html', ['transform-grain']),
];
export const validationSources = [
  source('JSON Schema', 'Understanding JSON Schema · Objects', 'https://json-schema.org/understanding-json-schema/reference/object', ['validation-contract']),
  source('OWASP Foundation', 'Input Validation Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html', ['validation-levels', 'validation-boundary']),
  source('World Wide Web Consortium', 'Shapes Constraint Language (SHACL)', 'https://www.w3.org/TR/shacl/', ['validation-report']),
  source('Great Expectations', 'Run a Validation Definition', 'https://docs.greatexpectations.io/docs/core/run_validations/run_a_validation_definition/', ['validation-run']),
];
