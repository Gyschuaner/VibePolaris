const source = (publisher: string, title: string, url: string, citations: string[]) => ({ publisher, title, url, date: '', citations });
export const batchSources = [
  source('Apache Beam', 'Beam Basics', 'https://beam.apache.org/documentation/basics/', ['batch-bounded']),
  source('Apache Spark', 'RDD Programming Guide', 'https://spark.apache.org/docs/latest/rdd-programming-guide.html', ['batch-execute']),
  source('Apache Hadoop', 'MapReduce Tutorial', 'https://hadoop.apache.org/docs/current/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html', ['batch-retry']),
  source('Amazon Web Services', 'What is Batch Processing?', 'https://aws.amazon.com/what-is/batch-processing/', ['batch-schedule']),
];
export const streamSources = [
  source('Apache Kafka', 'Kafka Streams · Core Concepts', 'https://kafka.apache.org/42/streams/core-concepts/', ['stream-flow', 'stream-state']),
  source('Apache Flink', 'Timely Stream Processing', 'https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/', ['stream-time', 'stream-watermark']),
  source('Apache Beam', 'Programming Guide · Watermarks and late data', 'https://beam.apache.org/documentation/programming-guide/#watermarks-and-late-data', ['stream-window']),
  source('Apache Flink', 'Windows · Allowed lateness and side outputs', 'https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/operators/windows/', ['stream-late']),
];
export const eventDrivenSources = [
  source('Amazon Web Services', 'Event-Driven Architecture', 'https://aws.amazon.com/event-driven-architecture/', ['eda-fact', 'eda-independent']),
  source('RabbitMQ', 'Publish/Subscribe · JavaScript tutorial', 'https://www.rabbitmq.com/tutorials/tutorial-three-javascript', ['eda-fanout']),
  source('Cloud Native Computing Foundation · CloudEvents', 'CloudEvents Specification v1.0.2', 'https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md', ['eda-envelope', 'eda-duplicate']),
  source('Amazon EventBridge', 'Retry policy and dead-letter queues', 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html', ['eda-retry']),
];
