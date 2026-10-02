import { source } from "./shared";

export const threatModelingSources = [
  source("OWASP", "Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html", ["threat-process"]),
  source("OWASP", "Threat Modeling project", "https://owasp.org/www-community/Threat_Modeling", ["threat-boundary-definition"]),
  source("NIST", "SP 800-154: Guide to Data-Centric System Threat Modeling", "https://csrc.nist.gov/pubs/sp/800/154/ipd", ["threat-assets"]),
  source("Microsoft", "Threat modeling", "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool", ["threat-controls"]),
  source("CISA", "Secure by Design", "https://www.cisa.gov/securebydesign", ["threat-design"]),
];
