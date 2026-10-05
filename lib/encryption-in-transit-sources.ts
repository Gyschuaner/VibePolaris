import { source } from "./ai-stack-concept-sources/shared";

export const encryptionInTransitSources = [
  source("IETF", "RFC 8446 · The Transport Layer Security Protocol Version 1.3", "https://www.rfc-editor.org/rfc/rfc8446.html", [
    "eit-goal",
    "eit-handshake",
    "eit-record",
    "eit-0rtt",
  ]),
  source("IETF", "RFC 9525 · Service Identity in TLS", "https://www.rfc-editor.org/rfc/rfc9525.html", [
    "eit-identity",
    "eit-san",
    "eit-sni",
  ]),
  source("NIST", "SP 800-52 Rev. 2 · Guidelines for TLS Implementations", "https://csrc.nist.gov/pubs/sp/800/52/r2/final", [
    "eit-config",
    "eit-version",
  ]),
  source("OWASP", "Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html", [
    "eit-strong",
    "eit-all-pages",
    "eit-termination",
    "eit-wildcard",
    "eit-cookie",
  ]),
  source("MDN", "Transport Layer Security (TLS)", "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security", [
    "eit-mitm",
    "eit-browser-handshake",
    "eit-endpoint",
    "eit-mixed",
  ]),
];
