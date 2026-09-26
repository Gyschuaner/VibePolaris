const pg = (title: string, page: string, citations: string[]) => ({ publisher: "PostgreSQL Global Development Group", title: `PostgreSQL 18 · ${title}`, date: "", url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
const sqlite = (title: string, page: string, citations: string[]) => ({ publisher: "SQLite · 官方文档", title, date: "", url: `https://www.sqlite.org/${page}.html`, citations });

export const databaseSources = [
  pg("Concepts", "tutorial-concepts", ["database-relations"]),
  pg("Architectural Fundamentals", "tutorial-arch", ["database-service"]),
  pg("Constraints", "ddl-constraints", ["database-rules"]),
  sqlite("Appropriate Uses For SQLite", "whentouse", ["database-embedded"]),
];
export const indexSources = [
  pg("Introduction to Indexes", "indexes-intro", ["index-purpose", "index-cost"]),
  sqlite("Query Planning · Lookup By Index", "queryplanner", ["index-directory"]),
  pg("Index Types", "indexes-types", ["index-types"]),
  pg("Examining Index Usage", "indexes-examine", ["index-plan"]),
];
export const transactionSources = [
  pg("Transactions", "tutorial-transactions", ["transaction-unit", "transaction-autocommit"]),
  pg("Transaction Isolation", "transaction-iso", ["transaction-visible", "transaction-boundary"]),
  pg("Write-Ahead Logging", "wal-intro", ["transaction-recovery"]),
  sqlite("Transaction", "lang_transaction", ["transaction-engines"]),
];
