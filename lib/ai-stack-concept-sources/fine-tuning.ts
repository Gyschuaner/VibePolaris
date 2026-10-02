import { source } from "./shared";

export const fineTuningSources = [
  source("OpenAI", "Model optimization", "https://developers.openai.com/api/docs/guides/model-optimization", ["tuning-cycle", "tuning-eval"]),
  source("OpenAI", "Supervised fine-tuning", "https://developers.openai.com/api/docs/guides/supervised-fine-tuning", ["tuning-data", "tuning-validation"]),
  source("Hugging Face", "Fine-tuning", "https://huggingface.co/docs/transformers/training", ["tuning-training"]),
  source("Hugging Face", "PEFT", "https://huggingface.co/docs/peft/index", ["tuning-parameters"]),
  source("Hu et al.", "LoRA: Low-Rank Adaptation of Large Language Models", "https://arxiv.org/abs/2106.09685", ["tuning-lora"]),
];
