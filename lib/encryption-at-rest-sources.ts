import { source } from "./ai-stack-concept-sources/shared";

export const encryptionAtRestSources = [
  source("NIST", "SP 800-111 · Guide to Storage Encryption Technologies", "https://csrc.nist.gov/pubs/sp/800/111/final", [
    "ear-definition",
    "ear-storage-levels",
    "ear-threat-model",
  ]),
  source("OWASP", "Cryptographic Storage Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html", [
    "ear-layer-boundary",
    "ear-authenticated",
    "ear-defense-depth",
    "ear-separation",
    "ear-rotation",
    "ear-key-storage",
  ]),
  source("Google Cloud", "Envelope encryption", "https://cloud.google.com/kms/docs/envelope-encryption", [
    "ear-dek-kek",
    "ear-encrypt-flow",
    "ear-decrypt-flow",
    "ear-kek-boundary",
  ]),
  source("AWS", "AWS KMS keys", "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html", [
    "ear-kms-hierarchy",
    "ear-kms-lifecycle",
  ]),
  source("NIST", "SP 800-57 Part 1 Rev. 5 · Recommendation for Key Management", "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final", [
    "ear-key-management",
  ]),
];
