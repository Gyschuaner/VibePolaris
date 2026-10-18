import { source } from "./ai-stack-concept-sources/shared";

export const typescriptSources = [
  source("TypeScript 官方手册", "TypeScript for the New Programmer", "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html", ["ts-definition", "ts-erasure"]),
  source("TypeScript 官方手册", "Everyday Types", "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html", ["ts-parameters", "ts-inference", "ts-assertion", "ts-any"]),
  source("TypeScript 官方手册", "Narrowing", "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", ["ts-runtime-check"]),
  source("TypeScript 官方配置参考", "noEmitOnError", "https://www.typescriptlang.org/tsconfig/noEmitOnError.html", ["ts-emit"]),
  source("MDN", "Addition (+)", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition", ["ts-addition"]),
];
