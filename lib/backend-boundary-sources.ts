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

export const packetSources: BoundarySource[] = [
  make("IETF", "RFC 791 · Internet Protocol", "https://www.rfc-editor.org/rfc/rfc791.html", ["packet-definition", "packet-layer", "packet-route", "packet-ipv4-fragment", "packet-reassembly"], "1981-09"),
  make("IETF", "RFC 8200 · Internet Protocol, Version 6 (IPv6) Specification", "https://www.rfc-editor.org/rfc/rfc8200.html", ["packet-definition", "packet-hop", "packet-ipv6-fragment"], "2017-07"),
  make("IETF", "RFC 1191 · Path MTU Discovery", "https://www.rfc-editor.org/rfc/rfc1191.html", ["packet-path-mtu", "packet-ipv4-fragment", "packet-diagnostic"], "1990-11"),
  make("IETF", "RFC 8201 · Path MTU Discovery for IP version 6", "https://www.rfc-editor.org/rfc/rfc8201.html", ["packet-path-mtu", "packet-ipv6-fragment", "packet-diagnostic"], "2017-07"),
  make("IETF", "RFC 792 · Internet Control Message Protocol", "https://www.rfc-editor.org/rfc/rfc792.html", ["packet-hop", "packet-reassembly", "packet-diagnostic"], "1981-09"),
];

export const urlSources: BoundarySource[] = [
  make("IETF", "RFC 3986 · Uniform Resource Identifier: Generic Syntax", "https://www.rfc-editor.org/rfc/rfc3986.html", ["url-components", "url-identity", "url-percent", "url-relative", "url-fragment"], "2005-01"),
  make("WHATWG", "URL Standard", "https://url.spec.whatwg.org/", ["url-components", "url-percent", "url-relative", "url-base"], "living standard"),
  make("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["url-fragment"], "2022-06"),
  make("IETF", "RFC 9112 · HTTP/1.1", "https://www.rfc-editor.org/rfc/rfc9112.html", ["url-request-target", "url-fragment"], "2022-06"),
  make("WHATWG", "HTML Standard · URLs and fetching", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html", ["url-base"], "living standard"),
];

export const hostnameSources: BoundarySource[] = [
  make("IETF", "RFC 1035 · Domain Names - Implementation and Specification", "https://www.rfc-editor.org/rfc/rfc1035.html", ["hostname-definition", "hostname-resolution"], "1987-11"),
  make("IETF", "RFC 1123 · Requirements for Internet Hosts", "https://www.rfc-editor.org/rfc/rfc1123.html", ["hostname-syntax", "hostname-resolution", "hostname-multihomed", "hostname-diagnostic"], "1989-10"),
  make("IETF", "RFC 8499 · DNS Terminology", "https://www.rfc-editor.org/rfc/rfc8499.html", ["hostname-definition", "hostname-syntax"], "2019-01"),
  make("IETF", "RFC 9525 · Service Identity in TLS", "https://www.rfc-editor.org/rfc/rfc9525.html", ["hostname-tls"], "2023-11"),
  make("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["hostname-tls", "hostname-host", "hostname-diagnostic"], "2022-06"),
];

export const dnsRecordSources: BoundarySource[] = [
  make("IETF", "RFC 1034 · Domain Concepts and Facilities", "https://www.rfc-editor.org/rfc/rfc1034.html", ["dns-record-shape-detail", "dns-record-authority", "dns-record-cache"], "1987-11"),
  make("IETF", "RFC 1035 · Domain Names - Implementation and Specification", "https://www.rfc-editor.org/rfc/rfc1035.html", ["dns-record-shape-detail", "dns-record-type", "dns-record-cname"], "1987-11"),
  make("IETF", "RFC 2181 · Clarifications to the DNS Specification", "https://www.rfc-editor.org/rfc/rfc2181.html", ["dns-record-set", "dns-record-cname", "dns-record-authority", "dns-record-diagnostic"], "1997-07"),
  make("IETF", "RFC 2308 · Negative Caching of DNS Queries", "https://www.rfc-editor.org/rfc/rfc2308.html", ["dns-record-cache", "dns-record-negative", "dns-record-diagnostic"], "1998-03"),
  make("IETF", "RFC 8499 · DNS Terminology", "https://www.rfc-editor.org/rfc/rfc8499.html", ["dns-record-cname", "dns-record-negative"], "2019-01"),
];

export const dnsResolverSources: BoundarySource[] = [
  make("IETF", "RFC 1034 · Domain Concepts and Facilities", "https://www.rfc-editor.org/rfc/rfc1034.html", ["resolver-roles", "resolver-cache", "resolver-walk", "resolver-response"], "1987-11"),
  make("IETF", "RFC 1035 · Domain Names - Implementation and Specification", "https://www.rfc-editor.org/rfc/rfc1035.html", ["resolver-query", "resolver-walk", "resolver-response", "resolver-diagnosis"], "1987-11"),
  make("IETF", "RFC 8499 · DNS Terminology", "https://www.rfc-editor.org/rfc/rfc8499.html", ["resolver-roles", "resolver-query", "resolver-response", "resolver-negative"], "2019-01"),
  make("IETF", "RFC 2308 · Negative Caching of DNS Queries", "https://www.rfc-editor.org/rfc/rfc2308.html", ["resolver-negative", "resolver-cache", "resolver-diagnosis"], "1998-03"),
  make("IETF", "RFC 9520 · Negative Caching of DNS Resolution Failures", "https://www.rfc-editor.org/rfc/rfc9520.html", ["resolver-failure", "resolver-diagnosis"], "2023-12"),
];

export const cacheControlSources: BoundarySource[] = [
  make("IETF", "RFC 9111 · HTTP Caching", "https://www.rfc-editor.org/rfc/rfc9111.html", ["cache-control-store", "cache-control-fresh", "cache-control-validate", "cache-control-shared-detail", "cache-control-key"], "2022-06"),
  make("IETF", "RFC 9110 · HTTP Semantics", "https://www.rfc-editor.org/rfc/rfc9110.html", ["cache-control-method", "cache-control-vary"], "2022-06"),
  make("IETF", "RFC 5861 · HTTP Cache-Control Extensions for Stale Content", "https://www.rfc-editor.org/rfc/rfc5861.html", ["cache-control-stale", "cache-control-error"], "2010-04"),
  make("IETF", "RFC 8246 · HTTP Immutable Responses", "https://www.rfc-editor.org/rfc/rfc8246.html", ["cache-control-immutable"], "2017-09"),
];
