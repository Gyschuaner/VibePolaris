import { source } from "./shared";

export const containerImageSources = [
  source("Open Container Initiative", "Image specification", "https://github.com/opencontainers/image-spec", ["image-definition"]),
  source("Docker Docs", "Understanding image layers", "https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/", ["image-layers"]),
  source("Docker Docs", "Storage", "https://docs.docker.com/engine/storage/", ["image-writable", "image-recreate"]),
  source("Docker Docs", "Storage drivers", "https://docs.docker.com/engine/storage/drivers/", ["image-copy"]),
  source("NIST", "Application Container Security Guide", "https://csrc.nist.gov/pubs/sp/800/190/final", ["image-security"]),
];
