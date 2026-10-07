import { source } from "./shared";

export const beamSearchSources = [
  source("Sutskever, Vinyals & Le", "Sequence to Sequence Learning with Neural Networks", "https://arxiv.org/abs/1409.3215", ["beam-definition", "beam-search-space"]),
  source("Wu et al.", "Google's Neural Machine Translation System", "https://arxiv.org/abs/1609.08144", ["beam-search-space", "beam-boundary"]),
  source("Hugging Face", "Generation strategies: beam search", "https://huggingface.co/docs/transformers/v4.52.2/en/generation_strategies", ["beam-definition", "beam-lab"]),
  source("Hugging Face", "Generation configuration", "https://huggingface.co/docs/transformers/main_classes/text_generation", ["beam-lab", "beam-boundary"]),
];
