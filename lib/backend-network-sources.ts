import type { harnessSources } from "./harness-references";

export type Source = (typeof harnessSources)[number];
const make = (publisher: string, title: string, url: string, citations: string[]): Source => ({ publisher, title, date: "", url, citations });

export const rbacSources: Source[] = [
  make("NIST", "Role-Based Access Control", "https://csrc.nist.gov/projects/role-based-access-control", ["rbac-definition", "rbac-roles"]),
  make("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["rbac-boundary", "rbac-failure", "rbac-audit"]),
  make("NIST", "SP 800-162 · Guide to Attribute Based Access Control", "https://csrc.nist.gov/pubs/sp/800/162/upd2/final", ["rbac-boundary", "rbac-audit"]),
  make("Microsoft Learn", "Role-based access control", "https://learn.microsoft.com/en-us/azure/role-based-access-control/overview", ["rbac-roles", "rbac-operations"]),
];
