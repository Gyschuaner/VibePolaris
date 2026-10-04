import { source } from "./shared";

export const kvCacheSources = [
  source("Hugging Face", "Caching", "https://huggingface.co/docs/transformers/en/cache_explanation", ["kv-cache-recompute", "kv-cache-qkv", "kv-cache-inference"]),
  source("Hugging Face", "Cache strategies", "https://huggingface.co/docs/transformers/kv_cache", ["kv-cache-types", "kv-cache-prefix", "kv-cache-memory"]),
  source("vLLM", "Paged Attention", "https://docs.vllm.ai/en/latest/design/paged_attention/", ["kv-cache-blocks", "kv-cache-paged"]),
  source("NVIDIA Dynamo", "Glossary", "https://docs.nvidia.com/dynamo/dev/reference/glossary", ["kv-cache-router", "kv-cache-definition"]),
  source("NVIDIA Dynamo", "Set up KV Cache Offloading", "https://docs.nvidia.com/dynamo/latest/kubernetes/kv-cache-offloading/overview", ["kv-cache-offload", "kv-cache-tier"]),
];
