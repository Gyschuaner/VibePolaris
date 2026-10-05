import { source } from "./shared";

export const deadLetterQueueSources = [
  source("Amazon SQS", "Using dead-letter queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html", ["dlq-purpose", "dlq-retention", "dlq-redrive", "dlq-order", "dlq-retry"]),
  source("Google Cloud Pub/Sub", "Dead-letter topics", "https://docs.cloud.google.com/pubsub/docs/handling-failures", ["dlq-delivery"]),
  source("Azure Service Bus", "Dead-letter queues", "https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues", ["dlq-subqueue", "dlq-reason"]),
  source("Amazon SNS", "Dead-letter queues", "https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html", ["dlq-redrive"]),
  source("Azure Service Bus", "Prevent message loss and duplicate processing", "https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-message-loss-and-duplicates", ["dlq-duplicates"]),
];
