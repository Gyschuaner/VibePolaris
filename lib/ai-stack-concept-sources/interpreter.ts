import { source } from "./shared";

export const interpreterSources = [
  source("Python", "Execution model", "https://docs.python.org/3/reference/executionmodel.html", ["interpreter-definition-text", "interpreter-execution"]),
  source("Python", "dis — Disassembler for Python bytecode", "https://docs.python.org/3/library/dis.html", ["interpreter-bytecode"]),
  source("ECMA-262", "Executable Code and Execution Contexts", "https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html", ["interpreter-execution", "interpreter-jit", "interpreter-boundary-text"]),
  source("Lua", "Lua 5.4 Reference Manual", "https://www.lua.org/manual/5.4/manual.html", ["interpreter-boundary-text", "interpreter-lua"]),
];
