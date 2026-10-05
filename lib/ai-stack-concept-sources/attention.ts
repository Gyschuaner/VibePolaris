import { source } from "./shared";

export const attentionSources = [
  source("Dive into Deep Learning", "Queries, Keys, and Values", "https://d2l.ai/chapter_attention-mechanisms-and-transformers/queries-keys-values.html", ["attention-qkv", "attention-weights"]),
  source("Dive into Deep Learning", "Multi-Head Attention", "https://d2l.ai/chapter_attention-mechanisms-and-transformers/multihead-attention.html", ["attention-multihead", "attention-concat"]),
  source("Vaswani et al.", "Attention Is All You Need", "https://arxiv.org/abs/1706.03762", ["attention-original", "attention-scale"]),
  source("PyTorch", "MultiheadAttention", "https://docs.pytorch.org/docs/stable/generated/torch.nn.modules.activation.MultiheadAttention.html", ["attention-pytorch", "attention-mask"]),
  source("TensorFlow", "tf.keras.layers.MultiHeadAttention", "https://www.tensorflow.org/api_docs/python/tf/keras/layers/MultiHeadAttention", ["attention-self", "attention-output"]),
];
