import { source } from "./ai-stack-concept-sources/shared";

export const encryptionTransitSources = [
  source("IETF", "RFC 8446 · The Transport Layer Security Protocol Version 1.3", "https://www.rfc-editor.org/rfc/rfc8446.html", [
    "transit-channel",
    "transit-handshake",
    "transit-record",
    "transit-0rtt",
  ]),
  source("IETF", "RFC 9525 · Service Identity in TLS", "https://www.rfc-editor.org/rfc/rfc9525.html", [
    "transit-identity",
    "transit-san",
    "transit-sni",
  ]),
  source("NIST", "SP 800-52 Rev. 2 · Guidelines for TLS Implementations", "https://csrc.nist.gov/pubs/sp/800/52/r2/final", [
    "transit-config",
    "transit-version",
  ]),
  source("OWASP", "Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html", [
    "transit-hop",
    "transit-all-pages",
    "transit-cookie",
    "transit-strong",
  ]),
  source("MDN", "Transport Layer Security (TLS)", "https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security", [
    "transit-channel",
    "transit-handshake",
    "transit-endpoint",
    "transit-mixed",
  ]),
];
