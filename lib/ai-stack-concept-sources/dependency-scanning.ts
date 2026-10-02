import { source } from "./shared";

export const dependencyScanningSources = [
  source("OWASP", "Software Supply Chain Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html", ["dependency-inventory"]),
  source("GitHub Docs", "Dependabot alerts", "https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts", ["dependency-alert"]),
  source("GitHub Docs", "Dependabot security updates", "https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates", ["dependency-upgrade"]),
  source("OWASP", "Dependency-Graph SBOM", "https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html", ["dependency-graph"]),
  source("OSV", "OSV schema", "https://ossf.github.io/osv-schema/", ["dependency-advisory"]),
];
