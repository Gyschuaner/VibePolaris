export const cacheSources = [
  { publisher: "Microsoft · Azure Architecture Center", title: "Cache-Aside pattern", date: "", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside", citations: ["cache-mechanism", "cache-invalidating", "cache-consistency"] },
  { publisher: "Redis · 官方文档", title: "GET", date: "", url: "https://redis.io/docs/latest/commands/get/", citations: ["cache-key"] },
  { publisher: "Redis · 官方文档", title: "EXPIRE", date: "", url: "https://redis.io/docs/latest/commands/expire/", citations: ["cache-expiry"] },
  { publisher: "Redis · 官方文档", title: "Key eviction", date: "", url: "https://redis.io/docs/latest/develop/reference/eviction/", citations: ["cache-eviction"] },
];
export const poolSources = [
  { publisher: "Psycopg · 官方在线文档", title: "Psycopg 3 · Connection pools", date: "", url: "https://www.psycopg.org/psycopg3/docs/advanced/pool.html", citations: ["pool-mechanism", "pool-waiting"] },
  { publisher: "SQLAlchemy · 官方文档", title: "SQLAlchemy 2.0 · Connection Pooling", date: "", url: "https://docs.sqlalchemy.org/en/20/core/pooling.html", citations: ["pool-lazy", "pool-reset", "pool-disconnect"] },
  { publisher: "node-postgres · 官方文档", title: "Pooling · Checkout, use, and return", date: "", url: "https://node-postgres.com/features/pooling", citations: ["pool-release"] },
  { publisher: "PostgreSQL Global Development Group", title: "PostgreSQL 18 · Connections and Authentication", date: "", url: "https://www.postgresql.org/docs/18/runtime-config-connection.html", citations: ["pool-capacity"] },
];
const pg = (title: string, page: string, citations: string[]) => ({ publisher: "PostgreSQL Global Development Group", title: `PostgreSQL 18 · ${title}`, date: "", url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
export const replicationSources = [
  pg("Log-Shipping Standby Servers", "warm-standby", ["replica-stream", "replica-sync"]),
  pg("Hot Standby", "hot-standby", ["replica-visible"]),
  pg("Logical Replication", "logical-replication", ["replica-granularity"]),
  pg("Continuous Archiving and Point-in-Time Recovery", "continuous-archiving", ["replica-recovery"]),
];
