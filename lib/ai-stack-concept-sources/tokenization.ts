import { source } from "./shared";

export const tokenizationSources = [
  source("OpenAI", "tiktoken", "https://github.com/openai/tiktoken", ["tokenizer-encoding-evidence", "tokenizer-count"]),
  source("OpenAI Cookbook", "How to count tokens with tiktoken", "https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken", ["tokenizer-count", "tokenizer-budget-evidence"]),
  source("Hugging Face", "Summary of the tokenizers", "https://huggingface.co/docs/transformers/main/en/tokenizer_summary", ["tokenizer-encoding-evidence", "tokenizer-boundary"]),
  source("Kudo and Richardson", "SentencePiece", "https://arxiv.org/abs/1808.06226", ["tokenizer-unigram", "tokenizer-boundary"]),
  source("Sennrich et al.", "Neural Machine Translation of Rare Words with Subword Units", "https://arxiv.org/abs/1508.07909", ["tokenizer-bpe-evidence", "tokenizer-boundary"]),
];
