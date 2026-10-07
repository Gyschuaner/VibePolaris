import { source } from "./ai-stack-concept-sources/shared";

export const columnSources = [
  source("PostgreSQL", "Table basics", "https://www.postgresql.org/docs/current/ddl-basics.html", ["column-definition", "column-write", "column-boundary"]),
  source("PostgreSQL", "Data types", "https://www.postgresql.org/docs/current/datatype.html", ["column-definition", "column-type", "column-write", "column-boundary"]),
  source("PostgreSQL", "Select lists", "https://www.postgresql.org/docs/current/queries-select-lists.html", ["column-expression"]),
  source("SQLite", "Datatypes in SQLite", "https://www.sqlite.org/datatype3.html", ["column-type", "column-boundary"]),
];
