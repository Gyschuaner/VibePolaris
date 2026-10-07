import { source } from "./shared";

export const compilerSources = [
  source("LLVM", "My First Language Frontend", "https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html", ["compiler-definition-text", "compiler-types", "compiler-config"]),
  source("GCC", "Internals", "https://gcc.gnu.org/onlinedocs/gccint/", ["compiler-runtime", "compiler-target"]),
  source("MDN", "WebAssembly concepts", "https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Concepts", ["compiler-target", "compiler-runtime"]),
  source("ECMA International", "ECMA-335 CLI Standard", "https://www.ecma-international.org/publications-and-standards/standards/ecma-335/", ["compiler-runtime", "compiler-target"]),
];
