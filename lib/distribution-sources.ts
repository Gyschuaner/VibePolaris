const pg = (title: string, page: string, citations: string[]) => ({ publisher: 'PostgreSQL Global Development Group', title: `PostgreSQL 18 · ${title}`, date: '', url: `https://www.postgresql.org/docs/18/${page}.html`, citations });
const mongo = (title: string, page: string, citations: string[]) => ({ publisher: 'MongoDB · 官方文档', title, date: '', url: `https://www.mongodb.com/docs/manual/${page}/`, citations });
const rabbit = (title: string, page: string, citations: string[]) => ({ publisher: 'RabbitMQ · 官方文档', title, date: '', url: `https://www.rabbitmq.com/${page}`, citations });
export const backupSources = [
  pg('SQL Dump', 'backup-dump', ['backup-snapshot']),
  pg('pg_dump', 'app-pgdump', ['backup-scope']),
  pg('pg_restore', 'app-pgrestore', ['backup-restore']),
  pg('Continuous Archiving and Point-in-Time Recovery', 'continuous-archiving', ['backup-pitr']),
];
export const shardingSources = [
  mongo('Sharding', 'sharding', ['shard-distribution', 'shard-routing']),
  mongo('Shard Keys', 'core/sharding-shard-key', ['shard-key']),
  mongo('Hashed Sharding', 'core/hashed-sharding', ['shard-hash']),
  mongo('Manage Sharded Cluster Balancer', 'core/sharding-balancer-administration', ['shard-moving']),
  pg('Table Partitioning', 'ddl-partitioning', ['shard-partition']),
];
export const queueSources = [
  rabbit('Work Queues · JavaScript', 'tutorials/tutorial-two-javascript', ['queue-work', 'queue-prefetch']),
  rabbit('Consumer Acknowledgements and Publisher Confirms', 'docs/confirms', ['queue-ack', 'queue-publisher']),
  rabbit('Queues', 'docs/queues', ['queue-order', 'queue-durable']),
  rabbit('Reliability Guide', 'docs/reliability', ['queue-duplicate', 'queue-failure']),
];
