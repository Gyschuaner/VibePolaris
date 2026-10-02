import { source } from "./shared";

export const permissionBoundarySources = [
  source("NIST", "Role Based Access Control", "https://csrc.nist.gov/projects/role-based-access-control/faqs", ["permission-role"]),
  source("NIST", "Least privilege", "https://csrc.nist.gov/glossary/term/least_privilege", ["permission-least"]),
  source("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", ["permission-enforce"]),
  source("Model Context Protocol", "Authorization", "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization", ["permission-protocol"]),
  source("NIST", "SP 800-162: Attribute Based Access Control", "https://csrc.nist.gov/pubs/sp/800/162/final", ["permission-policy-definition"]),
];
