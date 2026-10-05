import { source } from "./ai-stack-concept-sources/shared";

export const hashingSources = [
  source("NIST CSRC", "Hash function glossary", "https://csrc.nist.gov/glossary/term/hash_function", ["hash-definition", "hash-properties"]),
  source("NIST", "FIPS 180-4 · Secure Hash Standard", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final", ["hash-integrity", "hash-digest"]),
  source("OWASP", "Password Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", ["hash-password-boundary", "hash-salt", "hash-fast", "hash-cost", "hash-verify"]),
  source("IETF CFRG", "RFC 9106 · Argon2", "https://www.rfc-editor.org/rfc/rfc9106.html", ["hash-argon2"]),
  source("NIST", "SP 800-63B-4 · Password verifiers", "https://pages.nist.gov/800-63-4/sp800-63b.html", ["hash-verifier", "hash-upgrade"]),
];
