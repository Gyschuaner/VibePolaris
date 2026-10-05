import { source } from "./shared";

export const backpressureSources = [
  source("Reactive Streams", "Reactive Streams", "https://www.reactive-streams.org/", ["backpressure-streams", "backpressure-demand", "backpressure-distinguish"]),
  source("Ray", "Ray Data internals", "https://docs.ray.io/en/latest/data/data-internals.html", ["backpressure-ray", "backpressure-buffer"]),
  source("Ray", "Monitoring your workload", "https://docs.ray.io/en/latest/data/monitoring-your-workload.html", ["backpressure-observe"]),
  source("Google Cloud", "Design for graceful degradation", "https://docs.cloud.google.com/architecture/framework/reliability/graceful-degradation", ["backpressure-graceful"]),
  source("AWS", "Avoiding overload in distributed systems", "https://aws.amazon.com/builders-library/avoiding-overload-in-distributed-systems-by-putting-the-smaller-service-in-control/", ["backpressure-overload"]),
  source("Google Cloud", "Manage scaling risks", "https://docs.cloud.google.com/tasks/docs/manage-cloud-task-scaling", ["backpressure-ramp"]),
];
