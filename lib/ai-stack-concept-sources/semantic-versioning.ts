import { source } from "./shared";

export const semanticVersioningSources = [
  source("Semantic Versioning", "Semantic Versioning 2.0.0", "https://semver.org/spec/v2.0.0.html", ["semver-definition-text", "semver-choice-text", "semver-boundary-text"]),
  source("npm", "About semantic versioning", "https://docs.npmjs.com/about-semantic-versioning", ["semver-definition-text", "semver-range-text"]),
  source("npm", "package.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-json/", ["semver-choice-text", "semver-range-text"]),
  source("Node.js", "An introduction to the npm package manager", "https://nodejs.org/learn/getting-started/an-introduction-to-the-npm-package-manager", ["semver-range-text", "semver-boundary-text"]),
];
