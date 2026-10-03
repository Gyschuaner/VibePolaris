import { source } from "./shared";

export const executionSandboxSources = [
  source("OpenAI", "Code Interpreter", "https://developers.openai.com/api/docs/guides/tools-code-interpreter", ["sandbox-runtime"]),
  source("OpenAI", "Sandbox security", "https://developers.openai.com/api/docs/guides/agents-api/environments/security", ["sandbox-network"]),
  source("Docker", "Docker Engine security", "https://docs.docker.com/engine/security/", ["sandbox-isolation"]),
  source("Docker", "Rootless mode", "https://docs.docker.com/engine/security/rootless/", ["sandbox-rootless"]),
  source("NIST", "SP 800-190: Application Container Security Guide", "https://csrc.nist.gov/pubs/sp/800/190/final", ["sandbox-boundary"]),
];
