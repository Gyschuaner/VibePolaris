import { source } from "./shared";

export const sastSources = [
  source("OWASP", "Source Code Analysis Tools", "https://owasp.org/www-community/Source_Code_Analysis_Tools", ["sast-static"]),
  source("OWASP", "Code Review Guide", "https://owasp.org/www-project-code-review-guide/", ["sast-review"]),
  source("CodeQL", "About CodeQL", "https://codeql.github.com/docs/codeql-overview/about-codeql/", ["sast-dataflow"]),
  source("NIST", "Secure Software Development Framework", "https://csrc.nist.gov/pubs/sp/800/218/final", ["sast-process"]),
  source("OWASP", "SQL Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", ["sast-fix"]),
];
