const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });
export const pipelineSources = [
  source('AWS Glue', 'Overview of workflows', 'https://docs.aws.amazon.com/glue/latest/dg/workflows_overview.html', ['pipeline-workflow']),
  source('Apache Airflow', 'Dags · Tasks, dependencies and trigger rules', 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html', ['pipeline-dependencies', 'pipeline-interval']),
  source('Apache Airflow', 'Best Practices · Creating a task', 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html', ['pipeline-replay']),
  source('World Wide Web Consortium', 'PROV-DM: The PROV Data Model', 'https://www.w3.org/TR/prov-dm/', ['pipeline-provenance'], '2013-04-30'),
];
export const webhookSources = [
  source('Stripe', 'Receive Stripe events in your webhook endpoint', 'https://docs.stripe.com/webhooks', ['webhook-notify', 'webhook-duplicate', 'webhook-order', 'webhook-redelivery']),
  source('Stripe', 'Resolve webhook signature verification errors', 'https://docs.stripe.com/webhooks/signature', ['webhook-signature']),
  source('GitHub', 'Best practices for using webhooks', 'https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks', ['webhook-accept']),
  source('GitHub', 'Handling failed webhook deliveries', 'https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries', ['webhook-redelivery']),
];
export const distributedSources = [
  source('Leslie Lamport · Communications of the ACM', 'Time, Clocks, and the Ordering of Events in a Distributed System', 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf', ['distributed-definition', 'distributed-order'], '1978-07'),
  source('Jacob Gabrielson · AWS Builders’ Library', 'Challenges with distributed systems', 'https://d1.awsstatic.com/builderslibrary/pdfs/challenges-with-distributed-systems.pdf', ['distributed-failure']),
  source('Marc Brooker · AWS Builders’ Library', 'Timeouts, retries, and backoff with jitter', 'https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf', ['distributed-timeout', 'distributed-budget']),
  source('Malcolm Featonby · AWS Builders’ Library', 'Making retries safe with idempotent APIs', 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/', ['distributed-reconcile']),
];
