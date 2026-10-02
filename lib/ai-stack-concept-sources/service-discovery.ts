import { source } from "./shared";

export const serviceDiscoverySources = [
  source("Kubernetes", "DNS for Services and Pods", "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", ["discovery-name"]),
  source("Kubernetes", "Service", "https://kubernetes.io/docs/concepts/services-networking/service/", ["discovery-service"]),
  source("Kubernetes", "EndpointSlices", "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/", ["discovery-endpoints"]),
  source("NIST", "Microservices-Based Application Systems", "https://csrc.nist.gov/pubs/sp/800/204/final", ["discovery-health"]),
  source("HashiCorp", "Configure Consul DNS behavior", "https://developer.hashicorp.com/consul/docs/discover/dns/configure", ["discovery-cache"]),
];
