import type { harnessSources } from "./harness-references";

export type BoundarySource = (typeof harnessSources)[number];

const make = (publisher: string, title: string, url: string, citations: string[], date = ""): BoundarySource => ({
  publisher,
  title,
  url,
  date,
  citations,
});

export const firewallSources: BoundarySource[] = [
  make("NIST", "SP 800-41 Rev. 1 · Guidelines on Firewalls and Firewall Policy", "https://csrc.nist.gov/pubs/sp/800/41/r1/final", ["firewall-definition", "firewall-policy", "firewall-testing"], "2009-09"),
  make("AWS", "VPC security groups", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html", ["firewall-rules", "firewall-state"]),
  make("nftables", "nftables wiki · Operations at ruleset level", "https://wiki.nftables.org/wiki-nftables/index.php/Operations_at_ruleset_level", ["firewall-order", "firewall-rules"]),
  make("OWASP", "SCSVS · Network segmentation and firewalling", "https://scs.owasp.org/handbooks/07-infrastructure-security/part3-network-and-availability/", ["firewall-boundary", "firewall-testing"]),
];
