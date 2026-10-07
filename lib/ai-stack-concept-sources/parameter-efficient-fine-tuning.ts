import { source } from "./shared";

export const parameterEfficientFineTuningSources = [
  source("Hugging Face", "Parameter efficient fine-tuning", "https://huggingface.co/docs/transformers/peft", ["peft-definition", "peft-lab"]),
  source("Hu et al.", "LoRA: Low-Rank Adaptation of Large Language Models", "https://arxiv.org/abs/2106.09685", ["peft-definition", "peft-adapter"]),
  source("Dettmers et al.", "QLoRA: Efficient Finetuning of Quantized LLMs", "https://arxiv.org/abs/2305.14314", ["peft-adapter", "peft-boundary"]),
  source("Lester, Al-Rfou & Constant", "The Power of Scale for Parameter-Efficient Prompt Tuning", "https://arxiv.org/abs/2104.08691", ["peft-lab", "peft-boundary"]),
];
