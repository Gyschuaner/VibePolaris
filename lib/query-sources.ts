const pg = (title: string, page: string, citations: string[]) => ({ publisher: "PostgreSQL Global Development Group", title: `PostgreSQL 18 · ${title}`, date: "", url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
export const sqlSources = [
  pg("SELECT", "sql-select", ["sql-select"]),
  pg("INSERT", "sql-insert", ["sql-insert"]),
  pg("UPDATE", "sql-update", ["sql-update"]),
  pg("DELETE", "sql-delete", ["sql-delete"]),
  pg("Using EXPLAIN", "using-explain", ["sql-plan", "sql-analyze"]),
];
export const migrationSources = [
  { publisher: "Django Software Foundation", title: "Django 5.2 · Migrations", date: "", url: "https://docs.djangoproject.com/en/5.2/topics/migrations/", citations: ["migration-files", "migration-dependencies", "migration-backends"] },
  { publisher: "Alembic · 官方文档", title: "Tutorial · Running our First Migration", date: "", url: "https://alembic.sqlalchemy.org/en/latest/tutorial.html", citations: ["migration-history"] },
  { publisher: "Alembic · 官方文档", title: "Auto Generating Migrations", date: "", url: "https://alembic.sqlalchemy.org/en/latest/autogenerate.html", citations: ["migration-review"] },
  { publisher: "Django Software Foundation", title: "Django 5.2 · Migration Operations · RunPython", date: "", url: "https://docs.djangoproject.com/en/5.2/ref/migration-operations/", citations: ["migration-reverse"] },
  { publisher: "Prisma · 官方文档", title: "Expand-and-contract migrations", date: "", url: "https://www.prisma.io/docs/guides/database/data-migration", citations: ["migration-compatible"] },
];
const sa = (title: string, page: string, citations: string[]) => ({ publisher: "SQLAlchemy · 官方文档", title: `SQLAlchemy 2.0 · ${title}`, date: "", url: `https://docs.sqlalchemy.org/en/20/orm/${page}.html`, citations });
export const ormSources = [
  sa("ORM Mapped Class Overview", "mapping_styles", ["orm-mapping"]),
  sa("ORM Quick Start", "quickstart", ["orm-query", "orm-commit"]),
  sa("Session Basics", "session_basics", ["orm-flush", "orm-rollback", "orm-identity"]),
  sa("Relationship Loading Techniques", "queryguide/relationships", ["orm-loading"]),
  sa("Table Configuration with Declarative · Column Names", "declarative_tables", ["orm-field"]),
];
