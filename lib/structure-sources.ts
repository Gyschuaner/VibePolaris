const pg = (title: string, page: string, citations: string[]) => ({ publisher: "PostgreSQL Global Development Group", title: `PostgreSQL 18 · ${title}`, date: "", url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
export const schemaSources = [
  pg("Table Basics", "ddl-basics", ["schema-definition", "schema-types"]),
  pg("Modifying Tables", "ddl-alter", ["schema-new-column", "schema-validation", "schema-default"]),
  pg("Constraints", "ddl-constraints", ["schema-contract"]),
  pg("Schemas", "ddl-schemas", ["schema-namespace", "schema-search-path"]),
  pg("Boolean Type", "datatype-boolean", ["schema-boolean"]),
  pg("ALTER TABLE", "sql-altertable", ["schema-migration-lock"]),
];
export const joinSources = [
  pg("Joins Between Tables", "tutorial-join", ["join-definition", "join-alias", "join-self"]),
  pg("Table Expressions · Joined Tables", "queries-table-expressions", ["join-multiplicity", "join-cross", "join-outer", "join-on-filter"]),
  { publisher: "SQLite · 官方文档", title: "SELECT · WHERE clause filtering", date: "", url: "https://www.sqlite.org/lang_select.html", citations: ["join-where"] },
  { publisher: "Oracle · MySQL 官方文档", title: "MySQL 8.4 · JOIN Clause", date: "", url: "https://dev.mysql.com/doc/refman/8.4/en/join.html", citations: ["join-missing"] },
  pg("Constraints · Primary and Foreign Keys", "ddl-constraints", ["join-key"]),
];
export const uniqueSources = [
  pg("Constraints · Unique Constraints", "ddl-constraints", ["unique-definition", "unique-composite", "unique-null"]),
  pg("Unique Indexes", "indexes-unique", ["unique-index"]),
  pg("Index Uniqueness Checks", "index-unique-checks", ["unique-race"]),
  pg("Partial Indexes", "indexes-partial", ["unique-partial"]),
];
