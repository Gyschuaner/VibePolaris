import { source } from "./shared";

export const secretScanningSources = [
  source("GitHub Docs", "About secret scanning", "https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning", ["secret-detect"]),
  source("GitHub Docs", "Push protection", "https://docs.github.com/en/code-security/concepts/secret-security/push-protection", ["secret-block-definition"]),
  source("GitHub Docs", "Secret scanning REST API", "https://docs.github.com/en/rest/secret-scanning", ["secret-history"]),
  source("OWASP", "Secrets Management Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html", ["secret-rotate"]),
  source("NIST", "Recommendation for Key Management", "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", ["secret-lifecycle"]),
];
