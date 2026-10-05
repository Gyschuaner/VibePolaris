import { source } from "./shared";

export const transformerSources = [
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["transformer-origin", "transformer-attention"]),
  source("Dive into Deep Learning", "The Transformer Architecture", "https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html", ["transformer-input", "transformer-block", "transformer-feedforward", "transformer-decoder"]),
  source("PyTorch", "TransformerEncoder", "https://docs.pytorch.org/docs/stable/generated/torch.nn.TransformerEncoder.html", ["transformer-stack"]),
  source("Hugging Face", "Transformers", "https://huggingface.co/docs/transformers/main/en/index", ["transformer-ecosystem"]),
  source("Hugging Face Hub", "Using transformers at Hugging Face", "https://huggingface.co/docs/hub/en/transformers", ["transformer-blueprint"]),
];
