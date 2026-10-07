import { source } from "./ai-stack-concept-sources/shared";

export const tokenizationConceptSources = [
  source("OpenAI", "tiktoken · BPE tokenizer", "https://github.com/openai/tiktoken", ["tokenization-definition-claim", "tokenization-bpe-steps", "tokenization-roundtrip"]),
  source("OpenAI", "How to count tokens with tiktoken", "https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken", ["tokenization-count-claim"]),
  source("Hugging Face", "Tokenization algorithms", "https://huggingface.co/docs/transformers/main/en/tokenizer_summary", ["tokenization-subword", "tokenization-bpe-steps", "tokenization-boundary-claim"]),
  source("Taku Kudo、John Richardson", "SentencePiece: A simple and language independent subword tokenizer", "https://arxiv.org/abs/1808.06226", ["tokenization-language"], "2018"),
  source("Rico Sennrich、Barry Haddow、Alexandra Birch", "Neural Machine Translation of Rare Words with Subword Units", "https://arxiv.org/abs/1508.07909", ["tokenization-subword"], "2015"),
];
