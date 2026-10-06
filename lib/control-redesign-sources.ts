import { source } from "@/lib/ai-stack-concept-sources/shared";

export const conditionalBranchSources = [
  source("MDN Web Docs", "if...else", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else", ["branch-definition", "branch-path", "branch-boundary"]),
  source("ECMA International", "If Statement", "https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-if-statement", ["branch-evaluate", "branch-path"]),
  source("Python Docs", "The if statement", "https://docs.python.org/3/reference/compound_stmts.html#if", ["branch-definition", "branch-evaluate"]),
  source("TypeScript Docs", "Narrowing", "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", ["branch-evaluate"]),
  source("OWASP", "Authentication Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", ["branch-boundary"]),
];

export const loopSources = [
  source("MDN Web Docs", "Loops and iteration", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration", ["loop-definition", "loop-progress"]),
  source("ECMA International", "Iteration statements", "https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-iteration-statements", ["loop-definition", "loop-progress"]),
  source("Python Docs", "The for statement", "https://docs.python.org/3/reference/compound_stmts.html#the-for-statement", ["loop-definition", "loop-progress"]),
  source("Python Docs", "The while statement", "https://docs.python.org/3/reference/compound_stmts.html#the-while-statement", ["loop-step", "loop-boundary"]),
];

export const objectSources = [
  source("MDN Web Docs", "Working with objects", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects", ["object-definition", "object-mutate", "object-read"]),
  source("ECMA International", "Object type", "https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-object-type", ["object-definition"]),
  source("IETF", "RFC 8259 · JSON", "https://www.rfc-editor.org/rfc/rfc8259", ["object-boundary"]),
  source("Python Docs", "Dictionaries", "https://docs.python.org/3/tutorial/datastructures.html#dictionaries", ["object-definition", "object-read"]),
];

export const arraySources = [
  source("MDN Web Docs", "Indexed collections", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections", ["array-definition", "array-insert", "array-shift"]),
  source("ECMA International", "Array objects", "https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array-objects", ["array-insert"]),
  source("Python Docs", "Sequence types", "https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range", ["array-definition", "array-shift"]),
  source("IETF", "RFC 8259 · Arrays", "https://www.rfc-editor.org/rfc/rfc8259#section-5", ["array-boundary"]),
];

export const clientServerSources = [
  source("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["client-definition", "client-status"]),
  source("MDN Web Docs", "Overview of HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", ["client-definition", "client-status"]),
  source("MDN Web Docs", "HTTP messages", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages", ["client-envelope"]),
  source("WHATWG", "Fetch Standard", "https://fetch.spec.whatwg.org/", ["client-roundtrip"]),
];

export const monolithSources = [
  source("Microsoft Learn", "Common web application architectures", "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures", ["monolith-definition", "monolith-release"]),
  source("AWS", "Building monoliths or microservices", "https://docs.aws.amazon.com/whitepapers/latest/develop-deploy-dotnet-apps-on-aws/building-monoliths-or-microservices.html", ["monolith-definition", "monolith-tradeoff"]),
  source("Google Cloud", "What is microservices architecture?", "https://cloud.google.com/learn/what-is-microservices-architecture", ["monolith-definition", "monolith-tradeoff"]),
  source("Martin Fowler", "Monolith First", "https://martinfowler.com/bliki/MonolithFirst.html", ["monolith-tradeoff"]),
];

export const microservicesSources = [
  source("Microsoft Learn", "Microservices architecture style", "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices", ["micro-definition", "micro-failure"]),
  source("NIST", "SP 800-204 · Microservices-based Application Systems", "https://csrc.nist.gov/pubs/sp/800/204/final", ["micro-definition", "micro-failure"]),
  source("AWS Well-Architected", "Choose how to segment your workload", "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_service_architecture_monolith_soa_microservice.html", ["micro-tradeoff"]),
  source("Google Cloud", "What is microservices architecture?", "https://cloud.google.com/learn/what-is-microservices-architecture", ["micro-definition", "micro-tradeoff"]),
  source("Martin Fowler", "Microservices", "https://www.martinfowler.com/microservices/", ["micro-failure", "micro-tradeoff"]),
];

export const distributedSystemSources = [
  source("Leslie Lamport", "Time, clocks, and the ordering of events", "https://lamport.azurewebsites.net/pubs/time-clocks.pdf", ["distributed-definition", "distributed-delay", "distributed-order"]),
  source("AWS", "What is distributed computing?", "https://aws.amazon.com/what-is/distributed-computing/", ["distributed-definition", "distributed-order"]),
  source("NIST", "Cloud Computing Reference Architecture", "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication500-292.pdf", ["distributed-definition", "distributed-order"]),
  source("AWS Well-Architected", "Distributed systems", "https://docs.aws.amazon.com/wellarchitected/latest/framework/distributed-system.html", ["distributed-delay", "distributed-order"]),
  source("Martin Fowler", "Patterns of Distributed Systems", "https://martinfowler.com/articles/patterns-of-distributed-systems/", ["distributed-delay", "distributed-order"]),
];

export const eventDrivenSources = [
  source("CloudEvents", "CloudEvents Specification", "https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md", ["event-definition", "event-idempotency"]),
  source("Microsoft Learn", "Event-driven architecture style", "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven", ["event-fanout", "event-tradeoff"]),
  source("AWS EventBridge", "Events", "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html", ["event-definition", "event-fanout"]),
  source("Google Cloud", "Eventarc overview", "https://cloud.google.com/eventarc/docs/overview", ["event-fanout", "event-tradeoff"]),
];

export const serverlessSources = [
  source("Google Cloud", "What is serverless computing?", "https://cloud.google.com/discover/what-is-serverless-computing", ["serverless-definition", "serverless-tradeoff"]),
  source("AWS Lambda", "Runtime environment lifecycle", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html", ["serverless-cold"]),
  source("AWS Lambda", "Event-driven architectures", "https://docs.aws.amazon.com/lambda/latest/dg/concepts-event-driven-architectures.html", ["serverless-definition", "serverless-scale"]),
  source("AWS Lambda", "Lambda functions", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions-chapter.html", ["serverless-scale", "serverless-tradeoff"]),
  source("CNCF", "The CNCF takes first step towards serverless computing", "https://www.cncf.io/blog/2018/02/14/cncf-takes-first-step-towards-serverless-computing/", ["serverless-definition", "serverless-tradeoff"]),
];
