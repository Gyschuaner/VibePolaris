import { source } from "./shared";

export const dependencySources = [
  source("npm", "package.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-json", ["dependency-definition-text", "dependency-types-text", "dependency-resolution-text"]),
  source("npm", "package-lock.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json", ["dependency-lock-text", "dependency-boundary-text"]),
  source("Semantic Versioning", "Semantic Versioning 2.0.0", "https://semver.org/", ["dependency-resolution-text"]),
  source("Node.js", "Modules: Packages", "https://nodejs.org/api/packages.html", ["dependency-definition-text", "dependency-boundary-text"]),
  source("npm", "Scripts", "https://docs.npmjs.com/cli/v11/using-npm/scripts", ["dependency-types-text", "dependency-boundary-text"]),
];
