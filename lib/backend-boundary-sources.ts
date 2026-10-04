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

export const ipAddressSources: BoundarySource[] = [
  make("IETF", "RFC 791 · Internet Protocol", "https://www.rfc-editor.org/rfc/rfc791.html", ["ip-definition", "ip-routing"], "1981-09"),
  make("IETF", "RFC 8200 · Internet Protocol, Version 6 (IPv6) Specification", "https://www.rfc-editor.org/rfc/rfc8200.html", ["ip-definition", "ip-ipv6"], "2017-07"),
  make("IETF", "RFC 3022 · Traditional IP Network Address Translator", "https://www.rfc-editor.org/rfc/rfc3022.html", ["ip-nat", "ip-observation"], "2001-01"),
  make("IETF", "RFC 1918 · Address Allocation for Private Internets", "https://www.rfc-editor.org/rfc/rfc1918.html", ["ip-private", "ip-observation"], "1996-02"),
];

export const networkPortSources: BoundarySource[] = [
  make("IETF", "RFC 9293 · Transmission Control Protocol", "https://www.rfc-editor.org/rfc/rfc9293.html", ["port-definition", "port-demux", "port-tcp"], "2022-08"),
  make("IETF", "RFC 768 · User Datagram Protocol", "https://www.rfc-editor.org/rfc/rfc768.html", ["port-definition", "port-tcp", "port-udp"], "1980-08"),
  make("IETF", "RFC 6335 · Service Name and Port Number Procedures", "https://www.rfc-editor.org/rfc/rfc6335.html", ["port-range", "port-service"], "2011-08"),
  make("IANA", "Service Name and Transport Protocol Port Number Registry", "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", ["port-service", "port-filter"], ""),
  make("IETF", "RFC 1122 · Requirements for Internet Hosts", "https://www.rfc-editor.org/rfc/rfc1122.html", ["port-demux", "port-failure", "port-filter"], "1989-10"),
];
