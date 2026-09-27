const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });

export const balanceSources = [
  source('NGINX', 'Using nginx as HTTP load balancer', 'https://nginx.org/en/docs/http/load_balancing.html', ['balance-role', 'balance-round-robin', 'balance-affinity']),
  source('Amazon Web Services', 'Target groups for your Application Load Balancers', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html', ['balance-targets']),
  source('Amazon Web Services', 'Health checks for Application Load Balancer target groups', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html', ['balance-health', 'balance-fail-open']),
  source('Cloudflare', 'Traffic steering', 'https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/', ['balance-steering'], '2026-09-10'),
];

export const authSources = [
  source('NIST', 'SP 800-63B-4 — Authentication and Authenticator Management', 'https://pages.nist.gov/800-63-4/sp800-63b.html', ['auth-definition', 'auth-session'], '2025-07'),
  source('MDN contributors', 'HTTP authentication', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication', ['auth-challenge']),
  source('OWASP Cheat Sheet Series', 'Authentication Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', ['auth-failure']),
  source('MDN contributors', 'Web Authentication API', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API', ['auth-webauthn']),
];

export const authorizationSources = [
  source('OWASP Cheat Sheet Series', 'Authorization Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html', ['authorization-definition', 'authorization-every-request', 'authorization-default']),
  source('Amazon Web Services', 'How AWS enforcement code logic evaluates requests to allow or deny access', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic_policy-eval-denyallow.html', ['authorization-policy']),
  source('David Ferraiolo, John Barkley, Richard Kuhn · NIST', 'A Role-Based Access Control Model and Reference Implementation Within a Corporate Intranet', 'https://csrc.nist.gov/pubs/journal/1999/02/a-rolebased-access-control-model-and-reference-imp/final', ['authorization-role'], '1999-02-01'),
  source('IETF', 'RFC 9110 — HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html', ['authorization-status'], '2022-06'),
];
