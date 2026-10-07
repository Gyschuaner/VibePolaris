import { source } from "./shared";

export const speculativeDecodingSources = [
  source("Leviathan, Kalman & Matias", "Fast Inference from Transformers via Speculative Decoding", "https://arxiv.org/abs/2211.17192", ["speculative-definition", "speculative-verification"]),
  source("Hugging Face", "Generation strategies: speculative decoding", "https://huggingface.co/docs/transformers/v4.52.2/en/generation_strategies", ["speculative-definition", "speculative-boundary"]),
  source("Chen et al.", "Accelerating Large Language Model Decoding with Speculative Sampling", "https://arxiv.org/abs/2302.01318", ["speculative-verification", "speculative-boundary"]),
  source("Google Research", "Looking back at speculative decoding", "https://research.google/blog/looking-back-at-speculative-decoding/", ["speculative-lab"]),
];
