const pg = (title: string, page: string, citations: string[]) => ({ publisher: "PostgreSQL Global Development Group", title: `PostgreSQL 18 · ${title}`, date: "", url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
const sqlite = (title: string, page: string, citations: string[], date = "") => ({ publisher: "SQLite · 官方文档", title, date, url: `https://www.sqlite.org/${page}.html`, citations });
export const tableSources = [
  pg("Table Basics", "ddl-basics", ["table-shape", "table-types"]),
  pg("Table Expressions · WHERE", "queries-table-expressions", ["table-filter"]),
  pg("Select Lists", "queries-select-lists", ["table-columns"]),
  pg("Sorting Rows (ORDER BY)", "queries-order", ["table-order"]),
];
export const primaryKeySources = [
  pg("Constraints · Primary Keys", "ddl-constraints", ["primary-key-identity", "primary-key-composite"]),
  pg("Identity Columns", "ddl-identity-columns", ["primary-key-generated"]),
  sqlite("SQLite Autoincrement", "autoinc", ["primary-key-autoincrement"]),
  sqlite("Clustered Indexes and the WITHOUT ROWID Optimization", "withoutrowid", ["primary-key-sqlite"], "2025-05-31（更新）"),
];
export const foreignKeySources = [
  pg("Constraints · Foreign Keys", "ddl-constraints", ["foreign-key-reference", "foreign-key-delete", "foreign-key-null"]),
  sqlite("SQLite Foreign Key Support", "foreignkeys", ["foreign-key-enforcement"]),
  { publisher: "Oracle · MySQL 官方文档", title: "MySQL 8.4 · FOREIGN KEY Constraints", date: "", url: "https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html", citations: ["foreign-key-indexes"] },
  pg("Modifying Tables · Adding a Constraint", "ddl-alter", ["foreign-key-existing"]),
];
