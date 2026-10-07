import { source } from "./shared";

export const dataContaminationSources = [
  source("Sainz et al.", "NLP Evaluation in trouble: On the Need to Measure LLM Data Contamination for each Benchmark", "https://arxiv.org/abs/2310.18018", ["contamination-definition", "contamination-detection"]),
  source("Xu et al.", "Benchmark Data Contamination of Large Language Models: A Survey", "https://arxiv.org/abs/2406.04244", ["contamination-definition", "contamination-boundary"]),
  source("Deng et al.", "Investigating Data Contamination in Modern Benchmarks for Large Language Models", "https://arxiv.org/abs/2311.09783", ["contamination-detection", "contamination-boundary"]),
  source("Li et al.", "An Open-Source Data Contamination Report for Large Language Models", "https://aclanthology.org/2024.findings-emnlp.30/", ["contamination-lab"]),
];
