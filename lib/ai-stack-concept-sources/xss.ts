import { source } from "./shared";

export const xssSources = [
  source("OWASP", "Cross Site Scripting Prevention Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", ["xss-context", "xss-defense-api"]),
  source("OWASP", "Cross Site Scripting", "https://owasp.org/www-community/attacks/xss/", ["xss-attack"]),
  source("MDN Web Docs", "Element.innerHTML", "https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML", ["xss-inner"]),
  source("MDN Web Docs", "Node.textContent", "https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent", ["xss-text"]),
  source("MDN Web Docs", "Trusted Types API", "https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API", ["xss-trusted"]),
];
