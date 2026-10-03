import type { harnessSources } from "./harness-references";

export type Source = (typeof harnessSources)[number];
const make = (publisher: string, title: string, url: string, citations: string[]): Source => ({ publisher, title, date: "", url, citations });

export const rbacSources: Source[] = [
  make("NIST", "Role-Based Access Control", "https://csrc.nist.gov/projects/role-based-access-control", ["rbac-definition", "rbac-roles"]),
  make("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["rbac-boundary", "rbac-failure", "rbac-audit"]),
  make("NIST", "SP 800-162 · Guide to Attribute Based Access Control", "https://csrc.nist.gov/pubs/sp/800/162/upd2/final", ["rbac-boundary", "rbac-audit"]),
  make("Microsoft Learn", "Role-based access control", "https://learn.microsoft.com/en-us/azure/role-based-access-control/overview", ["rbac-roles", "rbac-operations"]),
];

export const apiKeySources: Source[] = [
  make("OWASP", "REST Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", ["api-key-definition", "api-key-leak"]),
  make("Google Cloud", "API Keys best practices", "https://cloud.google.com/docs/authentication/api-keys", ["api-key-storage", "api-key-rotation"]),
  make("AWS", "API Gateway usage plans and API keys", "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html", ["api-key-operations", "api-key-boundary"]),
  make("GitHub Docs", "Managing your personal access tokens", "https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token", ["api-key-rotation", "api-key-leak"]),
];

export const relationalDatabaseSources: Source[] = [
  make("PostgreSQL", "Tutorial · The SQL Language", "https://www.postgresql.org/docs/current/tutorial-sql.html", ["relational-definition", "relational-query"]),
  make("PostgreSQL", "Data Definition", "https://www.postgresql.org/docs/current/ddl.html", ["relational-constraints", "relational-definition", "relational-integrity"]),
  make("SQLite", "Query Language", "https://www.sqlite.org/lang.html", ["relational-query", "relational-boundary"]),
  make("IBM", "Relational database", "https://www.ibm.com/think/topics/relational-databases", ["relational-definition", "relational-boundary"]),
];

export const nosqlSources: Source[] = [
  make("MongoDB", "What Is a Document Database?", "https://www.mongodb.com/resources/basics/databases/document-databases", ["nosql-models", "nosql-query"]),
  make("Amazon Web Services", "Dynamo: Amazon's Highly Available Key-value Store", "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", ["nosql-tradeoff", "nosql-boundary", "nosql-selection"]),
  make("AWS", "What is Amazon DynamoDB?", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html", ["nosql-models", "nosql-tradeoff"]),
  make("Apache Cassandra", "Data Modeling", "https://cassandra.apache.org/doc/stable/cassandra/data_modeling/intro.html", ["nosql-query", "nosql-boundary", "nosql-failure"]),
];

export const rowSources: Source[] = [
  make("PostgreSQL", "DDL Basics", "https://www.postgresql.org/docs/current/ddl-basics.html", ["row-definition", "row-identity"]),
  make("PostgreSQL", "Introduction to MVCC", "https://www.postgresql.org/docs/current/mvcc-intro.html", ["row-versions", "row-boundary"]),
  make("PostgreSQL", "Sorting Rows", "https://www.postgresql.org/docs/current/queries-order.html", ["row-order"]),
  make("SQLite", "The WITHOUT ROWID Optimization", "https://www.sqlite.org/withoutrowid.html", ["row-identity", "row-boundary"]),
];

export const columnSources: Source[] = [
  make("PostgreSQL", "DDL Basics", "https://www.postgresql.org/docs/current/ddl-basics.html", ["column-definition", "column-constraints"]),
  make("PostgreSQL", "Data Types", "https://www.postgresql.org/docs/current/datatype.html", ["column-types", "column-operations"]),
  make("PostgreSQL", "Select Lists", "https://www.postgresql.org/docs/current/queries-select-lists.html", ["column-operations"]),
  make("SQLite", "Datatypes In SQLite", "https://www.sqlite.org/datatype3.html", ["column-types", "column-boundary"]),
];

export const acidSources: Source[] = [
  make("PostgreSQL", "Transactions", "https://www.postgresql.org/docs/current/tutorial-transactions.html", ["acid-atomicity", "acid-consistency"]),
  make("PostgreSQL", "Write-Ahead Logging", "https://www.postgresql.org/docs/current/wal-intro.html", ["acid-durability", "acid-boundary"]),
  make("IBM Research", "Principles of Transaction-Oriented Database Recovery", "https://research.ibm.com/publications/principles-of-transaction-oriented-database-recovery", ["acid-durability"]),
  make("Microsoft Learn", "Transaction locking and row versioning", "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide", ["acid-isolation", "acid-boundary"]),
];

export const tcpSources: Source[] = [
  make("IETF", "RFC 9293 · Transmission Control Protocol", "https://www.rfc-editor.org/rfc/rfc9293.html", ["tcp-stream", "tcp-reliability"]),
  make("IETF", "RFC 5681 · TCP Congestion Control", "https://www.rfc-editor.org/rfc/rfc5681.html", ["tcp-congestion"]),
  make("IETF", "RFC 1122 · Requirements for Internet Hosts", "https://www.rfc-editor.org/rfc/rfc1122.html", ["tcp-stream", "tcp-boundary", "tcp-retry"]),
  make("IANA", "Service Name and Transport Protocol Port Number Registry", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", ["tcp-boundary"]),
];
