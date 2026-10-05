import { source } from "./shared";

export const pretrainingSources = [
  source("Hugging Face", "Causal language modeling", "https://huggingface.co/docs/transformers/en/tasks/language_modeling", ["pretraining-causal"]),
  source("PyTorch", "CrossEntropyLoss", "https://docs.pytorch.org/docs/2.9/generated/torch.nn.CrossEntropyLoss.html", ["pretraining-loss", "pretraining-gradient"]),
  source("Devlin et al.", "BERT: Pre-training of Deep Bidirectional Transformers", "https://arxiv.org/abs/1810.04805", ["pretraining-masked", "pretraining-bert"]),
  source("Google Research", "BERT README", "https://github.com/google-research/bert/blob/master/README.md", ["pretraining-corpus", "pretraining-cost"]),
  source("Brown et al.", "Language Models are Few-Shot Learners", "https://arxiv.org/abs/2005.14165", ["pretraining-data", "pretraining-finetune"]),
];
