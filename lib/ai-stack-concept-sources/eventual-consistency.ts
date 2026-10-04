import { source } from "./shared";

export const eventualConsistencySources = [
  source("Amazon DynamoDB", "Read consistency", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html", ["eventual-dynamodb", "eventual-read-choice"]),
  source("Amazon DynamoDB", "Global tables: How it works", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/globaltables_HowItWorks.html", ["eventual-replication", "eventual-conflict-rule"]),
  source("Google Cloud", "Balancing strong and eventual consistency with Cloud Datastore", "https://docs.cloud.google.com/datastore/docs/articles/balancing-strong-and-eventual-consistency-with-google-cloud-datastore?hl=en", ["eventual-definition", "eventual-query-shape"]),
  source("Microsoft Azure", "Consistency levels in Azure Cosmos DB", "https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels", ["eventual-stale-window", "eventual-boundary-choice"]),
  source("Microsoft Azure", "Minimize coordination", "https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/minimize-coordination", ["eventual-coordination"]),
];
