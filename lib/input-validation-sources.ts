import { source } from "./ai-stack-concept-sources/shared";

export const inputValidationSources = [
  source("OWASP", "Input Validation Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html", [
    "iv-definition",
    "iv-client-server",
    "iv-syntax-semantics",
    "iv-allowlist",
    "iv-parse-limits",
    "iv-structured",
    "iv-boundary",
  ]),
  source("JSON Schema", "JSON Schema Validation · Draft 2020-12", "https://json-schema.org/draft/2020-12/json-schema-validation", [
    "iv-schema",
    "iv-format",
  ]),
  source("OWASP", "Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", [
    "iv-authorization",
  ]),
  source("OWASP", "Injection Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html", [
    "iv-parameterized",
    "iv-query-allowlist",
  ]),
  source("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", [
    "iv-status",
    "iv-400-422",
  ]),
];
