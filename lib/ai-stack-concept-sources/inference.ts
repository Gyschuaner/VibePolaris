import { source } from "./shared";

export const inferenceSources = [
  source("Hugging Face", "Pipeline tutorial", "https://huggingface.co/docs/transformers/pipeline_tutorial", ["inference-pipeline", "inference-batching", "inference-optimization"]),
  source("Hugging Face", "Pipelines API", "https://huggingface.co/docs/transformers/main_classes/pipelines", ["inference-components", "inference-output", "inference-batching"]),
  source("PyTorch", "inference_mode", "https://docs.pytorch.org/docs/stable/generated/torch.autograd.grad_mode.inference_mode.html", ["inference-mode", "inference-eval"]),
  source("NVIDIA Dynamo", "Disaggregated Serving", "https://docs.nvidia.com/dynamo/v1.2.0/design-docs/disaggregated-serving", ["inference-prefill", "inference-decode", "inference-latency"]),
  source("NVIDIA", "TensorRT-LLM documentation", "https://docs.nvidia.com/tensorrt-llm/index.html?ncid=no-ncid", ["inference-optimization"]),
];
