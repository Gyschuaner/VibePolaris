import { source } from "./shared";

export const speculativeDecodingSources = [
  source("Leviathan, Kalman & Matias", "Fast Inference from Transformers via Speculative Decoding", "https://arxiv.org/abs/2211.17192", ["speculative-definition", "speculative-verification"]),
  source("Hugging Face", "Generation strategies: speculative decoding", "https://huggingface.co/docs/transformers/v4.52.2/en/generation_strategies", ["speculative-definition", "speculative-boundary"]),
  source("Leviathan et al.", "Fast Inference from Transformers via Speculative Decoding", "https://proceedings.mlr.press/v202/leviathan23a.pdf", ["speculative-verification", "speculative-boundary"]),
  source("Google Research", "Looking back at speculative decoding", "https://research.google/blog/looking-back-at-speculative-decoding/", ["speculative-lab"]),
];
