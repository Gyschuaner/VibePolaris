import { source } from "./ai-stack-concept-sources/shared";

export const leastPrivilegeSources = [
  source("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["least-definition", "least-design", "least-deny", "least-review"]),
  source("AWS", "Security best practices in IAM", "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", ["least-actions", "least-conditions", "least-revoke"]),
  source("Google Cloud", "Use IAM securely", "https://cloud.google.com/iam/docs/using-iam-securely", ["least-scope", "least-boundary"]),
  source("NIST", "SP 800-207 · Zero Trust Architecture", "https://csrc.nist.gov/pubs/sp/800/207/final", ["least-verify"]),
  source("Kubernetes", "Using RBAC Authorization", "https://kubernetes.io/docs/reference/access-authn-authz/rbac/", ["least-scope", "least-additive"]),
];
