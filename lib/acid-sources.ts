import { source } from "./ai-stack-concept-sources/shared";

export const acidSources = [
  source("PostgreSQL", "Transactions", "https://www.postgresql.org/docs/current/tutorial-transactions.html", ["acid-definition", "acid-atomicity", "acid-consistency"]),
  source("PostgreSQL", "Write-Ahead Logging", "https://www.postgresql.org/docs/current/wal-intro.html", ["acid-durability", "acid-boundary"]),
  source("IBM Research", "Principles of transaction-oriented database recovery", "https://research.ibm.com/publications/principles-of-transaction-oriented-database-recovery", ["acid-definition", "acid-atomicity", "acid-durability", "acid-boundary"]),
  source("Microsoft Learn", "Transaction locking and row versioning guide", "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide", ["acid-isolation", "acid-boundary"]),
];
