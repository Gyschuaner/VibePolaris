const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });

export const sessionSources = [
  source('NIST', 'SP 800-63B-4 — Session Management', 'https://pages.nist.gov/800-63-4/sp800-63b/session/', ['session-purpose', 'session-secret', 'session-expiry'], '2025-07'),
  source('IETF', 'RFC 6265 — HTTP State Management Mechanism', 'https://www.rfc-editor.org/rfc/rfc6265.html', ['session-cookie'], '2011-04'),
  source('MDN contributors', 'Set-Cookie header', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie', ['session-flags']),
  source('OWASP Cheat Sheet Series', 'Session Management Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html', ['session-rotate', 'session-logout']),
];

export const jwtSources = [
  source('IETF', 'RFC 7519 — JSON Web Token (JWT)', 'https://www.rfc-editor.org/rfc/rfc7519.html', ['jwt-format', 'jwt-claims'], '2015-05'),
  source('IETF', 'RFC 7515 — JSON Web Signature (JWS)', 'https://www.rfc-editor.org/rfc/rfc7515.html', ['jwt-signature', 'jwt-tamper'], '2015-05'),
  source('IETF', 'RFC 7516 — JSON Web Encryption (JWE)', 'https://www.rfc-editor.org/rfc/rfc7516.html', ['jwt-encryption'], '2015-05'),
  source('IETF', 'RFC 8725 — JSON Web Token Best Current Practices', 'https://www.rfc-editor.org/rfc/rfc8725.html', ['jwt-validation', 'jwt-context'], '2020-02'),
];

export const oauthSources = [
  source('IETF', 'RFC 6749 — The OAuth 2.0 Authorization Framework', 'https://www.rfc-editor.org/rfc/rfc6749.html', ['oauth-purpose', 'oauth-code', 'oauth-token-format'], '2012-10'),
  source('IETF', 'RFC 7636 — Proof Key for Code Exchange', 'https://www.rfc-editor.org/rfc/rfc7636.html', ['oauth-pkce'], '2015-09'),
  source('IETF', 'RFC 9700 — Best Current Practice for OAuth 2.0 Security', 'https://www.rfc-editor.org/rfc/rfc9700.html', ['oauth-scope', 'oauth-current'], '2025-01'),
  source('IETF', 'RFC 6750 — OAuth 2.0 Bearer Token Usage', 'https://www.rfc-editor.org/rfc/rfc6750.html', ['oauth-bearer'], '2012-10'),
  source('OpenID Foundation', 'OpenID Connect Core 1.0', 'https://openid.net/specs/openid-connect-core-1_0.html', ['oauth-identity']),
];
