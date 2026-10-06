import { source } from "@/lib/ai-stack-concept-sources/shared";

export const containerSources = [
  source("Docker Docs", "What is a container?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/", ["container-definition", "container-view"]),
  source("Docker Docs", "What is an image?", "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/", ["container-definition"]),
  source("Docker Docs", "Running containers", "https://docs.docker.com/engine/containers/run/", ["container-resource", "container-view"]),
  source("Microsoft Learn", "Containers vs. virtual machines", "https://learn.microsoft.com/en-us/virtualization/windowscontainers/about/containers-vs-vm", ["container-kernel", "container-boundary"]),
  source("NIST", "SP 800-190 · Application Container Security Guide", "https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-190.pdf", ["container-privilege", "container-boundary"]),
];

export const containerImageSources = [
  source("Open Container Initiative", "Image Format Specification", "https://github.com/opencontainers/image-spec", ["image-definition", "image-digest"]),
  source("Docker Docs", "Understanding image layers", "https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/", ["image-layers", "image-copy"]),
  source("Docker Docs", "Manage data in Docker", "https://docs.docker.com/engine/storage/", ["image-writable", "image-volume"]),
  source("Docker Docs", "Storage drivers", "https://docs.docker.com/engine/storage/drivers/", ["image-copy"]),
  source("NIST", "SP 800-190 · Application Container Security Guide", "https://csrc.nist.gov/pubs/sp/800/190/final", ["image-writable", "image-volume"]),
];

export const serviceDiscoverySources = [
  source("Kubernetes", "DNS for Services and Pods", "https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/", ["discovery-name", "discovery-cache"]),
  source("Kubernetes", "Service", "https://kubernetes.io/docs/concepts/services-networking/service/", ["discovery-name", "discovery-endpoints"]),
  source("Kubernetes", "EndpointSlices", "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/", ["discovery-health", "discovery-endpoints"]),
  source("NIST", "SP 800-204 · Microservices-based Application Systems", "https://csrc.nist.gov/pubs/sp/800/204/final", ["discovery-health", "discovery-boundary"]),
  source("HashiCorp Consul", "Configure DNS", "https://developer.hashicorp.com/consul/docs/discover/dns/configure", ["discovery-cache"]),
];

export const observabilitySources = [
  source("OpenTelemetry", "Signals", "https://opentelemetry.io/docs/concepts/signals/", ["observability-signals", "observability-trace"]),
  source("OpenTelemetry", "Observability primer", "https://opentelemetry.io/docs/concepts/observability-primer/", ["observability-definition", "observability-trace"]),
  source("OpenTelemetry", "Logs data model", "https://opentelemetry.io/docs/specs/otel/logs/", ["observability-logs", "observability-correlation"]),
  source("OpenTelemetry", "Context propagation", "https://opentelemetry.io/docs/concepts/context-propagation/", ["observability-correlation", "observability-context"]),
  source("Kubernetes", "Observability", "https://kubernetes.io/docs/concepts/cluster-administration/observability/", ["observability-logs", "observability-correlation"]),
];

export const sastSources = [
  source("OWASP", "Source Code Analysis Tools", "https://community.owasp.org/Source_Code_Analysis_Tools", ["sast-definition", "sast-limit"]),
  source("OWASP", "Code Review Guide", "https://owasp.org/projects/code-review-guide", ["sast-review", "sast-limit"]),
  source("GitHub CodeQL", "About CodeQL", "https://codeql.github.com/docs/codeql-overview/about-codeql/", ["sast-dataflow", "sast-definition"]),
  source("NIST", "SP 800-218 · Secure Software Development Framework", "https://csrc.nist.gov/pubs/sp/800/218/final", ["sast-review", "sast-limit"]),
  source("OWASP", "SQL Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", ["sast-dataflow", "sast-limit"]),
];

export const secretScanningSources = [
  source("GitHub Docs", "About secret scanning", "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning", ["secret-detection", "secret-history"]),
  source("GitHub Docs", "Push protection", "https://docs.github.com/en/code-security/concepts/secret-security/push-protection", ["secret-block", "secret-history"]),
  source("GitHub REST API", "Secret scanning", "https://docs.github.com/en/rest/secret-scanning", ["secret-detection", "secret-audit"]),
  source("OWASP", "Secrets Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html", ["secret-rotate", "secret-audit"]),
  source("NIST", "SP 800-57 Part 1 Revision 5", "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", ["secret-rotate", "secret-audit"]),
];

export const dependencyScanningSources = [
  source("OWASP", "Software Supply Chain Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html", ["dependency-definition", "dependency-boundary"]),
  source("GitHub Docs", "About Dependabot alerts", "https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts", ["dependency-match", "dependency-path"]),
  source("GitHub Docs", "Dependabot security updates", "https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates", ["dependency-fix", "dependency-boundary"]),
  source("OWASP", "Dependency-Check and SBOM", "https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html", ["dependency-path", "dependency-definition"]),
  source("OpenSSF", "OSV schema", "https://ossf.github.io/osv-schema/", ["dependency-match"]),
];

export const threatModelingSources = [
  source("OWASP", "Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html", ["threat-definition", "threat-control"]),
  source("OWASP", "Threat Modeling", "https://community.owasp.org/Threat_Modeling", ["threat-boundary", "threat-path"]),
  source("NIST", "SP 800-154 · Guide to Data-Centric Threat Modeling", "https://csrc.nist.gov/pubs/sp/800/154/ipd", ["threat-definition", "threat-path"]),
  source("Microsoft Learn", "Threat Modeling Tool", "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool", ["threat-control", "threat-boundary"]),
  source("CISA", "Secure by Design", "https://www.cisa.gov/securebydesign", ["threat-control", "threat-boundary"]),
];

export const toolApprovalSources = [
  source("OpenAI Agents SDK", "Human in the loop", "https://openai.github.io/openai-agents-python/human_in_the_loop/", ["approval-definition", "approval-scope"]),
  source("OpenAI Agents SDK", "Tools", "https://openai.github.io/openai-agents-python/tools/", ["approval-parameters", "approval-execution"]),
  source("Model Context Protocol", "Tools", "https://modelcontextprotocol.io/specification/2025-06-18/server/tools", ["approval-parameters", "approval-execution"]),
  source("Model Context Protocol", "Authorization", "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization", ["approval-scope", "approval-audit"]),
  source("OpenAI Agents SDK", "MCP", "https://openai.github.io/openai-agents-python/mcp/", ["approval-execution"]),
];

export const evaluationDatasetSources = [
  source("Anthropic", "Demystifying evals for AI agents", "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", ["dataset-definition", "dataset-coverage"]),
  source("Google ML Crash Course", "Dividing datasets", "https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets", ["dataset-split", "dataset-leakage"]),
  source("scikit-learn", "Cross-validation", "https://scikit-learn.org/stable/modules/cross_validation.html", ["dataset-split", "dataset-coverage"]),
  source("OpenAI", "Evals guide", "https://platform.openai.com/docs/guides/evals", ["dataset-definition", "dataset-version"]),
  source("NIST", "AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework", ["dataset-coverage", "dataset-boundary"]),
];
