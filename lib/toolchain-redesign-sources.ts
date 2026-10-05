import { source } from "./ai-stack-concept-sources/shared";

export const lockfileSources = [
  source("npm Docs", "package-lock.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json", ["lock-definition", "lock-boundary"]),
  source("npm Docs", "npm ci", "https://docs.npmjs.com/cli/v11/commands/npm-ci", ["lock-reproduce", "lock-change"]),
  source("npm Docs", "package.json", "https://docs.npmjs.com/cli/v11/configuring-npm/package-json/", ["lock-definition"]),
  source("pnpm Docs", "Reading pnpm-lock.yaml", "https://pnpm.io/lockfile", ["lock-reproduce", "lock-boundary"]),
];

export const monorepoSources = [
  source("npm Docs", "Workspaces", "https://docs.npmjs.com/cli/v11/using-npm/workspaces", ["repo-definition", "repo-impact"]),
  source("npm Docs", "package.json workspaces", "https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#workspaces", ["repo-definition"]),
  source("pnpm Docs", "Workspace", "https://pnpm.io/workspaces", ["repo-impact", "repo-boundary"]),
  source("Bazel", "Build Encyclopedia", "https://bazel.build/concepts/build-ref", ["repo-impact", "repo-boundary"]),
];

export const environmentVariableSources = [
  source("Node.js Docs", "process.env", "https://nodejs.org/api/process.html#processenv", ["env-snapshot", "env-restart"]),
  source("Vite Docs", "Env Variables and Modes", "https://vite.dev/guide/env-and-mode", ["env-public"]),
  source("Next.js Docs", "Environment Variables", "https://nextjs.org/docs/app/guides/environment-variables", ["env-public", "env-restart"]),
  source("Docker Docs", "Set environment variables", "https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/", ["env-snapshot", "env-restart"]),
];

export const sourceMapSources = [
  source("ECMA TC39", "Source Map specification", "https://tc39.es/ecma426/", ["map-contract", "map-boundary"]),
  source("TypeScript Docs", "sourceMap", "https://www.typescriptlang.org/tsconfig/sourceMap.html", ["map-contract"]),
  source("Chrome DevTools", "JavaScript source maps", "https://developer.chrome.com/docs/devtools/javascript/source-maps", ["map-lookup", "map-security"]),
  source("MDN", "Use a source map", "https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map", ["map-lookup", "map-boundary"]),
];

export const linterSources = [
  source("ESLint Docs", "Core concepts", "https://eslint.org/docs/latest/use/core-concepts/", ["lint-parse", "lint-boundary"]),
  source("ESLint Docs", "Configure rules", "https://eslint.org/docs/latest/use/configure/rules", ["lint-rules", "lint-change"]),
  source("typescript-eslint", "Getting Started", "https://typescript-eslint.io/getting-started/", ["lint-parse", "lint-boundary"]),
  source("StandardJS", "JavaScript Standard Style", "https://github.com/standard/standard", ["lint-rules"]),
];

export const formatterSources = [
  source("Prettier Docs", "Why Prettier?", "https://prettier.io/docs/en/why-prettier", ["format-goal", "format-boundary"]),
  source("Prettier Docs", "Options", "https://prettier.io/docs/en/options.html", ["format-width", "format-boundary"]),
  source("Go Blog", "gofmt", "https://go.dev/blog/gofmt", ["format-goal"]),
  source("rustfmt", "Configuration", "https://rust-lang.github.io/rustfmt/", ["format-width", "format-boundary"]),
];

export const expressionSources = [
  source("ECMA TC39", "Expressions", "https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html", ["expression-value", "expression-order"]),
  source("MDN", "Expressions and operators", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators", ["expression-value", "expression-tree"]),
  source("Python Docs", "Expressions", "https://docs.python.org/3/reference/expressions.html", ["expression-order", "expression-boundary"]),
  source("MDN", "JavaScript operators", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators", ["expression-tree", "expression-boundary"]),
];

export const functionSources = [
  source("MDN", "Functions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", ["function-call", "function-scope", "function-boundary"]),
  source("ECMA TC39", "Functions and classes", "https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html", ["function-call", "function-scope"]),
  source("Python Docs", "Defining functions", "https://docs.python.org/3/tutorial/controlflow.html#defining-functions", ["function-call", "function-scope"]),
  source("TypeScript Docs", "More on Functions", "https://www.typescriptlang.org/docs/handbook/2/functions.html", ["function-call", "function-boundary"]),
];

export const parameterSources = [
  source("MDN", "Functions", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions", ["parameter-names", "parameter-default"]),
  source("ECMA TC39", "Functions and classes", "https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html", ["parameter-bind", "parameter-boundary"]),
  source("Python Docs", "Defining functions", "https://docs.python.org/3/tutorial/controlflow.html#defining-functions", ["parameter-default", "parameter-boundary"]),
  source("TypeScript Docs", "Optional parameters", "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters", ["parameter-bind", "parameter-default"]),
];

export const returnValueSources = [
  source("MDN", "return statement", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return", ["return-channel", "return-undefined"]),
  source("ECMA TC39", "Return Statement", "https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-return-statement", ["return-channel"]),
  source("MDN", "Console API", "https://developer.mozilla.org/en-US/docs/Web/API/console", ["return-output"]),
  source("Python Docs", "The return statement", "https://docs.python.org/3/reference/simple_stmts.html#the-return-statement", ["return-channel", "return-boundary"]),
  source("TypeScript Docs", "More on Functions", "https://www.typescriptlang.org/docs/handbook/2/functions.html", ["return-channel", "return-boundary"]),
];
