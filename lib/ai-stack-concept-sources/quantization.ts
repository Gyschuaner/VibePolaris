import { source } from "./shared";

export const quantizationSources = [
  source("Hugging Face", "Quantization concepts", "https://huggingface.co/docs/transformers/v4.57.0/en/quantization/concept_guide", ["quantization-definition", "quantization-choices"]),
  source("Frantar et al.", "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers", "https://arxiv.org/abs/2210.17323", ["quantization-definition", "quantization-boundary"]),
  source("Lin et al.", "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration", "https://arxiv.org/abs/2306.00978", ["quantization-choices", "quantization-boundary"]),
  source("Hugging Face", "Quantization overview for text generation inference", "https://huggingface.co/docs/text-generation-inference/en/conceptual/quantization", ["quantization-deploy"]),
];
