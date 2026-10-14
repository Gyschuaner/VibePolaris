import { source } from "./shared";

export const dependencySources = [
  source("npm", "package.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-json/", ["dependency-definition-text", "dependency-types-text"]),
  source("npm", "npm ls", "https://docs.npmjs.com/cli/v11/commands/npm-ls/", ["dependency-chain", "dependency-layout"]),
  source("npm", "package-lock.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/", ["dependency-lock-text"]),
  source("npm", "npm ci", "https://docs.npmjs.com/cli/v11/commands/npm-ci/", ["dependency-layout", "dependency-ci"]),
  source("npm", "npm prune", "https://docs.npmjs.com/cli/v11/commands/npm-prune/", ["dependency-prune"]),
];
