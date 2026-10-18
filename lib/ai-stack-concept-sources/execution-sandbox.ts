import { source } from "./shared";

export const executionSandboxSources = [
  source("Docker", "Docker Engine security", "https://docs.docker.com/engine/security/", ["sandbox-definition", "sandbox-isolation"]),
  source("Docker", "Bind mounts", "https://docs.docker.com/engine/storage/bind-mounts/", ["sandbox-mount"]),
  source("Docker", "None network driver", "https://docs.docker.com/engine/network/drivers/none/", ["sandbox-net-policy"]),
  source("Docker", "Resource constraints", "https://docs.docker.com/engine/containers/resource_constraints/", ["sandbox-budget"]),
  source("Docker", "Storage", "https://docs.docker.com/engine/storage/", ["sandbox-storage"]),
  source("gVisor", "Security Model", "https://gvisor.dev/docs/architecture_guide/security/", ["sandbox-gvisor"]),
];
